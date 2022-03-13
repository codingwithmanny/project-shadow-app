// Imports
// ========================================================
import React, { useCallback, useEffect, useRef, useState } from "react";
import ethers from 'ethers';
import { useConnect, useAccount, useNetwork, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

// Presentation components
import { Check } from "react-feather";
import Text from "../../components/Label";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import AuthLayout from "../../layouts/Auth";
import Loader from "../../components/Loader";
import { PUBLIC_VERIFY, PUBLIC_NONCE } from "../../queries";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";

// Main Page
// ========================================================
const PublicVerify = () => {

  const isMounted = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { id } = useParams();
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount()
  const [{ data: networkData }] = useNetwork()
  const [message, setMessage] = useState<SiweMessage>();
  const [signError, setSignError] = useState('');
  const [signature, setSignature] = useState('');
  const [, signMessage] = useSignMessage()

  // Requests
  /**
   * READ
   */
  const { isLoading: isRetrieving, data: verifyGetData, error: verifyGetError, mutate: verifyGet } = useMutation(PUBLIC_VERIFY.GET);

  /**
   * CREATE
   */
  const { isLoading: isSubmitting, data: verifyCreateData, error: verifyCreateError, mutate: verifyCreate } = useMutation(PUBLIC_VERIFY.CREATE);

  /**
   * CREATE
   */
  const { isLoading: isGenerating, data: nonceCreateData, error: nonceCreateError, mutate: nonceCreate, reset: nonceReset } = useMutation(PUBLIC_NONCE.CREATE);

  // Functions
  const sign = useCallback(async (nonceResult) => {
    console.log('hello');
    console.log(nonceResult)

    try {
      const address = accountData?.address
      const chainId = networkData?.chain?.id
      if (!address || !chainId) return

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign with Ethereum on Shadow.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: nonceResult.nonce as string,
        issuedAt: nonceResult.createdAt as string
      });
      const signRes: any = await signMessage({ message: message.prepareMessage() });
      nonceReset();
      if (signRes.error) throw signRes.error;

      setMessage(message);
      setSignature(signRes.data);
    } catch (error: any) {
      setSignError(error);
    }
  }, [accountData, networkData]);

  /**
   * 
   */
  const onClickVerify = async () => {
    nonceCreate({
      payload: {
        formId: id
      }
    })
  };

  // Hooks
  /**
   * 
   */
  useEffect(() => {
    isMounted.current = true;

    verifyGet({ id });

    return () => {
      isMounted.current = false;
    }
  }, []);

  /**
   * 
   */
  useEffect(() => {
    if (!nonceCreateData || nonceCreateError) return;
    sign(nonceCreateData);
  }, [nonceCreateData]);

  /**
   * 
   */
  useEffect(() => {
    if (!signature || !message || !accountData || signError) return;
    console.log({
      id,
      payload: {
        address: accountData?.address,
        signature,
        message,
      }
    })
    verifyCreate({
      id,
      payload: {
        address: accountData?.address,
        signature,
        message,
      }
    })
  }, [signature, message]);

  /**
   * 
   */
  useEffect(() => {
    if (!verifyCreateData || verifyCreateError) return;
    setIsVerified(true);
  }, [verifyCreateData])

  // Render
  return <AuthLayout>
    <div className="max-w-md bg-white w-full pt-10 pb-12 px-8 m-4 lg:p-10 border border-gray-300 shadow-md rounded-md">
      {isRetrieving ? <Loader className="h-6 stroke-slate-100" />
        : !verifyGetError ? <div>
          <div className="mb-6 flex justify-center items-center">
            <Heading as="h1">{isVerified ? 'Wallet Verified!' : 'Wallet Validations'}</Heading>
          </div>

          <Text className="text-center mb-4">{accountData?.address ? isVerified ? 'You are confirmed.' : 'Verify Your Wallet.' : 'Connect Your Wallet.'}</Text>

          <div className="flex justify-center">
            {accountData?.address
              ? isVerified
                ? <div className="flex justify-center items-center">
                  <span className="bg-slate-500 w-12 h-12 rounded-full flex justify-center items-center"><Check className="text-slate-50" /></span>
                </div>
                : <div className="w-full">
                  <pre className="bg-slate-100 p-4 mb-4 overflow-scroll rounded-lg flex justify-center">
                    <code>{accountData?.address.slice(0, 5)}...{accountData?.address.slice(-4)}</code>
                  </pre>
                  <Button
                    className="w-full mb-4"
                    onClick={onClickVerify}
                  >
                    Verify
                  </Button>
                  <Button
                    variant="grayNoWidth"
                    className="w-full mb-4"
                    onClick={() => disconnect()}
                  >
                    Disconnect
                  </Button>
                </div>
              : <div className="w-full">
                {data.connectors.map((connector) => (
                  <Button
                    className="w-full mb-4"
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect(connector)}>
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                  </Button>
                ))}
              </div>}
          </div>
        </div> : <div>
          <div className="mb-6 flex justify-center items-center">
            <Heading as="h1">{(verifyGetError as any)?.message}</Heading>
          </div>
          <Text className="text-center mb-8">If you are seeting this perhaps the form<br /> is disabled or no longer exists.</Text>
        </div>}
    </div>
  </AuthLayout>;
};

// Exports
// ========================================================
export default PublicVerify;
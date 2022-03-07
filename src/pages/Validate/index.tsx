// Imports
// ========================================================
import React, { useEffect, useRef, useState } from "react";
import ethers from 'ethers';
import { useConnect, useAccount } from 'wagmi';

// Presentation components
import { Check } from "react-feather";
import Text from "../../components/Label";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import AuthLayout from "../../layouts/Auth";
import Loader from "../../components/Loader";
import { VERIFY } from "../../queries";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";

// Main Page
// ========================================================
const ValidatePage = () => {
  const isMounted = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { id } = useParams();
  const [{ data, error }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount()

  // Requests
  /**
   * READ
   */
  const { isLoading: isRetrieving, data: verifyGetData, error: verifyGetError, mutate: verifyGet } = useMutation(VERIFY.GET);

  // Hooks
  useEffect(() => {
    isMounted.current = true;

    verifyGet({ id });

    return () => {
      isMounted.current = false;
    }
  }, []);

  // Render
  return <AuthLayout>
    <div className="max-w-md bg-white w-full pt-10 pb-12 px-8 m-4 lg:p-10 border border-gray-300 shadow-md rounded-md">
      {isRetrieving ? <Loader className="h-6 stroke-slate-100" />
        : !verifyGetError ? <div>
          <div className="mb-6 flex justify-center items-center">
            <Heading as="h1">Wallet Validations</Heading>
          </div>

          <Text className="text-center mb-4">{accountData?.address ? 'Verify Your Wallet' : 'Connect Your Wallet'}</Text>

          <div className="flex justify-center">
            {accountData?.address
              ? <div className="w-full">
                <pre className="bg-slate-100 p-4 mb-4 overflow-scroll rounded-lg">
                  <code>{accountData?.address}</code>
                </pre>
                <Button
                  className="w-full mb-4"
                  onClick={() => { }}
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
export default ValidatePage;
// Imports
// ========================================================
import { useState, useEffect, useRef } from 'react';
import { useMutation } from 'react-query'
import { useAuth } from "../../providers/Supabase";
import { MEMBERS, ORGS } from '../../queries';
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import Button from "../../components/Button";
import Loader from '../../components/Loader';
import Label from '../../components/Label';
import Input from '../../components/Input';
import useDebounce from '../../hooks/useDebounce';

const getModalTitle = (modal: string) => {
  switch (modal) {
    case 'edit':
      return {
        modalTitle: 'Edit',
        modalDescription: 'Edit member details'
      }
    case 'create':
      return {
        modalTitle: 'Create',
        modalDescription: 'New member'
      }
    default:
      return {
        modalTitle: '',
        modalDescription: ''
      }
  };
}

// Main page
// ========================================================
const OrgSettings = ({ orgId }: { orgId: string }) => {
  // State / Props
  const [copied, setCopied] = useState({
    api: false,
    secret: false
  });
  const inputApiKey = useRef();
  const inputSecretKey = useRef();
  const isMounted = useRef(false);
  const { session } = useAuth();
  const [showModal, setShowModal] = useState('');

  // Requests
  /**
   * READ
   */
  const { isLoading: isRetrieving, data: orgReadData, error: orgReadError, mutate: orgRead } = useMutation(ORGS.READ);

  /**
   * CREATE
   */
  const { isLoading: isSubmitting, data: membersCreateData, error: membersCreateError, mutate: membersCreate } = useMutation(MEMBERS.CREATE);

  /**
   * UPDATE
   */
  const { isLoading: isUpdating, data: orgUpdateData, error: orgUpdateError, mutate: orgUpdate, reset: orgUpdateReset } = useMutation(ORGS.UPDATE);

  // Functions
  /**
   * 
   */
  const copyKey = (ref: React.MutableRefObject<undefined>) => () => {
    if (ref.current) {
      const current = (ref.current as any)
      current.select();
      current.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(current.value);

      if (current.id === 'apiKey') {
        setCopied({
          ...copied,
          api: true
        });
      } else if ('secretKey') {
        setCopied({
          ...copied,
          secret: true
        });
      }
      setTimeout(() => {
        setCopied({
          api: false,
          secret: false
        });
      }, 1000);
    }
  }

  /**
   * 
   */
  const onClickUpdateVisibility = () => {
    orgUpdate({
      token: session?.access_token, id: orgId, payload: {
        public: !orgReadData.public
      }
    });
  };

  // Hooks
  /**
   * 
   */
  useEffect(() => {
    isMounted.current = true;
    orgRead({ token: session?.access_token, id: orgId })
    return () => {
      isMounted.current = false;
    }
  }, []);

  /**
   * 
   */
  useEffect(() => {
    if (!isMounted.current || !membersCreateData || membersCreateError) return;
    setShowModal('');
  }, [membersCreateData]);

  /**
   * 
   */
  useEffect(() => {
    if (!orgUpdateData || orgUpdateError) return;
    orgRead({ token: session?.access_token, id: orgId });
  }, [orgUpdateData]);

  // Render
  return <div>
    <div className="flex items-center justify-between mb-8 h-12">
      <Heading as="h4">Settings</Heading>
    </div>
    <div className="w-full">
      {isRetrieving
        ? <div className={`rounded-lg bg-white border border-slate-200 p-8 transition-colors ease-in-out duration-200`}>
          <div className="flex items-center">
            <Loader className="stroke-slate-600 mr-4" />
            <Text>Loading...</Text>
          </div>
        </div>
        : <div className={`rounded-lg bg-white border border-slate-200 p-8 transition-colors ease-in-out duration-200`}>
          <div className="mb-8">
            <Label className="mb-2">Organization Name</Label>
            <Heading title={`${(orgReadData as any)?.name}`} as="h4" className="w-2/3 whitespace-nowrap overflow-hidden text-ellipsis">{(orgReadData as any)?.name}</Heading>
          </div>
          <div className="mb-8">
            <Label className="mb-2">API Key</Label>
            <div className="items-center grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <Input readOnly forwardRef={inputApiKey as any} id="apiKey" className="lg:col-span-4 xl:col-span-5" value={(orgReadData as any)?.apiKey ?? ''} />
              <Button onClick={copyKey(inputApiKey)} variant="gray">{copied.api ? 'Copied!' : 'Copy'}</Button>
            </div>
          </div>
          <div className="mb-8">
            <Label className="mb-2">Secret Key</Label>
            <div className="items-center grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <Input readOnly forwardRef={inputSecretKey as any} id="secretKey" className="lg:col-span-4 xl:col-span-5" value={(orgReadData as any)?.secretKey ?? ''} />
              <Button onClick={copyKey(inputSecretKey)} variant="gray">{copied.secret ? 'Copied!' : 'Copy'}</Button>
            </div>
          </div>
          <div className="mb-4">
            <Label className="mb-2">Visibility</Label>
            <div className="flex items-center">
              <span onClick={onClickUpdateVisibility} className={`${isUpdating ? 'opacity-40' : ''}border mr-2 cursor-pointer relative block rounded-full w-20 overflow-hidden ${(orgReadData as any)?.public ? 'bg-green-500 ' : 'bg-slate-200'}`}>
                <span className={`flex ${(orgReadData as any)?.public ? 'justify-end ' : ''}  border-2 border-white w-full rounded-full`}>
                  <span className="block h-10 w-10 rounded-full bg-slate-700"></span>
                </span>
              </span>
              {isUpdating ? <Loader className="h-6 stroke-slate-600" /> : <Text>{(orgReadData as any)?.public ? 'Public' : 'Private'}</Text>}
            </div>
          </div>
        </div>
      }
    </div>
  </div>
}

// Exports
// ========================================================
export default OrgSettings;
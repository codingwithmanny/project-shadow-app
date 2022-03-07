// Imports
// ========================================================
import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from 'react-query'
import { Search } from 'react-feather';
import { useAuth } from "../../providers/Supabase";
import { MEMBERS, ORGS } from '../../queries';
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Label from '../../components/Label';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
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
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search);
  const isMounted = useRef(false);
  const { session } = useAuth();
  const [input, setInput] = useState<{
    name: string;
    walletAddress: string;
    enabled?: boolean;
  }>({
    name: '',
    walletAddress: '',
    enabled: undefined
  });
  const [showModal, setShowModal] = useState('');
  const { modalTitle, modalDescription } = getModalTitle(showModal)

  // Requests
  /**
   * READ
   */
  const { isLoading: isRetrieving, data: orgReadData, error: orgReadError, mutate: orgRead } = useMutation(ORGS.READ);

  /**
   * CREATE
   */
  const { isLoading: isSubmitting, data: membersCreateData, error: membersCreateError, mutate: membersCreate } = useMutation(MEMBERS.CREATE);

  // Functions
  /**
   * 
   */
  const onClickVisibility = () => {

  }

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

    // membersList({ token: session?.access_token, id: orgId });
    setShowModal('');
    setSearch('');
  }, [membersCreateData]);

  /**
   * 
   */
  useEffect(() => {
    if (!isMounted.current) return;
    // membersList({ token: session?.access_token, id: orgId, q: debouncedSearch });
  }, [debouncedSearch]);

  // Render
  return <div>
    <div className="flex items-center justify-between mb-8">
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
            <Input id="apiKey" className="w-full" value={(orgReadData as any)?.apiKey ?? ''} />
          </div>
          <div className="mb-8">
            <Label className="mb-2">Secret Key</Label>
            <Input id="secretKey" className="w-full" value={(orgReadData as any)?.secretKey ?? ''} />
          </div>
          <div className="mb-4">
            <Label className="mb-2">Visibility</Label>
            <div className="flex items-center">
              <span onClick={onClickVisibility} className={`border mr-2 cursor-pointer relative block rounded-full w-20 overflow-hidden ${(orgReadData as any)?.public ? 'bg-green-500 ' : 'bg-slate-200'}`}>
                <span className={`flex ${(orgReadData as any)?.public ? 'justify-end ' : ''}  border-2 border-white w-full rounded-full`}>
                  <span className="block h-10 w-10 rounded-full bg-slate-700"></span>
                </span>
              </span>
              <Text>{(orgReadData as any)?.public ? 'Public' : 'Private'}</Text>
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
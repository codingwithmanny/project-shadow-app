// Imports
// ========================================================
import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from 'react-query'
import { Search } from 'react-feather';
import { useAuth } from "../../providers/Supabase";
import { MEMBERS } from '../../queries';
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
const OrgMembers = ({ orgId }: { orgId: string }) => {
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
  const { isLoading: isRetrieving, data: membersListData, error: membersListError, mutate: membersList } = useMutation(MEMBERS.LIST);

  /**
   * CREATE
   */
  const { isLoading: isSubmitting, data: membersCreateData, error: membersCreateError, mutate: membersCreate } = useMutation(MEMBERS.CREATE);

  // Functions
  /**
   * 
   */
  const onClickAddMember = () => {
    setInput({
      name: '',
      walletAddress: '',
      enabled: undefined
    });
    setShowModal('create');
  }

  /**
   * 
   */
  const onClickEditMember = (id: string) => () => {
  }

  /**
   * 
   * @param field 
   * @returns 
   */
  const onChangeInput = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [field]: event.target.value
    });
  }

  /**
   * 
   * @param event 
   */
  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  /**
   * 
   * @param event 
   */
  const onSubmitFormCreate = (event: React.FormEvent<HTMLFormElement>) => {
    membersCreate({ token: session?.access_token, id: orgId, payload: input });
    event.preventDefault();
  }

  // Hooks
  /**
   * 
   */
  useEffect(() => {
    isMounted.current = true;
    membersList({ token: session?.access_token, id: orgId });

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
    membersList({ token: session?.access_token, id: orgId, q: debouncedSearch });
  }, [debouncedSearch]);

  // Render
  return <div>
    <div className="flex items-center justify-between mb-8">
      <Heading as="h4">Members</Heading>
      <Button onClick={onClickAddMember}>Add Member</Button>
    </div>
    <div className="relative block mb-8">
      <Search className="w-4 text-slate-400 absolute left-4 top-0 bottom-0 my-auto" />
      <Input value={search} onChange={onChangeSearch} disabled={isRetrieving} variant="none" className="w-full h-12 rounded-full pl-10 pr-6" type="search" placeholder="Search for members" />
    </div>
    <div className="w-full">
      {isRetrieving ? <div className={`rounded-lg bg-white border border-slate-200 p-8 transition-colors ease-in-out duration-200`}>
        <div className="flex items-center">
          <Loader className="stroke-slate-600 mr-4" />
          <Text>Loading...</Text>
        </div>
      </div> : membersListData && membersListData.length > 0 ?
        <div className="border border-slate-200 rounded-lg px-4">
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 text-left text-sm font-medium text-slate-500">Address</th>
                <th className="py-4 pl-4 text-left text-sm font-medium text-slate-500">Tags</th>
              </tr>
            </thead>
            <tbody>
              {membersListData.map((member: any) =>
                <tr key={`${member.id}`} onClick={onClickEditMember(member.id)} className="border-b border-l-slate-200 hover:bg-slate-50 cursor-pointer">
                  <td className="p-4 w-3/4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 block bg-slate-200 rounded-full mr-4"></div>
                      <code className="text-slate-500">{member?.walletAddress}</code>
                    </div>
                  </td>
                  <td className="p-4 w-1/4">
                    {/*<span className="items-center text-sm font-medium bg-slate-100 text-slate-600 rounded-full px-3 py-1">7 Tags</span>*/}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div> : <div className="w-full flex justify-center">
          <div className="rounded-lg bg-slate-100 py-16 lg:py-24 px-8 w-full">
            <Heading as="h4" className="text-center mb-2">{search ? 'No results' : 'Nothing yet!'}</Heading>
            <Text className="text-center mb-8">{search ? 'Try different keywords.' : 'Start by adding one.'}</Text>
            {!search ? <Button onClick={onClickAddMember} variant="gray" className="block mx-auto">Add Member</Button> : null}
          </div>
        </div>}
    </div>

    <Modal title={modalTitle} description={modalDescription} onClose={() => setShowModal('')} isVisible={showModal.length > 0} >
      {showModal === 'create'
        ? <form onSubmit={onSubmitFormCreate}>
          <div className="mb-6">
            <Label htmlFor="name" className="mb-2">Name</Label>
            <Input value={input?.name} onChange={onChangeInput('name')} disabled={isSubmitting} className="w-full" name="name" id="name" placeholder="Ex: John Wick" />
          </div>
          <div className="mb-6">
            <Label htmlFor="walletAddress" className="mb-2">Wallet Address</Label>
            <Input value={input?.walletAddress} onChange={onChangeInput('walletAddress')} disabled={isSubmitting} className="w-full" name="walletAddress" id="walletAddress" placeholder="Ex: 0x0123456789012345678901234567890123456789" />
          </div>
          {membersCreateError
            ? <div className=" bg-red-100 rounded p-4 mb-8 text-red-600">{(membersCreateError as any)?.message ?? 'Unknown error.'}</div>
            : null
          }
          <div className="flex justify-end">
            {!isSubmitting ? <Button onClick={() => {
              setShowModal('');
            }} variant="gray" disabled={isSubmitting} className="flex justify-center items-center mr-4" type="button">
              {isSubmitting ? <Loader className="h-6 stroke-slate-600" /> : 'Cancel'}
            </Button> : null}

            <Button className="flex justify-center items-center" type="submit">
              {isSubmitting ? <Loader className="h-6 stroke-slate-600" /> : 'Create'}
            </Button>
          </div>
        </form>
        : null}
    </Modal>
  </div>
}

// Exports
// ========================================================
export default OrgMembers;
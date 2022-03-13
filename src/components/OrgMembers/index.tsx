// Imports
// ========================================================
import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from 'react-query'
import { Filter, Search, X } from 'react-feather';
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
import Select from '../Select';

// Config
// ========================================================
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
    case 'delete':
      return {
        modalTitle: 'Confirm Deletion',
        modalDescription: 'Are you sure you want to delete?'
      }
    default:
      return {
        modalTitle: '',
        modalDescription: ''
      }
  };
};

// Main page
// ========================================================
const OrgMembers = ({ orgId }: { orgId: string }) => {
  // State / Props
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search);
  const isMounted = useRef(false);
  const { session } = useAuth();
  const [input, setInput] = useState<{
    id?: string;
    name: string;
    walletAddress: string;
    active?: boolean;
    validated?: Date;
  }>({
    id: undefined,
    name: '',
    walletAddress: '',
    active: undefined
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
  const { isLoading: isSubmitting, data: memberCreateData, error: memberCreateError, mutate: memberCreate } = useMutation(MEMBERS.CREATE);

  /**
   * UPDATE
   */
  const { isLoading: isUpdating, data: memberUpdateData, error: memberUpdateError, mutate: memberUpdate } = useMutation(MEMBERS.UPDATE);

  /**
   * DELETE
   */
  const { isLoading: isDeleting, data: memberDeleteData, error: memberDeleteError, mutate: memberDelete } = useMutation(MEMBERS.DELETE);

  // Functions
  /**
   * 
   */
  const onClickAddMember = () => {
    setInput({
      name: '',
      walletAddress: '',
      active: false
    });
    setShowModal('create');
  }

  /**
   * 
   */
  const onClickEditMember = (member: {
    id: string;
    name: string;
    walletAddress: string;
    active?: boolean;
  }) => (event?: any) => {
    console.log(event.key);
    if (event.key && (event.target instanceof HTMLTableRowElement && event.key !== 'Enter') || (event.key && !(event.target instanceof HTMLTableRowElement))) return;
    setInput(member);
    setShowModal('edit');
  };

  /**
   * 
   * @param member 
   * @returns 
   */
  const onClickDeleteMember = (member: {
    id: string;
    name: string;
    walletAddress: string;
    active?: boolean;
  }) => (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setInput(member);
    setShowModal('delete');
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
  };

  /**
   * 
   * @param event 
   */
  const onChangeSelect = (field: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInput({
      ...input,
      [field]: event.target.value === 'true'
    });
  };

  /**
   * 
   * @param event 
   */
  const onSubmitFormCreate = (event: React.FormEvent<HTMLFormElement>) => {
    memberCreate({ token: session?.access_token, id: orgId, payload: input });
    event.preventDefault();
  };

  /**
   * 
   * @param event 
   */
  const onSubmitFormUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    memberUpdate({ token: session?.access_token, id: orgId, payload: input });
    event.preventDefault();
  };

  /**
   * 
   */
  const onSubmitDelete = () => {
    memberDelete({ token: session?.access_token, id: orgId, payload: input });
  };

  // Hooks
  /**
   * 
   */
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    }
  }, []);

  /**
   * 
   */
  useEffect(() => {
    if (!isMounted.current || !memberCreateData || memberCreateError) return;
    membersList({ token: session?.access_token, id: orgId });
    setShowModal('');
    setSearch('');
  }, [memberCreateData]);

  /**
   * 
   */
  useEffect(() => {
    if (!isMounted.current || !memberUpdateData || memberUpdateError) return;
    membersList({ token: session?.access_token, id: orgId });
    setShowModal('');
    setSearch('');
  }, [memberUpdateData]);

  /**
   * 
   */
  useEffect(() => {
    if (!isMounted.current) return;
    membersList({ token: session?.access_token, id: orgId, q: debouncedSearch, include: 'tagsCount' });
  }, [debouncedSearch]);

  // Render
  return <div>
    <div className="flex items-center justify-between mb-8">
      <Heading as="h4">Members</Heading>
      <Button onClick={onClickAddMember}>Add Member</Button>
    </div>
    <div className="relative flex mb-8">
      <Search className="w-4 text-slate-400 absolute left-4 top-0 bottom-0 my-auto" />
      <Input value={search} onChange={onChangeSearch} disabled={isRetrieving} variant="none" className="w-full h-12 rounded-full pl-10 pr-6" type="search" placeholder="Search for members" />
      {/* <div className="ml-6 relative">
        <Button>
          <div className="w-6 h-6 block">
            <span className="bg-white mx-auto mt-2 mb-1 block w-5 rounded" style={{ height: '2px ' }}></span>
            <span className="bg-white mx-auto mb-1 block w-3 rounded" style={{ height: '2px ' }}></span>
            <span className="bg-white mx-auto block w-1 rounded" style={{ height: '2px ' }}></span>
          </div>
        </Button>
        <div className="absolute w-96 rounded-lg bg-white p-4 top-14 right-0 border border-slate-200 shadow-lg">
          <Input value={search} onChange={onChangeSearch} disabled={isRetrieving} variant="none" className="w-full h-10 bg-slate-50 rounded-full px-6 mb-4" type="search" placeholder="Search for tag" />
          <table>
            <tbody>
              <tr>
                <td>adsad</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
    <div className="w-full">
      {isRetrieving ? <div className={`rounded-lg bg-white border border-slate-200 p-8 transition-colors ease-in-out duration-200`}>
        <div className="flex items-center">
          <Loader className="stroke-slate-600 mr-4" />
          <Text>Loading...</Text>
        </div>
      </div> : membersListData && membersListData.length > 0 ?
        <div className="border border-slate-200 rounded-lg px-4 overflow-scroll">
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 text-left text-sm font-medium text-slate-500">Address</th>
                <th className="py-4 pl-4 text-left text-sm font-medium text-slate-500">Name</th>
                <th className="py-4 pl-4 text-left text-sm font-medium text-slate-500">Tags</th>
                <th className="py-4 pl-4 text-left text-sm font-medium text-slate-500">Validated</th>
                <th className="py-4 pl-4 text-left text-sm font-medium text-slate-500">Access</th>
              </tr>
            </thead>
            <tbody>
              {membersListData.map((member: any) =>
                <tr tabIndex={0} key={`${member.id}`} onKeyUp={onClickEditMember(member)} onClick={onClickEditMember(member)} className="border-b border-l-slate-200 hover:bg-slate-50 cursor-pointer">
                  <td className="p-4 w-2/6">
                    <div className="flex items-center">
                      <svg height="48" width="48" className="block h-12 w-12 fill-slate-200 mr-4">
                        <circle cx="24" cy="24" r="24" />
                        <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-400 w-12 font-medium text-center block">0x{member?.walletAddress.slice(2, 3)}</text>
                      </svg>
                      <code className="text-slate-500">{member?.walletAddress}</code>
                    </div>
                  </td>
                  <td className="p-4 w-1/6">
                    <Text>{member?.name}</Text>
                  </td>
                  <td className="p-4 w-1/6">
                    <Text><small>(Coming soon)</small></Text>
                  </td>
                  <td className="p-4 w-1/6">
                    <span className={`items-center text-sm font-medium ${member?.validated ? 'bg-blue-100 text-blue-400' : 'bg-slate-100 text-slate-400'} rounded-full px-3 py-1`}>{member?.validated ? 'Validated' : 'Incomplete'}</span>
                  </td>
                  <td className="p-4 w-1/6">
                    <span className={`items-center text-sm font-medium ${member?.active ? 'bg-green-100 text-green-400' : 'bg-red-100 text-red-400'} rounded-full px-3 py-1`}>{member?.active ? 'Active' : 'Disabled'}</span>
                  </td>
                  <td className="p-4 w-1/6 text-right">
                    <Button onClick={onClickDeleteMember(member)} className="h-10 px-6" variant="gray" padding="none"><X /></Button>
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
          <div className="mb-6">
            <Label htmlFor="active" className="mb-2">Active</Label>
            <Select value={input.active} onChange={onChangeSelect('active')} options={[{ value: false, label: 'Disabled' }, { value: true, label: 'Active' }] as any} />
          </div>
          {memberCreateError
            ? <div className=" bg-red-100 rounded p-4 mb-8 text-red-600">{(memberCreateError as any)?.message ?? 'Unknown error.'}</div>
            : null
          }
          <div className="flex flex-col md:flex-row">
            {!isSubmitting ? <Button onClick={() => {
              setShowModal('');
            }} variant="grayNoWidth" disabled={isSubmitting} className="flex justify-center items-center mb-4 md:mr-4 md:mb-0" type="button">
              {isSubmitting ? <Loader className="h-6 stroke-slate-600" /> : 'Cancel'}
            </Button> : null}

            <Button className="flex justify-center items-center" type="submit">
              {isSubmitting ? <Loader className="h-6 stroke-slate-600" /> : 'Create'}
            </Button>
          </div>
        </form>
        : null}

      {showModal === 'edit'
        ? <div>
          <form className="mb-8" onSubmit={onSubmitFormUpdate}>
            <div className="mb-6">
              <Label htmlFor="name" className="mb-2">Name</Label>
              <Input value={input?.name} onChange={onChangeInput('name')} disabled={isSubmitting} className="w-full" name="name" id="name" placeholder="Ex: John Wick" />
            </div>
            <div className="mb-6">
              <Label htmlFor="walletAddress" className="mb-2">Wallet Address</Label>
              <Input value={input?.walletAddress} onChange={onChangeInput('walletAddress')} disabled={isSubmitting} className="w-full" name="walletAddress" id="walletAddress" placeholder="Ex: 0x0123456789012345678901234567890123456789" />
            </div>
            <div className="mb-6">
              <Label htmlFor="active" className="mb-2">Active</Label>
              <Select value={input.active} onChange={onChangeSelect('active')} options={[{ value: false, label: 'Disabled' }, { value: true, label: 'Active' }] as any} />
            </div>
            {memberUpdateError
              ? <div className="bg-red-100 rounded p-4 mb-8 text-red-600">{(memberUpdateError as any)?.message ?? 'Unknown error.'}</div>
              : null
            }
            <div className="flex flex-col md:flex-row">
              {!isUpdating ? <Button onClick={() => {
                setShowModal('');
              }} variant="grayNoWidth" disabled={isUpdating} className="flex justify-center items-center mb-4 md:mr-4 md:mb-0" type="button">
                {isUpdating ? <Loader className="h-6 stroke-slate-600" /> : 'Cancel'}
              </Button> : null}
              <Button className="flex justify-center items-center" type="submit">
                {isUpdating ? <Loader className="h-6 stroke-slate-600" /> : 'Update'}
              </Button>
            </div>
          </form>
          {/* <hr className="mb-8" />
          <Heading as="h4" className="mb-8">Tags</Heading>
          <Loader className="stroke-slate-600" /> */}
        </div>
        : null}

      {showModal === 'delete'
        ? <div>{memberDeleteError
          ? <div className="bg-red-100 rounded p-4 mb-8 text-red-600">{(memberDeleteError as any)?.message ?? 'Unknown error.'}</div>
          : null
        }
          <div className="mb-8">
            <Label>Name</Label>
            <Heading as="h4">{input?.name}</Heading>
          </div>
          <div className="flex flex-col md:flex-row">
            {!isDeleting ? <Button onClick={() => {
              setShowModal('');
            }} variant="grayNoWidth" disabled={isDeleting} className="flex justify-center items-center mb-4 md:mr-4 md:mb-0" type="button">
              {isDeleting ? <Loader className="h-6 stroke-slate-600" /> : 'Cancel'}
            </Button> : null}
            <Button onClick={onSubmitDelete} className="flex justify-center items-center" type="button">
              {isDeleting ? <Loader className="h-6 stroke-slate-600" /> : 'Delete'}
            </Button>
          </div>
        </div>
        : null}
    </Modal>
  </div>
}

// Exports
// ========================================================
export default OrgMembers;
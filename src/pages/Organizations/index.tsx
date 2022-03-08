// Imports
// ========================================================
import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom';
import { Users } from 'react-feather';
import { useAuth } from "../../providers/Supabase";
import { ORGS } from '../../queries';
import DashboardLayout from "../../layouts/Dashboard";
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Label from '../../components/Label';
import Input from '../../components/Input';
import Modal from '../../components/Modal';

// Main page
// ========================================================
const OrganizationsPage = () => {
  // State / Props
  const isMounted = useRef(false);
  const [input, setInput] = useState({
    name: ''
  });
  const [showModal, setShowModal] = useState('');
  const { session } = useAuth();
  const navigate = useNavigate();

  // Requests
  /**
   * LIST
   */
  const { isLoading: isRetrieving, data: orgListData, error: orgListError, mutate: orgList } = useMutation(ORGS.LIST);

  /**
   * CREATE
   */
  const { isLoading: isSubmitting, data: orgCreateData, error: orgCreateError, mutate: orgCreate } = useMutation(ORGS.CREATE);

  // Functions
  /**
   * 
   * @param field 
   * @returns 
   */
  const onChangeInput = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [field as 'name']: event.target.value
    });
  };

  /**
   * 
   * @param event 
   */
  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    orgCreate({ token: session?.access_token, payload: input });
    event.preventDefault();
  };

  // Hooks
  /**
   * 
   */
  useEffect(() => {
    isMounted.current = true;
    orgList({ token: session?.access_token, include: 'membersCount' });
    return () => {
      isMounted.current = false;
    }
  }, []);

  /**
   * 
   */
  useEffect(() => {
    if (!orgCreateData) return;
    navigate(`/dashboard/organizations/${orgCreateData.id}`);
  }, [orgCreateData]);

  // Render
  return <DashboardLayout>
    <div className="p-8 flex flex-col h-full">
      <header className="pb-10 flex justify-between items-center">
        <div>
          <Heading as="h1" className="mb-2">Organizations</Heading>
          <Text>Create and organize groups of members</Text>
        </div>
        <div>
          <Button onClick={() => setShowModal('create')}>Create</Button>
        </div>
      </header>

      <section className="h-full ">
        <div className={`rounded-lg bg-white border border-slate-200 grid grid-cols-1 ${isRetrieving ? 'lg:grid-cols-2 xl:grid-cols-3 gap-8' : `${orgListData && orgListData?.length > 0 ? 'lg:grid-cols-2 xl:grid-cols-3 gap-8' : ''}`} p-8`}>
          {isRetrieving
            ? <div className="w-full rounded-lg bg-white border border-slate-200 p-8 transition-colors ease-in-out duration-200">
              <div className="flex items-center">
                <Loader className="stroke-slate-600 mr-4" />
                <Text>Loading...</Text>
              </div>
            </div>
            : orgListData && orgListData?.length > 0
              ? orgListData.map((org: any) => <Link key={`org-${org.id}`} to={`/dashboard/organizations/${org.id}`} className="rounded-lg bg-white border border-slate-200 p-8 hover:border-slate-400 hover:shadow transition-colors ease-in-out duration-200">
                <div className="flex items-center mb-8">
                  <svg height="48" width="48" className="block h-12 w-12 fill-slate-200 mr-4">
                    <circle cx="24" cy="24" r="24" />
                    <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-400 w-12 font-medium text-center block uppercase">{org.name.slice(0, 1)}</text>
                  </svg>
                  <Heading title={`${org.name}`} as="h4" className="w-2/3 whitespace-nowrap overflow-hidden text-ellipsis">{org.name}</Heading>
                </div>
                <div className="flex text-slate-800" title="Members">
                  <Users className="text-slate-400 w-5 mr-2" />
                  {org?._count?.OrgMember ?? 0} Members
                </div>
              </Link>)
              : <div className="w-full flex justify-center">
                <div className="rounded-lg bg-slate-100 py-16 lg:py-24 px-8 w-full">
                  <Heading as="h4" className="text-center mb-2">Nothing yet!</Heading>
                  <Text className="text-center mb-8">Start by creating one.</Text>
                  <Button variant="gray" className="block mx-auto">Create</Button>
                </div>
              </div>
          }
        </div>
      </section>
    </div>

    <Modal isCloseEnabled={!isSubmitting} title="Create" description="New organization" onClose={() => setShowModal('')} isVisible={showModal.length > 0}>
      <form onSubmit={onSubmitForm}>
        <div className="mb-6">
          <Label htmlFor="name" className="mb-2">Name</Label>
          <Input value={input?.name} onChange={onChangeInput('name')} disabled={isSubmitting} className="w-full" name="name" id="name" placeholder="Ex: My House" />
        </div>
        {orgCreateError
          ? <div className=" bg-red-100 rounded p-4 mb-8 text-red-600">{(orgCreateError as any)?.message ?? 'Unknown error.'}</div>
          : null
        }
        <div className="flex flex-col md:flex-row">
          {!isSubmitting ? <Button onClick={() => {
            setInput({ name: '' });
            setShowModal('');
          }} variant="grayNoWidth" disabled={isSubmitting} className="flex justify-center items-center mb-4 md:mr-4 md:mb-0" type="button">
            {isSubmitting ? <Loader className="h-6 stroke-slate-600" /> : 'Cancel'}
          </Button> : null}

          <Button className="flex justify-center items-center" type="submit">
            {isSubmitting ? <Loader className="h-6 stroke-slate-600" /> : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  </DashboardLayout>
};

// Exports
// ========================================================
export default OrganizationsPage;
// Imports
// ========================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, AlignLeft, Anchor, ChevronRight, Search, Settings, Users } from 'react-feather';
import { useMutation } from 'react-query';
import { useAuth, useTable } from '../../providers/Supabase';
import { ORGS } from '../../queries';
import DashboardLayout from "../../layouts/Dashboard";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import Label from '../../components/Label';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import OrgMembers from '../../components/OrgMembers';
import OrgSettings from '../../components/OrgSettings';

const getModalTitle = (modal: string) => {
  switch (modal) {
    case 'delete':
      return {
        modalTitle: 'Confirm Deletion',
        modalDescription: 'Are you sure you want to delete?'
      }
    case 'edit':
      return {
        modalTitle: 'Edit',
        modalDescription: 'Edit details'
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

// Main Component
// ========================================================
const Organization = () => {
  // State / Props
  const isMounted = useRef(false);
  const [input, setInput] = useState({
    name: ''
  });
  const [showModal, setShowModal] = useState('');
  // const [isRetrieving, setIsRetrieving] = useState(true);
  // const [isDeleting, setIsDeleting] = useState(false);
  // const [isCreating, setIsCreating] = useState(false);
  const { id } = useParams();
  const { session } = useAuth();
  const [error, setError] = useState<any>();
  const [data, setData] = useState<any>();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { modalTitle, modalDescription } = getModalTitle(showModal);



  // Requests
  /**
   * READ
   */
  const { isLoading: isRetrieving, data: orgReadData, error: orgReadError, mutate: orgRead } = useMutation(ORGS.READ);

  /**
   * DELETE
   */
  const { isLoading: isDeleting, data: orgDeleteData, error: orgDeleteError, mutate: orgDelete } = useMutation(ORGS.DELETE);

  // // Functions
  // /**
  //  * 
  //  */
  // const QUERY = useCallback(async ({ id }) => {
  //   setIsRetrieving(true);

  //   const { data, error } = await client.from('organizations').select('*').eq('id', `${id}`).single();

  //   if (isMounted.current) {
  //     if (error) {
  //       setError(error);
  //       setIsRetrieving(false);
  //       return;
  //     }

  //     setData(data);
  //     setIsRetrieving(false);
  //   }
  // }, []);

  // /**
  //  * 
  //  */
  // const DELETE = useCallback(async ({ id }) => {
  //   setIsDeleting(true);

  //   const { data, error } = await client.from('organizations').delete().eq('id', `${id}`).single();

  //   if (isMounted.current) {
  //     if (error) {
  //       setError(error);
  //       setIsDeleting(false);
  //       return;
  //     }

  //     navigate('/dashboard/organizations')
  //   }
  // }, []);

  // /**
  //  * 
  //  */
  // const CREATE = useCallback(async ({ id, name }) => {
  //   setIsCreating(true);

  //   const { data, error } = await client.from('org_members').insert([
  //     {
  //       name,
  //       org_id: id
  //     }
  //   ]);

  //   if (isMounted.current) {
  //     if (error) {
  //       setError(error);
  //       setIsCreating(false);
  //       return;
  //     }

  //     setData(data);
  //     setIsCreating(false);
  //   }

  //   setInput({
  //     name: ''
  //   });
  // }, []);

  /**
   * 
   * @param event 
   */
  const onSubmitDelete = (event: React.FormEvent<HTMLFormElement>) => {
    // DELETE({ id });
    event.preventDefault();
  }

  /**
   * 
   * @param event 
   */
  const onSubmitCreate = (event: React.FormEvent<HTMLFormElement>) => {
    // CREATE({ id, name: input.name });
    event.preventDefault();
  }

  /**
   * 
   */
  const onClickDelete = () => {
    setShowModal('delete');
  };

  /**
   * 
   * @param field 
   * @returns 
   */
  const onChangeInput = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [field]: event.target.value,
    })
  }

  // Hooks
  useEffect(() => {
    isMounted.current = true;
    orgRead({ token: session?.access_token, id })
    return () => {
      isMounted.current = false;
    }
  }, []);

  return <DashboardLayout>
    <div className="p-8 flex flex-col h-full">
      <div className="mb-8">
        <Text className="flex items-center">
          <Link to="/dashboard/organizations" className="text-slate-700 font-medium hover:underline">Organizations</Link> {orgReadData?.name ? <span className="flex items-center"><ChevronRight className="h-4" /> <span>{orgReadData.name}</span></span> : null}
        </Text>
      </div>

      <header className="pb-10 flex justify-between items-center">

        <div>
          <Heading as="h1" className="mb-2">Organization</Heading>
          <Text>Edit and see members</Text>
        </div>
        {!isRetrieving && !orgReadError ? <div>
          <Button className="mr-4" onClick={onClickDelete}>Delete</Button>
          <Button variant="gray" onClick={() => { }}>Edit</Button>
        </div> : null}
      </header>

      <section className="h-full">
        <div className={`rounded-lg bg-white border border-slate-200 ${isRetrieving || orgReadError ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 p-8' : ''}`}>
          {isRetrieving ? <div className={`rounded-lg bg-white border border-slate-200 p-8 transition-colors ease-in-out duration-200`}>
            <div className="flex items-center">
              <Loader className="stroke-slate-600 mr-4" />
              <Text>Loading...</Text>
            </div>
          </div>
            : orgReadData && !orgReadError ? <div className="rounded-lg  flex flex-wrap">
              <div className="block w-full md:w-1/5 border-b md:border-r md:border-b-0 border-slate-200">
                <ul>
                  <li>
                    <Text>
                      <Link className={`h-16 rounded-tl-lg ${pathname.endsWith(`${id}`) ? 'bg-slate-100' : ''} hover:bg-slate-100 transition-all ease-out duration-200 flex items-center leading-10 px-6 font-medium`} to={`/dashboard/organizations/${id}`}>
                        <Users className="text-slate-800 mr-2" />
                        Members
                      </Link>
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <Link className={`h-16 ${pathname.endsWith('/forms') ? 'bg-slate-100' : ''} hover:bg-slate-100 transition-all ease-out duration-200 flex items-center leading-10 px-6 font-medium`} to={`/dashboard/organizations/${id}/forms`}>
                        <AlignLeft className="text-slate-800 mr-2" />
                        Forms
                      </Link>
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <Link className={`h-16 ${pathname.endsWith('/hooks') ? 'bg-slate-100' : ''} hover:bg-slate-100 transition-all ease-out duration-200 flex items-center leading-10 px-6 font-medium`} to={`/dashboard/organizations/${id}`}>
                        <Anchor className="text-slate-800 mr-2" />
                        Hooks <small className='ml-2'>(Coming soon)</small>
                      </Link>
                    </Text>
                  </li>
                  <li>
                    <Text>
                      <Link className={`h-16 ${pathname.endsWith('/settings') ? 'bg-slate-100' : ''} hover:bg-slate-100 transition-all ease-out duration-200 flex items-center leading-10 px-6 font-medium`} to={`/dashboard/organizations/${id}/settings`}>
                        <Settings className="text-slate-800 mr-2" />
                        Settings
                      </Link>
                    </Text>
                  </li>
                </ul>
              </div>
              <div className="block w-full md:w-4/5 py-10 px-8 md:px-10">
                {pathname.endsWith(`/dashboard/organizations/${id}`) ?
                  <OrgMembers orgId={`${id}`} />
                  : null}

                {pathname.endsWith(`/dashboard/organizations/${id}/settings`) ?
                  <OrgSettings orgId={`${id}`} />
                  : null}
              </div>
            </div> : <div className="flex items-center">
              <AlertCircle className="stroke-slate-600 mr-4" />
              <Text>{(orgReadError as any)?.message}</Text>
            </div>}
        </div>
      </section>
    </div>

  </DashboardLayout >
};

// Exports
// ========================================================
export default Organization;
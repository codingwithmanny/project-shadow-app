// Imports
// ========================================================
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, AlignLeft, Anchor, ChevronRight, Settings, Users } from 'react-feather';
import { useMutation } from 'react-query';
import { useAuth } from '../../providers/Supabase';
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
import OrgForms from '../../components/OrgForms';
import OrgHooks from '../../components/OrgHooks';

/**
 * 
 * @param modal 
 * @returns 
 */
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
  const { id } = useParams();
  const { session } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { modalTitle, modalDescription } = getModalTitle(showModal);

  // Requests
  /**
   * READ
   */
  const { isLoading: isRetrieving, data: orgReadData, error: orgReadError, mutate: orgRead } = useMutation(ORGS.READ);

  /**
   * UPDATE
   */
  const { isLoading: isUpdating, data: orgUpdateData, error: orgUpdateError, mutate: orgUpdate, reset: orgUpdateReset } = useMutation(ORGS.UPDATE);

  /**
   * DELETE
   */
  const { isLoading: isDeleting, data: orgDeleteData, error: orgDeleteError, mutate: orgDelete, reset: orgDeleteReset } = useMutation(ORGS.DELETE);

  // Functions
  /**
   * 
   */
  const onClickDelete = () => {
    setShowModal('delete');
  };

  /**
   * 
   */
  const onClickEdit = () => {
    setShowModal('edit');
  };

  /**
   * 
   */
  const onClickModalDelete = () => {
    orgDelete({ token: session?.access_token, id: orgReadData.id })
  }

  /**
   * 
   * @param field 
   * @returns 
   */
  const onChangeInput = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [field]: event.target.value,
    });
  };

  /**
   * 
   * @param event 
   */
  const onSubmitFormEdit = (event: React.FormEvent<HTMLFormElement>) => {
    orgUpdate({ token: session?.access_token, id, payload: input });
    event.preventDefault();
  };

  // Hooks
  /**
   * On mount retrieve current org
   */
  useEffect(() => {
    isMounted.current = true;
    orgRead({ token: session?.access_token, id })
    return () => {
      isMounted.current = false;
    }
  }, []);

  /**
   * If modal is closed reset the modal errors and values
   */
  useEffect(() => {
    if (showModal) return;
    orgDeleteReset();
    orgUpdateReset();
    setInput({
      name: orgReadData?.name
    });
  }, [showModal]);

  /**
   * When org data retrieved set input
   */
  useEffect(() => {
    if (!orgReadData) return;
    setInput({
      name: orgReadData.name
    });
  }, [orgReadData]);

  /**
   * If deletion complete redirect to orgs
   */
  useEffect(() => {
    if (!orgDeleteData || orgDeleteError || isDeleting) return;
    navigate('/dashboard/organizations');
  }, [orgDeleteData]);

  /**
   * If org updated refetch data
   */
  useEffect(() => {
    if (!orgUpdateData || orgUpdateError) return;
    orgRead({ token: session?.access_token, id });
    setShowModal('');
  }, [orgUpdateData]);

  // Render
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
        {!isRetrieving && !orgReadError ? <div className="flex justify-end">
          <Button className="mr-4" onClick={onClickDelete}>Delete</Button>
          <Button variant="grayNoWidth" onClick={onClickEdit}>Edit</Button>
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
              <div className="block w-full md:w-2/6 xl:w-1/5 border-b md:border-r md:border-b-0 border-slate-200">
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
                      <Link className={`h-16 ${pathname.endsWith('/hooks') ? 'bg-slate-100' : ''} hover:bg-slate-100 transition-all ease-out duration-200 flex items-center leading-10 px-6 font-medium`} to={`/dashboard/organizations/${id}/hooks`}>
                        <Anchor className="text-slate-800 mr-2" />
                        Hooks <small className='ml-2 text-xs text-slate-400'>(Coming soon)</small>
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
              <div className="block w-full md:w-4/6 xl:w-4/5 py-10 px-8 md:px-10">
                {pathname.endsWith(`/dashboard/organizations/${id}`) ?
                  <OrgMembers orgId={`${id}`} />
                  : null}

                {pathname.endsWith(`/dashboard/organizations/${id}/settings`) ?
                  <OrgSettings orgId={`${id}`} />
                  : null}

                {pathname.endsWith(`/dashboard/organizations/${id}/forms`) ?
                  <OrgForms orgId={`${id}`} />
                  : null}

                {pathname.endsWith(`/dashboard/organizations/${id}/hooks`) ?
                  <OrgHooks orgId={`${id}`} />
                  : null}
              </div>
            </div> : <div className="flex items-center">
              <AlertCircle className="stroke-slate-600 mr-4" />
              <Text>{(orgReadError as any)?.message}</Text>
            </div>}
        </div>
      </section>
    </div>

    <Modal title={modalTitle} description={modalDescription} onClose={() => setShowModal('')} isVisible={showModal.length > 0} >
      {showModal === 'delete'
        ? <div>{orgDeleteError
          ? <div className="bg-red-100 rounded p-4 mb-8 text-red-600">{(orgDeleteError as any)?.message ?? 'Unknown error.'}</div>
          : null
        }<div className="flex flex-col md:flex-row">
            {!isDeleting ? <Button onClick={() => {
              setShowModal('');
            }} variant="grayNoWidth" disabled={isDeleting} className="flex justify-center items-center mb-4 md:mr-4 md:mb-0" type="button">
              {isDeleting ? <Loader className="h-6 stroke-slate-600" /> : 'Cancel'}
            </Button> : null}
            <Button onClick={onClickModalDelete} className="flex justify-center items-center" type="button">
              {isDeleting ? <Loader className="h-6 stroke-slate-600" /> : 'Delete'}
            </Button>
          </div>
        </div>
        : null}

      {showModal === 'edit'
        ? <form onSubmit={onSubmitFormEdit}>
          <div className="mb-6">
            <Label htmlFor="name" className="mb-2">Name</Label>
            <Input value={input?.name} onChange={onChangeInput('name')} disabled={isUpdating} className="w-full" name="name" id="name" placeholder="Ex: My House" />
          </div>
          {orgUpdateError
            ? <div className=" bg-red-100 rounded p-4 mb-8 text-red-600">{(orgUpdateError as any)?.message ?? 'Unknown error.'}</div>
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
        : null}
    </Modal>
  </DashboardLayout>
};

// Exports
// ========================================================
export default Organization;
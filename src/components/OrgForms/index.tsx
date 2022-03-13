// Imports
// ========================================================
import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from 'react-query'
import { Search, X } from 'react-feather';
import { useAuth } from "../../providers/Supabase";
import useDebounce from '../../hooks/useDebounce';
import { FORMS } from '../../queries';
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Label from '../../components/Label';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Select from '../../components/Select';

// Config
// ========================================================
const getModalTitle = (modal: string) => {
  switch (modal) {
    case 'edit':
      return {
        modalTitle: 'Edit',
        modalDescription: 'Edit form details'
      }
    case 'create':
      return {
        modalTitle: 'Create',
        modalDescription: 'New form'
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
const OrgForms = ({ orgId }: { orgId: string }) => {
  // State / Props
  const isMounted = useRef(false);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState({
    url: false,
  });
  const inputUrl = useRef();
  const debouncedSearch = useDebounce(search);
  const [input, setInput] = useState<{
    id?: string;
    name: string;
    isEnabled?: boolean;
    isOneTimeUse?: boolean;
  }>({
    name: '',
    isEnabled: undefined,
    isOneTimeUse: undefined
  });
  const { session } = useAuth();
  const [showModal, setShowModal] = useState('');
  const { modalTitle, modalDescription } = getModalTitle(showModal);

  // Requests
  /**
   * LIST
   */
  const { isLoading: isRetrieving, data: formsListData, error: formsListError, mutate: formsList } = useMutation(FORMS.LIST);

  /**
   * CREATE
   */
  const { isLoading: isSubmitting, data: formCreateData, error: formCreateError, mutate: formCreate } = useMutation(FORMS.CREATE);

  /**
   * UPDATE
   */
  const { isLoading: isUpdating, data: formUpdateData, error: formUpdateError, mutate: formUpdate } = useMutation(FORMS.UPDATE);

  /**
   * 
   * DELETE
   */
  const { isLoading: isDeleting, data: formDeleteData, error: formDeleteError, mutate: formDelete } = useMutation(FORMS.DELETE);


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

      setCopied({
        ...copied,
        url: true
      });

      setTimeout(() => {
        setCopied({
          url: false,
        });
      }, 1000);
    }
  };

  /**
   * 
   * @param event 
   */
  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  /**
   * 
   */
  const onClickEditForm = (form: {
    id: string;
    name: string;
    isEnabled?: boolean;
    isOneTimeUse?: boolean;
  }) => (event?: any) => {
    if (event.key && (event.target instanceof HTMLTableRowElement && event.key !== 'Enter') || (event.key && !(event.target instanceof HTMLTableRowElement))) return;
    setInput(form);
    setShowModal('edit');
  };

  /**
   * 
   */
  const onClickAddForm = () => {
    setInput({
      name: '',
      isEnabled: undefined,
      isOneTimeUse: undefined
    });
    setShowModal('create');
  };

  /**
   * 
   * @param form 
   * @returns 
   */
  const onClickDelete = (form: {
    id: string;
    name: string;
    isEnabled?: boolean;
    isOneTimeUse?: boolean;
  }) => (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setInput(form);
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
      [field]: event.target.value
    });
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
   */
  const onSubmitFormCreate = (event: React.FormEvent<HTMLFormElement>) => {
    formCreate({ token: session?.access_token, id: orgId, payload: input });
    event.preventDefault();
  };

  /**
   * 
   * @param event 
   */
  const onSubmitFormUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    formUpdate({ token: session?.access_token, id: orgId, payload: input });
    event.preventDefault();
  };

  /**
   * 
   * @param event 
   */
  const onSubmitDelete = (event: React.FormEvent<HTMLFormElement>) => {
    formDelete({ token: session?.access_token, id: orgId, payload: input });
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
   * Reset on create
   */
  useEffect(() => {
    if (!isMounted.current || !formCreateData || formCreateError) return;
    formsList({ token: session?.access_token, id: orgId });
    setShowModal('');
    setSearch('');
  }, [formCreateData]);

  /**
   * Reset on update
   */
  useEffect(() => {
    if (!isMounted.current || !formUpdateData || formUpdateError) return;
    formsList({ token: session?.access_token, id: orgId });
    setShowModal('');
    setSearch('');
  }, [formUpdateData]);

  /**
   * Reset on de;ete
   */
  useEffect(() => {
    if (!isMounted.current || !formDeleteData || formDeleteError) return;
    formsList({ token: session?.access_token, id: orgId });
    setShowModal('');
    setSearch('');
  }, [formDeleteData]);

  /**
   * 
   */
  useEffect(() => {
    if (!isMounted.current) return;
    formsList({ token: session?.access_token, id: orgId, q: debouncedSearch });
  }, [debouncedSearch]);

  // Render
  return <div>
    <div className="flex items-center justify-between mb-8">
      <Heading as="h4">Forms</Heading>
      <Button onClick={onClickAddForm}>Add Form</Button>
    </div>
    <div className="relative block mb-8">
      <Search className="w-4 text-slate-400 absolute left-4 top-0 bottom-0 my-auto" />
      <Input value={search} onChange={onChangeSearch} disabled={isRetrieving} variant="none" className="w-full h-12 rounded-full pl-10 pr-6" type="search" placeholder="Search for forms" />
    </div>
    <div className="w-full">
      {isRetrieving ? <div className={`rounded-lg bg-white border border-slate-200 p-8 transition-colors ease-in-out duration-200`}>
        <div className="flex items-center">
          <Loader className="stroke-slate-600 mr-4" />
          <Text>Loading...</Text>
        </div>
      </div> : formsListData && formsListData.length > 0 ?
        <div className="border border-slate-200 rounded-lg px-4 overflow-scroll">
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 text-left text-sm font-medium text-slate-500">Name</th>
                <th className="py-4 pl-4 text-left text-sm font-medium text-slate-500">Access</th>
                <th className="py-4 pl-4 text-left text-sm font-medium text-slate-500">Use</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {formsListData.map((form: any, key: number) =>
                <tr tabIndex={0} key={`${form.id}`} onKeyUp={onClickEditForm(form)} onClick={onClickEditForm(form)} className="border-b border-l-slate-200 hover:bg-slate-50 cursor-pointer">
                  <td className="p-4 w-3/6">
                    <div className="flex items-center">
                      <Text>
                        {form?.name}
                      </Text>
                    </div>
                  </td>
                  <td className="p-4 w-1/6">
                    <span className={`items-center text-sm font-medium ${form?.isEnabled ? 'bg-green-100 text-green-400' : 'bg-red-100 text-red-400'} rounded-full px-3 py-1`}>{form?.isEnabled ? 'Active' : 'Disabled'}</span>
                  </td>
                  <td className="p-4 w-1/6">
                    <span className={`items-center text-sm font-medium ${form?.isOneTimeUse ? 'bg-purple-100 text-purple-400' : 'bg-blue-100 text-blue-400'} rounded-full px-3 py-1`}>{form?.isOneTimeUse ? 'Single' : 'Multiple'}</span>
                  </td>
                  <td className="p-4 w-1/6 text-right">
                    <Button onClick={onClickDelete(form)} className="h-10 px-6" variant="gray" padding="none"><X /></Button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div> : <div className="w-full flex justify-center">
          <div className="rounded-lg bg-slate-100 py-16 lg:py-24 px-8 w-full">
            <Heading as="h4" className="text-center mb-2">{search ? 'No results' : 'Nothing yet!'}</Heading>
            <Text className="text-center mb-8">{search ? 'Try different keywords.' : 'Start by adding one.'}</Text>
            {!search ? <Button onClick={onClickAddForm} variant="gray" className="block mx-auto">Add Form</Button> : null}
          </div>
        </div>}
    </div>

    <Modal isCloseEnabled={!isSubmitting || !isUpdating || !isDeleting} title={modalTitle} description={modalDescription} onClose={() => setShowModal('')} isVisible={showModal.length > 0} >
      {showModal === 'create' || showModal === 'edit'
        ? <div><form onSubmit={showModal === 'create' ? onSubmitFormCreate : onSubmitFormUpdate}>
          <div className="mb-6">
            <Label htmlFor="name" className="mb-2">Name</Label>
            <Input disabled={isSubmitting || isUpdating} value={input?.name} onChange={onChangeInput('name')} className="w-full" name="name" id="name" placeholder="Ex: John Wick" />
          </div>
          <div className="mb-6">
            <Label htmlFor="isEnabled" className="mb-2">Form Access</Label>
            <Select disabled={isSubmitting || isUpdating} value={input.isEnabled} onChange={onChangeSelect('isEnabled')} options={[{ value: false, label: 'Disabled' }, { value: true, label: 'Active' }] as any} />
          </div>
          <div className="mb-6">
            <Label htmlFor="isOneTimeUse" className="mb-2">Form Use</Label>
            <Select disabled={isSubmitting || isUpdating} value={input.isOneTimeUse} onChange={onChangeSelect('isOneTimeUse')} options={[{ value: false, label: 'Multiple Times' }, { value: true, label: 'Single Use' }] as any} />
          </div>
          {formCreateError || formUpdateError
            ? <div className=" bg-red-100 rounded p-4 mb-8 text-red-600">{(formCreateError as any)?.message ?? (formUpdateError as any)?.message ?? 'Unknown error.'}</div>
            : null
          }
          <div className="flex flex-col md:flex-row">
            {!isSubmitting && !isUpdating ? <Button onClick={() => {
              setShowModal('');
            }} variant="grayNoWidth" disabled={isSubmitting || isUpdating} className="flex justify-center items-center mb-4 md:mr-4 md:mb-0" type="button">
              {isSubmitting || isUpdating ? <Loader className="h-6 stroke-slate-600" /> : 'Cancel'}
            </Button> : null}
            <Button className="flex justify-center items-center" type="submit">
              {isSubmitting || isUpdating ? <Loader className="h-6 stroke-slate-600" /> : showModal === 'create' ? 'Create' : 'Update'}
            </Button>
          </div>
        </form>
          {showModal === 'edit' ? <div className="my-8 py-8 border-t border-slate-200">
            <div className="mb-6">
              <Label className="mb-2">Form Verification URL</Label>
              <Input forwardRef={inputUrl as any} className="w-full" type="text" readOnly value={`${window.location.protocol}//${window.location.host}/p/verify/${input?.id}`} />
            </div>
            <Button onClick={copyKey(inputUrl)} variant="gray" type="button">{copied.url ? 'Copied!' : 'Copy'}</Button>
          </div> : null}
        </div>

        : null}

      {showModal === 'delete'
        ? <div>{formDeleteError
          ? <div className="bg-red-100 rounded p-4 mb-8 text-red-600">{(formDeleteError as any)?.message ?? 'Unknown error.'}</div>
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
export default OrgForms;
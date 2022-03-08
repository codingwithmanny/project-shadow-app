// Imports
// ========================================================
import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from 'react-query'
import { Search } from 'react-feather';
import { useAuth } from "../../providers/Supabase";
import { FORMS, MEMBERS } from '../../queries';
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
        modalDescription: 'Edit form details'
      }
    case 'create':
      return {
        modalTitle: 'Create',
        modalDescription: 'New form'
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
const OrgForms = ({ orgId }: { orgId: string }) => {
  // State / Props
  const [search, setSearch] = useState('');

  // Requests
  /**
   * LIST
   */
  const { isLoading: isRetrieving, data: formsListData, error: formsListError, mutate: formsList } = useMutation(FORMS.LIST);

  // Functions
  /**
   * 
   * @param event 
   */
  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  /**
   * 
   */
  const onClickEditForm = (id: string) => () => {
  }

  /**
   * 
   */
  const onClickAddForm = () => { }

  // Render
  return <div>
    <div className="flex items-center justify-between mb-8">
      <Heading as="h4">Forms</Heading>
      <Button onClick={() => { }}>Add Form</Button>
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
        <div className="border border-slate-200 rounded-lg px-4">
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 text-left text-sm font-medium text-slate-500">Address</th>
                <th className="py-4 pl-4 text-left text-sm font-medium text-slate-500">Tags</th>
              </tr>
            </thead>
            <tbody>
              {formsListData.map((form: any) =>
                <tr key={`${form.id}`} onClick={onClickEditForm(form.id)} className="border-b border-l-slate-200 hover:bg-slate-50 cursor-pointer">
                  <td className="p-4 w-3/4">
                    <div className="flex items-center">
                      {/* <svg height="48" width="48" className="block h-12 w-12 fill-slate-200 mr-4">
                        <circle cx="24" cy="24" r="24" />
                        <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-400 w-12 font-medium text-center block">0x{form?.walletAddress.slice(2, 3)}</text>
                      </svg> */}
                      <code className="text-slate-500">{form?.walletAddress}</code>
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
            {!search ? <Button onClick={onClickAddForm} variant="gray" className="block mx-auto">Add Form</Button> : null}
          </div>
        </div>}
    </div>
  </div>
}

// Exports
// ========================================================
export default OrgForms;
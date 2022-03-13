// Imports
// ========================================================

import { useEffect } from "react";
import { useMutation } from "react-query";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/Button";
import FullLoader from "../../components/FullLoader";
import Heading from "../../components/Heading";
import Loader from "../../components/Loader";
import Text from "../../components/Text";
import PublicLayout from "../../layouts/Public";
import { PUBLIC_ORG, PUBLIC_ORG_MEMBERS } from "../../queries";
import NotFoundPage from "../NotFound";

// Main Page
// ========================================================
const Org = () => {
  // State / Props
  const { id } = useParams();

  // Requests
  /**
   * READ
   */
  const { isLoading: isRetrievingOrg, data: orgReadData, error: orgReadError, mutate: orgRead } = useMutation(PUBLIC_ORG.READ);

  /**
   * LIST
   */
  const { isLoading: isRetrievingMembers, data: membersListData, error: membersListError, mutate: membersList } = useMutation(PUBLIC_ORG_MEMBERS.LIST);

  // Hooks
  /**
   * Init org read
   */
  useEffect(() => {
    orgRead({ id })
  }, []);

  /**
   * Retrieve members
   */
  useEffect(() => {
    if (!orgReadData || orgReadError) return;
    membersList({ id });
  }, [orgReadData]);

  // Render
  /**
   * Init loading
   */
  if ((!orgReadError && !orgReadData) || isRetrievingOrg) return <FullLoader />

  /**
   * If Org is not public
   */
  if (orgReadError) return <NotFoundPage />;

  /**
   * Return org
   */
  return <PublicLayout>
    <div className="p-8 flex flex-col h-full">
      <header className="pb-10 flex justify-between items-center">
        <div>
          <Heading as="h1" className="mb-2">{orgReadData.name}</Heading>
          <Text>Total Members: {membersListData?.pagination?.total}</Text>
        </div>
      </header>

      <section className="h-full ">
        <div className={`rounded-lg bg-white border border-slate-200 grid grid-cols-1 ${isRetrievingMembers ? 'lg:grid-cols-2 xl:grid-cols-3 gap-8' : `${membersListData?.data && membersListData?.data?.length > 0 ? 'lg:grid-cols-2 xl:grid-cols-3 gap-8' : ''}`} p-8`}>
          {isRetrievingMembers
            ? <div className="w-full rounded-lg bg-white border border-slate-200 p-8 transition-colors ease-in-out duration-200">
              <div className="flex items-center">
                <Loader className="stroke-slate-600 mr-4" />
                <Text>Loading...</Text>
              </div>
            </div>
            : membersListData?.data && membersListData?.data?.length > 0
              ? membersListData?.data.map((member: any) => <div key={`members-${member.id}`} className="rounded-lg bg-white border border-slate-200 p-8 hover:border-slate-400 hover:shadow transition-colors ease-in-out duration-200">
                <div className="flex items-center mb-8">
                  <svg height="48" width="48" className="block h-12 w-12 fill-slate-200 mr-4">
                    <circle cx="24" cy="24" r="24" />
                    <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-400 w-12 font-medium text-center block uppercase">{member.name.slice(0, 1)}</text>
                  </svg>
                  <Heading title={`${member.name}`} as="h4" className="w-2/3 whitespace-nowrap overflow-hidden text-ellipsis">{member.name}</Heading>
                </div>
                <div className="flex flex-wrap -mx-1 max-h-16">
                  <span className={`mx-1 mb-2 items-center text-sm font-medium bg-slate-400 text-slate-100 rounded-full px-3 py-1`}>Something</span>
                  <span className={`mx-1 mb-2 items-center text-sm font-medium bg-slate-400 text-slate-100 rounded-full px-3 py-1`}>Another</span>
                  <span className={`mx-1 mb-2 items-center text-sm font-medium bg-slate-400 text-slate-100 rounded-full px-3 py-1`}>Guild</span>
                  <span className={`mx-1 mb-2 items-center text-sm font-medium bg-slate-400 text-slate-100 rounded-full px-3 py-1`}>Small</span>
                  <span className={`mx-1 mb-2 items-center text-sm font-medium bg-slate-400 text-slate-100 rounded-full px-3 py-1`}>Big</span>
                  <span className={`mx-1 mb-2 items-center text-sm font-medium bg-slate-400 text-slate-100 rounded-full px-3 py-1`}>Really Long</span>
                  <span className={`mx-1 mb-2 items-center text-sm font-medium bg-slate-400 text-slate-100 rounded-full px-3 py-1`}>Tag</span>
                  <span className={`mx-1 mb-2 items-center text-sm font-medium bg-slate-400 text-slate-100 rounded-full px-3 py-1`}>Here</span>
                  <span className={`mx-1 mb-2 items-center text-sm font-medium bg-slate-400 text-slate-100 rounded-full px-3 py-1`}>There</span>
                  <span className={`mx-1 mb-2 items-center text-sm font-medium bg-slate-400 text-slate-100 rounded-full px-3 py-1`}>Everywhere</span>
                </div>
              </div>)
              : <div className="w-full flex justify-center">
                <div className="rounded-lg bg-slate-100 py-16 lg:py-24 px-8 w-full">
                  <Heading as="h4" className="text-center mb-2">Nothing yet!</Heading>
                  <Text className="text-center mb-8">Nobody here.</Text>
                </div>
              </div>
          }
        </div>
      </section>
    </div>
  </PublicLayout>
};

// Exports
// ========================================================
export default Org;
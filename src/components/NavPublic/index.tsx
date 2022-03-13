// Imports
// ========================================================
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppAuth } from "../../providers/AppAuth";
import { useAuth } from "../../providers/Supabase";
import Button from "../Button";
import Modal from "../Modal";
import Text from "../Text";

// Config
// ========================================================

// Component
// ========================================================
const NavPublic = () => {
  // State Props
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const { user } = useAppAuth();
  const { profile } = useAppAuth();
  const [showModal, setShowModal] = useState(false);

  // Functions
  /**
   * 
   */
  const onClickSignOut = () => {
    signOut();
  };

  // Render
  return <nav className="bg-white border-b border-slate-200">
    <div className="flex justify-between items-center px-4">
      <span className="flex items-center h-20 px-4 text-slate-700 text-xl font-semibold ">
        <svg className="w-10 h-10 mr-1" width="142" height="142" viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="70.7107" width="100" height="100" rx="50" transform="rotate(-45 0 70.7107)" fill="#E2E8F0" />
          <path fillRule="evenodd" clipRule="evenodd" d="M35.1429 105.852C35.2135 105.924 35.2843 105.995 35.3553 106.066C53.5623 124.273 82.3174 125.503 101.95 109.756L109.756 101.95C125.503 82.3174 124.273 53.5623 106.066 35.3553C105.995 35.2843 105.924 35.2135 105.852 35.1429L35.1429 105.852Z" fill="#0F172A" />
        </svg>
        Shadow
      </span>
      <ul className="hidden md:flex">
        {/* {Links.map((link, key) =>
          <li key={`link-${key}`}><Link className={`${link.pathname === pathname ? 'text-slate-900' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'} h-20 transition-colors ease-in-out duration-200 flex items-center font-medium px-4`} to={link.pathname}>{link.name}</Link></li>
        )} */}
        <li className="relative dropdown hover:bg-slate-100 transition-colors ease-in-out duration-200">
          <div title={`${profile?.username || user?.email}`} className={`text-slate-400 cursor-pointer h-20 transition-colors ease-in-out duration-200 flex items-center font-medium px-4`}>
            <svg height="40" width="40" className="block h-10 w-10 fill-slate-500">
              <circle cx="20" cy="20" r="20" />
              <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-300 w-12 font-medium text-center block uppercase">{(profile?.username ?? user?.email ?? '').slice(0, 1)}</text>
            </svg>
          </div>
          <div className="absolute dropdown-menu hidden top-20 w-52 right-0 bg-white border-slate-200 shadow">
            <ul>
              <li><span onClick={onClickSignOut} className="hover:bg-slate-100 hover:text-slate-900 flex items-center h-16 px-8 justify-end font-medium text-slate-500 transition-colors ease-in-out duration-200 cursor-pointer">Sign Out</span></li>
            </ul>
          </div>
        </li>
      </ul>
      <Button onClick={() => setShowModal(true)} variant="none" className="hover:bg-slate-200 font-medium rounded-full h-12 px-3 mr-1 md:hidden">
        <span className=" h-1 w-7 bg-slate-700 mb-1 block"></span>
        <span className=" h-1 w-7 bg-slate-700 mb-1 block"></span>
        <span className=" h-1 w-7 bg-slate-700 block"></span>
      </Button>
    </div>

    <Modal className="md:hidden" isDark onClose={() => setShowModal(false)} isVisible={showModal}>
      <div title={`${profile?.username || user?.email}`} className={`text-slate-400 cursor-pointer h-20 mt-4 transition-colors ease-in-out duration-200 flex items-center font-medium`}>
        <svg height="40" width="40" className="block h-10 w-10 fill-slate-500 mr-2">
          <circle cx="20" cy="20" r="20" />
          <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-300 w-12 font-medium text-center block uppercase">{(profile?.username ?? user?.email ?? '').slice(0, 1)}</text>
        </svg>
        <Text>{(profile?.username ?? user?.email ?? '')}</Text>
      </div>

      <ul className="-mx-2">
        <li className="flex">
          <Button variant="gray" onClick={onClickSignOut} className="mx-2 w-full">Sign Out</Button>
        </li>
      </ul>
    </Modal>
  </nav>
};

// Exports
// ========================================================
export default NavPublic;
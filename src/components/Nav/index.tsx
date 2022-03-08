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
const Links = [
  {
    pathname: '/dashboard/organizations',
    name: 'Organizations'
  },
  // {
  //   pathname: '/dashboard/hooks',
  //   name: 'Hooks'
  // },
  // {
  //   pathname: '/dashboard/account',
  //   name: 'Account'
  // }
]

// Component
// ========================================================
const Nav = () => {
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
  return <nav className="bg-white border-b border-slate-200 -mx-2">
    <div className="flex justify-between items-center px-6">
      <Link className="flex items-center h-20 px-4 text-slate-500 text-xl font-semibold hover:bg-slate-100" to="/">
        <svg className="w-5 mr-3" width="30" height="45" viewBox="0 0 30 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-slate-900" d="M0 15C0 6.71572 6.71573 0 15 0V0C23.2843 0 30 6.71573 30 15V40.4444C30 42.6536 28.2091 44.4444 26 44.4444H4C1.79086 44.4444 0 42.6536 0 40.4444V15Z" />
        </svg>
        Shadow
      </Link>
      <ul className="hidden md:flex">
        {Links.map((link, key) =>
          <li key={`link-${key}`}><Link className={`${link.pathname === pathname ? 'text-slate-900' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'} h-20 transition-colors ease-in-out duration-200 flex items-center font-medium px-4`} to={link.pathname}>{link.name}</Link></li>
        )}
        <li className="relative dropdown hover:bg-slate-100 transition-colors ease-in-out duration-200">
          <div title={`${profile?.username || user?.email}`} className={`text-slate-400 cursor-pointer h-20 transition-colors ease-in-out duration-200 flex items-center font-medium px-4`}>
            <svg height="40" width="40" className="block h-10 w-10 fill-slate-500">
              <circle cx="20" cy="20" r="20" />
              <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-300 w-12 font-medium text-center block uppercase">{(profile?.username ?? user?.email ?? '').slice(0, 1)}</text>
            </svg>
          </div>
          <div className="absolute dropdown-menu hidden top-20 w-52 right-0 bg-white border-slate-200 shadow">
            <ul>
              <li className="border-b border-slate-100"><Link className="hover:bg-slate-100 hover:text-slate-900 flex items-center h-16 px-8 justify-end font-medium text-slate-500 transition-colors ease-in-out duration-200" to="/dashboard/account">Account Settings</Link></li>
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
        {Links.map((link, key) =>
          <li key={`link-${key}`}><Link className={`${link.pathname === pathname ? 'text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'} px-4 h-16 transition-colors ease-in-out duration-200 flex items-center font-medium`} to={link.pathname}>{link.name}</Link></li>
        )}
        <li className="mb-4"><Link className={`${pathname === '/dashboard/account' ? 'text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white0'} px-4 h-16 transition-colors ease-in-out duration-200 flex items-center font-medium`} to={`/dashboard/account`}>Account Settings</Link></li>
        <li className="flex">
          <Button variant="gray" onClick={onClickSignOut} className="mx-2 w-full">Sign Out</Button>
        </li>
      </ul>
    </Modal>
  </nav>
};

// Exports
// ========================================================
export default Nav;
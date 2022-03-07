// Imports
// ========================================================
import { Link, useLocation } from "react-router-dom";
import { useAppAuth } from "../../providers/AppAuth";
import { useAuth } from "../../providers/Supabase";

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

  // Functions
  /**
   * 
   */
  const onClickSignOut = () => {
    signOut();
  };

  // Render
  return <nav className="bg-white border-b border-slate-200">
    <div className="flex justify-between px-6">
      <span className="text-slate-900 text-xl h-20 flex items-center font-semibold"><Link to="/">Shadow</Link></span>
      <ul className="flex">
        {Links.map((link, key) =>
          <li key={`link-${key}`}><Link className={`${link.pathname === pathname ? 'text-slate-900' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'} h-20 transition-colors ease-in-out duration-200 flex items-center font-medium px-4`} to={link.pathname}>{link.name}</Link></li>
        )}
        <li className="relative dropdown hover:bg-slate-100 transition-colors ease-in-out duration-200">
          <div title={`${profile?.username || user?.email}`} className={`text-slate-400 cursor-pointer h-20 transition-colors ease-in-out duration-200 flex items-center font-medium px-4`}>
            <span className="h-10 w-10 block rounded-full bg-slate-500 mr-3"></span>
            <span className="overflow-hidden text-ellipsis">{profile?.username || user?.email}</span>
          </div>
          <div className="absolute dropdown-menu hidden top-20 w-52 right-0 bg-white border-slate-200 shadow">
            <ul>
              <li className="border-b border-slate-100"><Link className="hover:bg-slate-100 hover:text-slate-900 flex items-center h-16 px-8 justify-end font-medium text-slate-500 transition-colors ease-in-out duration-200" to="/dashboard/account">Account Settings</Link></li>
              <li><span onClick={onClickSignOut} className="hover:bg-slate-100 hover:text-slate-900 flex items-center h-16 px-8 justify-end font-medium text-slate-500 transition-colors ease-in-out duration-200 cursor-pointer">Sign Out</span></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </nav>
};

// Exports
// ========================================================
export default Nav;
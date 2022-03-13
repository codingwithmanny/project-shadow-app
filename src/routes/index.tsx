// Imports
// ========================================================
import { Route, Routes } from 'react-router-dom';

// Pages
import SignUpPage from '../pages/SignUp';
import SignInPage from '../pages/SignIn';
import OrganizationsPage from '../pages/Organizations';
import OrganizationPage from '../pages/Organization';
import AccountPage from '../pages/Account';
import NotFoundPage from '../pages/NotFound';
import ForgotPage from '../pages/Forgot';
import PublicVerify from '../pages/PublicVerify';
import PublicOrgPage from '../pages/PublicOrg';

// Main Routes
// ========================================================
const RootRoutes = () => {
  // Render
  return <Routes>
    <Route path="/" element={<span></span>} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/signin" element={<SignInPage />} />
    <Route path="/forgot" element={<ForgotPage />} />
    <Route path="/dashboard/organizations" element={<OrganizationsPage />} />
    <Route path="/dashboard/organizations/:id" element={<OrganizationPage />} />
    <Route path="/dashboard/organizations/:id/settings" element={<OrganizationPage />} />
    <Route path="/dashboard/organizations/:id/hooks" element={<OrganizationPage />} />
    <Route path="/dashboard/organizations/:id/forms" element={<OrganizationPage />} />
    <Route path="/dashboard/account" element={<AccountPage />} />
    <Route path="/p/verify/:id" element={<PublicVerify />} />
    <Route path="/p/org/:id" element={<PublicOrgPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
};

// Exports
// ========================================================
export default RootRoutes;
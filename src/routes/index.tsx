// Imports
// ========================================================
import { Route, Routes } from 'react-router-dom';

// Pages
import SignUpPage from '../pages/SignUp';
import SignInPage from '../pages/SignIn';
import OrganizationsPage from '../pages/Organizations';
import OrganizationPage from '../pages/Organization';
import AccountPage from '../pages/Account';
import ValidatePage from '../pages/Validate';
import NotFoundPage from '../pages/NotFound';
// import AccountPage from '../pages/Account';
// import OrganizationsPage from '../pages/Organizations';
// import HooksPage from '../pages/Hooks';

// Main Routes
// ========================================================
const RootRoutes = () => {
  // Render
  return <Routes>
    <Route path="/" element={<span></span>} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/signin" element={<SignInPage />} />
    <Route path="/dashboard/organizations" element={<OrganizationsPage />} />
    <Route path="/dashboard/organizations/:id" element={<OrganizationPage />} />
    <Route path="/dashboard/organizations/:id/settings" element={<OrganizationPage />} />
    <Route path="/dashboard/organizations/:id/hooks" element={<OrganizationPage />} />
    <Route path="/dashboard/organizations/:id/forms" element={<OrganizationPage />} />
    <Route path="/dashboard/account" element={<AccountPage />} />
    <Route path="/validate/:id" element={<ValidatePage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
};

// Exports
// ========================================================
export default RootRoutes;
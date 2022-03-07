// Imports
// ========================================================
import { BrowserRouter } from "react-router-dom";

// Provider
// ========================================================
const BrowserRouterProvider: React.FC = ({ children }) => {
  return <BrowserRouter>
    {children}
  </BrowserRouter>
};

// Exports
// ========================================================
export default BrowserRouterProvider;
// Imports
// ========================================================
import Nav from "../../components/Nav";

// Main layout
// ========================================================
const DashboardLayout: React.FC = ({ children }) => {
  return <div className="flex flex-col h-screen">
    <Nav />
    <main className="flex-1 bg-slate-50 pt-6">
      {children}
    </main>
  </div>
};

// Exports
// ========================================================
export default DashboardLayout;

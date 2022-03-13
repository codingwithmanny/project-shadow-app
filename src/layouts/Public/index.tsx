// Imports
// ========================================================
import { useEffect, useState } from "react";
import NavPublic from "../../components/NavPublic";

// Main layout
// ========================================================
const PublicLayout: React.FC = ({ children }) => {
  // Render
  return <div className="flex flex-col h-screen">
    <NavPublic />
    <main className="flex-1 bg-slate-50 pt-6">
      {children}
    </main>
  </div>
};

// Exports
// ========================================================
export default PublicLayout;

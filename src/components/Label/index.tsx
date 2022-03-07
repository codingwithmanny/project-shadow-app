// Imports
// =======================================================

// Main component
// ========================================================
const Label = ({ className = '', ...props }) => {
  return <label className={`block text-sm text-slate-600 ${className ?? ''}`} {...props} />;
};

// Imports
// ========================================================
export default Label;
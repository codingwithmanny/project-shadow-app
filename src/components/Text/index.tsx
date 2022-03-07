// Imports
// =======================================================

// Main component
// ========================================================
const Text: React.FC<{ className?: string, as?: string, }> = ({ className = '', as = 'p', children, ...props }) => {
  return <p className={`text-slate-500 text-sm lg:text-base ${className}`} {...props}>{children}</p>;
};

// Imports
// ========================================================
export default Text;
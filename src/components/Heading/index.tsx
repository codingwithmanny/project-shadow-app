// Imports
// =======================================================

// Main component
// ========================================================
const Heading: React.FC<{ className?: string, title?: string; as?: string, }> = ({ className = '', title = '', as = 'h1', children, ...props }) => {
  if (as === "h6") return <h6 title={`${title}`} className={`font-medium text-slate-500 text-sm ${className}`} {...props}>{children}</h6>;
  if (as === "h5") return <h5 title={`${title}`} className={`font-medium text-slate-600 ${className}`} {...props}>{children}</h5>;
  if (as === "h4") return <h4 title={`${title}`} className={`font-medium text-slate-700 lg:text-lg ${className}`} {...props}>{children}</h4>;
  if (as === "h3") return <h3 title={`${title}`} className={`font-medium text-slate-700 text-lg lg:text-2xl ${className}`} {...props}>{children}</h3>;
  if (as === "h2") return <h2 title={`${title}`} className={`font-medium text-slate-800 text-lg lg:text-2xl ${className}`} {...props}>{children}</h2>;
  return <h1 title={`${title}`} className={`font-medium text-slate-900 text-xl lg:text-3xl ${className}`} {...props}>{children}</h1>;
};

// Imports
// ========================================================
export default Heading;
// Imports
// =======================================================

// Types
interface VariantsType {
  gray: string;
  default: string;
  none: string;
}

// Config
// =======================================================
const variants: VariantsType = {
  gray: `h-12 w-full lg:w-auto text-slate-800 bg-slate-200 hover:bg-slate-300 font-medium rounded-full`,
  default: `h-10 border border-gray-300 rounded px-4 transition-all ease-in-out duration-200 disabled:opacity-60`,
  none: `border border-gray-300 px-4 transition-all ease-in-out duration-200 disabled:opacity-60`
}

// const paddings: PaddingsType = {
//   none: '',
//   default: `px-8`
// }


// Main component
// ========================================================
const Input = ({ className = '', variant = 'default', ...props }) => {
  return <input autoComplete="off" className={`${variants?.[variant as keyof VariantsType]} ${className}`} {...props} />;
};

// Imports
// ========================================================
export default Input;
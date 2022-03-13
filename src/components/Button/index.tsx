// Imports
// =======================================================

// Types
interface VariantsType {
  none: string;
  gray: string;
  grayNoPadding: string;
  default: string;
  defaultNoPadding: string;
  grayNoWidth: string;
}

interface PaddingsType {
  none: string;
  default: string;
}

// Config
// =======================================================
const variants: VariantsType = {
  none: '',
  gray: `h-12 w-full lg:w-auto text-slate-800 bg-slate-200 hover:bg-slate-300 font-medium rounded-full`,
  grayNoWidth: `h-12 text-slate-800 bg-slate-200 hover:bg-slate-300 font-medium rounded-full`,
  grayNoPadding: `text-slate-800 bg-slate-200 hover:bg-slate-300 font-medium rounded-full`,
  defaultNoPadding: `text-white bg-slate-800 hover:bg-slate-900 font-medium rounded-full`,
  default: `h-12 text-white bg-slate-800 hover:bg-slate-900 font-medium rounded-full`
}

const paddings: PaddingsType = {
  none: '',
  default: `px-8`
}

// Main component
// ========================================================
const Button = ({ className = '', forwardRef = undefined, variant = 'default', padding = 'default', ...props }) => {
  // Render
  return <button ref={forwardRef} className={`${variants?.[variant as keyof VariantsType]} ${paddings?.[padding as keyof PaddingsType]} transition-all ease-in-out duration-200 disabled:bg-opacity-40 ${className}`} {...props} />;
};

// Imports
// ========================================================
export default Button;
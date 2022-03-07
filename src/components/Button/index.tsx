// Imports
// =======================================================

// Types
interface VariantsType {
  gray: string;
  default: string;
  grayNoWidth: string;
}

interface PaddingsType {
  none: string;
  default: string;
}

// Config
// =======================================================
const variants: VariantsType = {
  gray: `h-12 w-full lg:w-auto text-slate-800 bg-slate-200 hover:bg-slate-300 font-medium rounded-full`,
  grayNoWidth: `h-12 text-slate-800 bg-slate-200 hover:bg-slate-300 font-medium rounded-full`,
  default: `h-12 text-white bg-slate-800 hover:bg-slate-900 font-medium rounded-full`
}

const paddings: PaddingsType = {
  none: '',
  default: `px-8`
}

// Main component
// ========================================================
const Button = ({ className = '', variant = 'default', padding = 'default', ...props }) => {


  // Render
  return <button className={`${variants?.[variant as keyof VariantsType]} ${paddings?.[padding as keyof PaddingsType]} transition-all ease-in-out duration-200 disabled:bg-opacity-40 ${className}`} {...props} />;
};

// Imports
// ========================================================
export default Button;
// Imports
// =======================================================
import { ChevronDown } from "react-feather";

// Types
interface VariantsType {
  default: string;
}

// Config
// =======================================================
const variants: VariantsType = {
  default: `w-full h-10 border border-slate-300 rounded px-4 appearance-none transition-all ease-in-out duration-200 disabled:opacity-60`,
}

// Main component
// ========================================================
const Select = ({ className = '', variant = 'default', forwardRef = undefined, label = '', options = [], ...props }) => {
  return <div className="relative">
    <select ref={forwardRef} className={`${variants?.[variant as keyof VariantsType]} ${className}`} {...props}>
      {label ? <option disabled>{label}</option> : null}
      {options && options.length
        ? options.map((option: { value: any, label: string }, key) => <option key={`option-${key}`} value={option.value} >{option.label}</option>)
        : null}
    </select>
    <ChevronDown className="absolute right-2 top-0 bottom-0 my-auto" />
  </div>;
};

// Imports
// ========================================================
export default Select;
// Imports
// ========================================================
import { useEffect, useState } from "react"

// Hooks
// ========================================================
const useDebounce = (value: any, delay = 300) => {
  // State / Props
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Hooks
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay]);

  // Render
  return debouncedValue;
}

// Exports
// ========================================================
export default useDebounce;
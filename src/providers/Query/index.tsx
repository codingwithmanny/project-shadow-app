// Imports
// ========================================================
import { QueryClient, QueryClientProvider } from "react-query";

// Config
// ========================================================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

// Provider
// ========================================================
const BrowserRouterProvider: React.FC = ({ children }) => {
  return <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
};

// Exports
// ========================================================
export default BrowserRouterProvider;




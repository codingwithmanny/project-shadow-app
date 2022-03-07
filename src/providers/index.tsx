// Imports
// ========================================================
import AppAuthProvider from "./AppAuth";
import BrowserRouterProvider from "./BrowserRouter";
import SupabaseProvider from "./Supabase";
import QueryProvider from "./Query";
import { Provider as WagmiProvider } from 'wagmi';

// Main Providers
// ========================================================
const RootProvider: React.FC = ({ children }) => {
  return <div>
    <BrowserRouterProvider>
      <SupabaseProvider>
        <QueryProvider>
          <AppAuthProvider>
            <WagmiProvider>
              {children}
            </WagmiProvider>
          </AppAuthProvider>
        </QueryProvider>
      </SupabaseProvider>
    </BrowserRouterProvider>
  </div>
};

// Exports
// ========================================================
export default RootProvider;
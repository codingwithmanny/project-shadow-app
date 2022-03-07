// Imports
// ========================================================
import { createContext, useEffect, useReducer, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import FullLoader from '../../components/FullLoader';
import { AUTH } from '../../queries';
import { useAuth, useTable } from '../Supabase';

// Types
interface StateType {
  isLoading: boolean;
  error: any;
  hasError: boolean;
  user: any;
  profile: {
    [key: string]: any;
  } | null,
  getProfile: () => void;
}

// Config
// ========================================================
/**
 * 
 */
const initialState: StateType = {
  isLoading: false,
  error: null,
  hasError: false,
  user: null,
  profile: null,
  getProfile: () => { }
};

/**
 * 
 */
const actionTypes = {
  APP_LOADING: 'APP_LOADING',
  APP_ERROR: 'APP_ERROR',
  APP_SUCCESS: 'APP_SUCCESS'
};

/**
 * 
 */
const PATHS = {
  ROOT: ['', '/'],
  PUBLIC: ['/signin', '/signup', '/validate', '/members'],
  PRIVATE: '/dashboard'
}

// Context
// ========================================================
const AppAuthContext = createContext<StateType>(initialState);

// Reducer
// ========================================================
const reducer = (state: StateType, action: {
  type?: string;
  value?: any;
}) => {
  switch (action?.type) {
    case actionTypes.APP_LOADING:
      return {
        ...state,
        isLoading: true,
        hasError: false,
        error: null,
      };
    case actionTypes.APP_ERROR:
      return {
        ...state,
        isLoading: false,
        hasError: true,
        error: action.value,
      };
    case actionTypes.APP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        profile: action.value,
      };
    default:
      return state;
  }
};

// Main Provider
// ========================================================
const AppAuthProvider: React.FC = ({ children }) => {
  // State / Props
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const { session, isLoading } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>();

  // Requests
  const { data: authUser, mutate: authSignIn } = useMutation(AUTH.SIGNIN)

  /**
   * 
   */
  useEffect(() => {
    if (!authUser) return;
    setUser(authUser);
  }, [authUser]);

  /**
   * 
   */
  useEffect(() => {
    if (!session) return;

    authSignIn({
      id: `${session?.user?.id}`,
      email: `${session?.user?.email}`,
    });
  }, [session]);

  /**
   * 
   */
  useEffect(() => {
    if (isLoading) return;
    if (session && [...PATHS.PUBLIC, '/', '/dashboard'].includes(pathname)) {
      navigate('/dashboard/organizations');
    } else if (!session && pathname.startsWith(PATHS.PRIVATE)) {
      navigate('/signin');
    }

    setIsAppLoading(false);
  }, [pathname, session, authUser, isLoading])



  // Render
  /**
   * 
   */
  if (isAppLoading) return <FullLoader />;

  /**
   * 
   */
  return <AppAuthContext.Provider value={{ ...state, user }}>{children}</AppAuthContext.Provider>
}

// Hooks
// ========================================================
const useAppAuth = () => {
  const context = useContext(AppAuthContext);

  if (context === undefined) {
    throw new Error('useAppAuth must be used within a AppAuthContext.Provider')
  };

  return context;
};

// Exports
// ========================================================
export default AppAuthProvider;
export {
  useAppAuth
}


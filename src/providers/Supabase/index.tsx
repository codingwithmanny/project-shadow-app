// Imports
// ========================================================
import { createContext, useEffect, useReducer, useContext } from 'react';
import { createClient, ApiError, PostgrestError, PostgrestResponse, Session, SupabaseClient, User } from '@supabase/supabase-js';

// Types
interface StateType {
  auth: {
    isLoading: boolean;
    error: ApiError | null;
    hasError: boolean;
    user: User | null;
    session: Session | null;
    signIn: (creds: { email: string, password: string }) => void;
    signUp: (creds: { email: string, password: string }) => void;
    signOut: () => void;
    reset: () => void;
  },
  table: {
    client: SupabaseClient;
    isLoading: boolean;
    error: PostgrestError | null;
    hasError: boolean;
    data: any[] | null;
    request: (callback?: () => Promise<Partial<PostgrestResponse<any>>>) => void;
  }
};

// Config
// ========================================================
/**
 * 
 */
const supabase = createClient(`${import.meta.env.VITE_SUPABASE_URL}`, `${import.meta.env.VITE_SUPABASE_ANON_PUBLIC}`);

/**
 * 
 */
const actionTypes = {
  AUTH: {
    SESSION_LOADING: 'SESSION_LOADING',
    SESSION_ERROR: 'SESSION_ERROR',
    SESSION_SUCCESS: 'SESSION_SUCCESS',
    SIGNUP_LOADING: 'SIGNUP_LOADING',
    SIGNUP_ERROR: 'SIGNUP_ERROR',
    SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
    SIGNIN_LOADING: 'SIGNIN_LOADING',
    SIGNIN_ERROR: 'SIGNIN_ERROR',
    SIGNIN_SUCCESS: 'SIGNIN_SUCCESS',
    SIGNOUT_LOADING: 'SIGNOUT_LOADING',
    SIGNOUT_ERROR: 'SIGNOUT_ERROR',
    SIGNOUT_SUCCESS: 'SIGNOUT_SUCCESS',
    RESET: 'RESET',
  },
  TABLE: {
    REQUEST_LOADING: 'REQUEST_LOADING',
    REQUEST_ERROR: 'REQUEST_ERROR',
    REQUEST_SUCCESS: 'REQUEST_SUCCESS'
  }
};

/**
 * 
 */
const initialState: StateType = {
  auth: {
    isLoading: true,
    error: null,
    hasError: false,
    user: null,
    session: null,
    signIn: (creds: { email: string, password: string }) => { },
    signUp: (creds: { email: string, password: string }) => { },
    signOut: () => { },
    reset: () => { }
  },
  table: {
    client: supabase,
    isLoading: false,
    error: null,
    hasError: false,
    data: null,
    request: () => { },
  }
};

// Context
// ========================================================
const SupabaseContext = createContext<StateType>(initialState);

// Reducer
// ========================================================
const reducer = (state: StateType, action: {
  type?: string;
  value?: any;
}) => {
  // console.log(action.type, { state });
  switch (action?.type) {
    // Auth
    case actionTypes.AUTH.SESSION_LOADING:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: true,
          hasError: false,
          error: null
        }
      }
    case actionTypes.AUTH.SESSION_ERROR:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          hasError: true,
          error: action.value
        }
      };
    case actionTypes.AUTH.SESSION_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          session: action.value,
          user: action.value?.user
        }
      };
    case actionTypes.AUTH.SIGNUP_LOADING:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: true,
          hasError: false,
          error: null
        }
      }
    case actionTypes.AUTH.SIGNUP_ERROR:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          hasError: true,
          error: action.value
        }
      };
    case actionTypes.AUTH.SIGNUP_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          user: action.value
        }
      };
    case actionTypes.AUTH.SIGNIN_LOADING:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: true,
          hasError: false,
          error: null
        }
      }
    case actionTypes.AUTH.SIGNIN_ERROR:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          hasError: true,
          error: action.value
        }
      };
    case actionTypes.AUTH.SIGNIN_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          session: action.value,
          user: action.value?.user
        }
      };
    case actionTypes.AUTH.SIGNOUT_LOADING:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: true,
          hasError: false,
          error: null
        }
      }
    case actionTypes.AUTH.SIGNOUT_ERROR:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          hasError: true,
          error: action.value,
          session: null,
          user: null
        }
      };
    case actionTypes.AUTH.SIGNOUT_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          session: null,
          user: null
        }
      };
    case actionTypes.AUTH.RESET:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          error: null,
          hasError: false,
          user: null,
          session: null
        }
      }
    // Table
    case actionTypes.TABLE.REQUEST_LOADING:
      return {
        ...state,
        table: {
          ...state.table,
          isLoading: true,
          hasError: false,
          error: null
        }
      }
    case actionTypes.TABLE.REQUEST_ERROR:
      return {
        ...state,
        table: {
          ...state.table,
          isLoading: false,
          hasError: true,
          error: action.value
        }
      };
    case actionTypes.TABLE.REQUEST_SUCCESS:
      return {
        ...state,
        table: {
          ...state.table,
          isLoading: false,
          data: action.value,
        }
      };
    default:
      return state;
  };
};

// Main Provider
// ========================================================
const SupabaseProvider: React.FC<{ client: SupabaseClient }> = ({ children, client }) => {
  // State / Props
  const [state, dispatch] = useReducer(reducer, initialState);

  // Functions
  /**
   * 
   * @param creds 
   */
  const signUp = async (creds: { email: string, password: string }) => {
    dispatch({ type: actionTypes.AUTH.SIGNUP_LOADING });

    const { user, error } = await client.auth.signUp(creds);

    if (error) {
      dispatch({ type: actionTypes.AUTH.SIGNUP_ERROR, value: error });
      return;
    }

    dispatch({ type: actionTypes.AUTH.SIGNUP_SUCCESS, value: user });
  };

  /**
   * 
   * @param creds 
   */
  const signIn = async (creds: { email: string, password: string }) => {
    dispatch({ type: actionTypes.AUTH.SIGNIN_LOADING });

    const { session, error } = await client.auth.signIn(creds);
    console.log({ session });

    if (error) {
      dispatch({ type: actionTypes.AUTH.SIGNIN_ERROR, value: error });
      return;
    }

    dispatch({ type: actionTypes.AUTH.SIGNIN_SUCCESS, value: session });
  };

  /**
   * 
   * @param creds 
   */
  const signOut = async () => {
    dispatch({ type: actionTypes.AUTH.SIGNOUT_LOADING });

    const { error } = await client.auth.signOut();

    if (error) {
      dispatch({ type: actionTypes.AUTH.SIGNOUT_ERROR, value: error });
      return;
    }

    dispatch({ type: actionTypes.AUTH.SIGNOUT_SUCCESS });
  };

  /**
   * 
   * @param callback 
   * @returns 
   */
  const request = async (callback?: () => Promise<Partial<PostgrestResponse<any>>>) => {
    if (callback) {
      dispatch({ type: actionTypes.TABLE.REQUEST_LOADING });

      const { data, error, status } = await callback();
      if (error) {
        dispatch({ type: actionTypes.TABLE.REQUEST_ERROR, value: { status, error } });
        return;
      }

      dispatch({ type: actionTypes.TABLE.REQUEST_SUCCESS, value: data });
    }
  };

  /**
   * 
   */
  const reset = () => {
    dispatch({ type: actionTypes.AUTH.RESET });
  };

  // Hooks
  /**
   * 
   */
  useEffect(() => {
    dispatch({ type: actionTypes.AUTH.SESSION_LOADING });

    const session = client.auth.session();

    dispatch({ type: actionTypes.AUTH.SESSION_SUCCESS, value: session });

    client.auth.onAuthStateChange((event, session) => {
      console.log({ event, session });

      dispatch({ type: actionTypes.AUTH.SESSION_LOADING });
      if (event === 'SIGNED_IN') {
        dispatch({ type: actionTypes.AUTH.SIGNIN_SUCCESS, value: session });
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: actionTypes.AUTH.SIGNOUT_SUCCESS });
      }

      dispatch({ type: actionTypes.AUTH.SESSION_SUCCESS });

      // else if (event === 'TOKEN_REFRESHED') {
      //   dispatch({ type: actionTypes.TOKEN_REFRESHED });
      // } else if (event === 'USER_UPDATED') {
      //   dispatch({ type: actionTypes.USER_UPDATED, value: session });
      // } else if (event === 'USER_DELETED') {
      //   dispatch({ type: actionTypes.USER_DELETED });
      // } else if (event === 'PASSWORD_RECOVERY') {
      //   dispatch({ type: actionTypes.PASSWORD_RECOVERY, value: session });
      // }
    });
  }, []);

  // Render
  return <SupabaseContext.Provider value={{
    auth: {
      ...state.auth,
      signUp,
      signIn,
      signOut,
      reset
    },
    table: {
      ...state.table,
      client,
      request
    }
  }}>{children}</SupabaseContext.Provider>
};

// Wrapped Provider
// ========================================================
const WrappedSupabaseProvider: React.FC = ({ children }) => {
  return <SupabaseProvider client={supabase}>{children}</SupabaseProvider>
};

// Hooks
// ========================================================
/**
 * 
 * @returns 
 */
const useAuth = () => {
  const context = useContext(SupabaseContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseContext.Provider')
  };

  return context.auth;
};

/**
 * 
 * @returns 
 */
const useTable = () => {
  const context = useContext(SupabaseContext);

  if (context === undefined) {
    throw new Error('useTable must be used within a SupabaseContext.Provider')
  };

  return context.table;
};

// Exports
// ========================================================
export default WrappedSupabaseProvider;
export {
  useAuth,
  useTable,
  supabase
};
import React, { useReducer, useMemo, useCallback, useContext, useEffect } from 'react';

const AuthContext = React.createContext();

const KEY = 'authentication_token';

const reducer = (state, action) => {
  switch (action.type) {
    case 'set-auth-token': return { ...state, authToken: action.token };
    case 'clear-auth-token': return { ...state, authToken: null };
    case 'action-failed': return { ...state, errorMessage: action.message };
    default: throw new Error(`Unhandled action ${action.type}!`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    authToken: null,
    errorMessage: null
  });
  const { authToken, errorMessage } = state;

  const updateAuthToken = useCallback((token) => {
    try {
      if (token == null) {
        localStorage.removeItem(KEY);
        dispatch({ type: 'clear-auth-token' });
      } else {
        localStorage.setItem(KEY, JSON.stringify({ token: token }));
        dispatch({ type: 'set-auth-token', token: token });
      }
      return true;
    } catch (error) {
      dispatch({ type: 'action-failed', message: error.message});
      return false;
    }
  }, []);

  useEffect((event) => {
    if (event && event.preventDefault) event.preventDefault();

    const getAuthToken = async () => {
      try {
        const authTokenFromStorage = localStorage.getItem(KEY);
        if (authTokenFromStorage == null) return;
        const authTokenInfo = JSON.parse(authTokenFromStorage);
        dispatch({ type: 'set-auth-token', token: authTokenInfo.token });
      } catch (error) {
        dispatch({ type: 'action-failed', message: error.message });
      }
    };
    getAuthToken();
  }, []);

  const loggedIn = authToken != null;

  const value = useMemo(() => {
    return {
      loggedIn,
      authToken,
      errorMessage,
      updateAuthToken
    };
  }, [loggedIn, authToken, errorMessage, updateAuthToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthenticator = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within a AuthProvider');
  return context;
};

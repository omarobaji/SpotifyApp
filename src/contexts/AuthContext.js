import React, { useReducer, useMemo, useCallback, useContext, useEffect } from 'react';

const AuthContext = React.createContext();

const KEY = 'authentication_token';

const reducer = (state, action) => {
  switch (action.type) {
    case 'set-auth-token': return { ...state, authToken: action.token };
    case 'clear-auth-token': return { ...state, authToken: null };
    default: throw new Error(`Unhandled action ${action.type}!`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    authToken: null
  });
  const { authToken } = state;
  const updateAuthToken = useCallback((token, expiry) => {
    try {
      if (token == null) {
        localStorage.removeItem(KEY);
        dispatch({ type: 'clear-auth-token' });
      } else {
        localStorage.setItem(KEY, JSON.stringify({ token: token, expires_in: expiry }));
        console.log(token, ' token before setting');
        dispatch({ type: 'set-auth-token', token: token });
      }
      return true;
    } catch (error) {
      console.log(error.message);
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
        console.log(error.message);
      }
    };
    getAuthToken();
  }, []);

  const loggedIn = authToken != null;

  const value = useMemo(() => {
    return {
      loggedIn,
      authToken,
      updateAuthToken
    };
  }, [loggedIn, authToken, updateAuthToken]);

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

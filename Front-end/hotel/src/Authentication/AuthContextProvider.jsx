import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";
export const AuthContextProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(storedUser),
      });
    }
  }, []);
  const signIn = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setAuthState({
      isAuthenticated: true,
      user: userData,
    });
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        signIn,
        user: authState.user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

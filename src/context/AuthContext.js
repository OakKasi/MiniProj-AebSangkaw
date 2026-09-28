import { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState('customer');
  const [username, setUsername] = useState('');

  const login = (role, name = '') => {
    setUserToken("test token");
    setUserRole(role);
    if (name) setUsername(name);
  };
  const logout = () => {
    setUserToken(null);
    setUserRole('customer');
    setUsername('');
  };
  return (
    <AuthContext.Provider value={{ userToken, userRole, username, setUsername, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
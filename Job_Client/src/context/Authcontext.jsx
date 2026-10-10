import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [resetEmail, setResetEmail] = useState("");

  return (
    <AuthContext.Provider value={{ resetEmail, setResetEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

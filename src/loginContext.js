import React, { useState,useContext,useEffect } from 'react'

const LoginContext = React.createContext();

const LoginProvider = function({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return <LoginContext.Provider
    value={{
        isAuthenticated,
        setIsAuthenticated,
    }}>
        {children}
    </LoginContext.Provider>
}

export const useLoginContext = function() {
    return useContext(LoginContext);
}

export { LoginContext,LoginProvider }
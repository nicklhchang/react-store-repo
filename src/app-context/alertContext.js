import React, { useState,useContext,useEffect } from 'react'

const AlertContext = React.createContext();

const AlertProvider = function({ children }) {
    const [alert, setAlert] = useState({
        shown:false,
        msg:''
    });

    const setCustomAlert = function(shown,msg) {
        setAlert({ shown:shown,msg:msg });
        // setAlert({ shown,msg }); // ES6 shorthand
    }

    const alertOver = function() {
        setAlert({ shown:false,msg:'' });
    }

    return <AlertContext.Provider
    value={{
        alert,
        setAlert,
        setCustomAlert,
        alertOver
    }}>
        {children}
    </AlertContext.Provider>
}

export const useAlertContext = function() {
    return useContext(AlertContext);
}

export { AlertContext,AlertProvider }
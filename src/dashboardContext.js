import React, { useState,useContext,useCallback } from 'react'
import axios from 'axios'
axios.defaults.withCredentials = true; // always send cookie to backend because passport wants

const DashboardContext = React.createContext();

const DashboardProvider = function({ children }) {
    const [menu,setMenu] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // useCallback allows write once here, then pass as inline function to useEffect in other components
    // prevents infinite loop when placing function inside dependency array
    // because useCallback memoizes, function remains same, and hence no change
    const fetchAuthStatus = useCallback(function() {
        // on first render of this route, check if already have active cookie, if so redirect straight to dashboard
        // btw, useEffect does not like async await
        axios.get('http://localhost:8000/api/v1/auth/login-status')
        .then(function(response) {
        //   console.log(response.data);
          const { alreadyAuthenticated,user } = response.data;
          if (alreadyAuthenticated) {
            setIsAuthenticated(true);
            setCurrentUser(user);
          } else {
            // set to default because unlike useState, re-renders do not reset dashboardContext states
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      }, []);

    return <DashboardContext.Provider value={{
        menu,
        setMenu,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        fetchAuthStatus
    }}>
        {children}
    </DashboardContext.Provider>
}

const useDashboardContext = function() {
    return useContext(DashboardContext);
}

export { useDashboardContext,DashboardProvider }
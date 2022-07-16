import React, { useState,useContext,useCallback, useReducer } from 'react'
import { authReducer,sidebarReducer } from './dashboardReducer';

import axios from 'axios'
axios.defaults.withCredentials = true; // always send cookie to backend because passport wants

const DashboardContext = React.createContext();

const stateAuthUser = {
  isAuthenticated:false,
  currentUser:null,
  currentSessionCookie:null
}

const stateSidebar = {
  isSidebarOpen:false,
  sidebarFilterOptions:[]
}

const DashboardProvider = function({ children }) {
    const [wholeMenu,setWholeMenu] = useState([]);
    const [authState,authDispatch] = useReducer(authReducer,stateAuthUser);
    const [sidebarState,sidebarDispatch] = useReducer(sidebarReducer,stateSidebar);

    const authenticate = function(user,sessionCookie) {
      authDispatch({ type:'authenticate',payload:{user,sessionCookie} });
    }

    const unauthenticate = function() {
      authDispatch({ type:'unauthenticate' });
    }

    const toggleSidebar = function(action) {
      sidebarDispatch({ type:action });
    }

    const filterOptions = function(arr) {
      sidebarDispatch({ type:'filter',payload:arr });
    }

    return <DashboardContext.Provider value={{
        wholeMenu,
        setWholeMenu,
        ...authState,
        authenticate,
        unauthenticate,
        ...sidebarState,
        toggleSidebar,
        filterOptions
    }}>
        {children}
    </DashboardContext.Provider>
}

const useDashboardContext = function() {
    return useContext(DashboardContext);
}

export { useDashboardContext,DashboardProvider }
import React, { useState, useContext, useCallback, useReducer } from 'react'
import { authReducer, sidebarReducer, cartReducer } from './dashboardReducer';

import axios from 'axios'
axios.defaults.withCredentials = true; // always send cookie to backend because passport wants

const DashboardContext = React.createContext();

const stateAuthUser = {
  isAuthenticated: false,
  currentUser: null,
  currentSessionCookie: null 
  // could always document.cookie === currentSessionCookie instead of having isAuthenticated field
}

const stateSidebar = {
  isSidebarOpen: false,
  sidebarFilterOptions: {
    // empty by default; important for useEffect()
    // mealTypes:[],
    // budgetPrice:0
  }
}

const stateCart = {
  // localCart is { property:value } => { item._id:count }
  localCart: {},
  // time out running every minute, check if changesSinceLastUpload empty,
  // if not, then post request localCart/changesSinceLastUpload (handled), clear changesSinceLastUpload
  // cleanup function if too complicated can not use; do not res.json anything back to frontend

  // changesSinceLastUpload is { property:value } => { item._id:count }
  changesSinceLastUpload: {}
  // when post to backend, make copy first, then clear it, so any new changes can immediately be written
  // then use copy as req.body in backend post
  // OR lock this property finish post req then unlock so add to cart button can make changes
}

const DashboardProvider = function ({ children }) {
  // no useRef's because want re renders whenever these states change
  const [loading, setLoading] = useState(false);
  const [wholeMenu, setWholeMenu] = useState([]);
  const [itemPrices, setItemPrices] = useState({});
  const [authState, authDispatch] = useReducer(authReducer, stateAuthUser);
  const [sidebarState, sidebarDispatch] = useReducer(sidebarReducer, stateSidebar);
  const [cartState, cartDispatch] = useReducer(cartReducer, stateCart);

  // all the useCallback's prevent infinite loop when placing these functions in dep arr

  const authenticate = useCallback(function (user, sessionCookie) {
    authDispatch({ type: 'authenticate', payload: { user, sessionCookie } });
  }, [])

  const unauthenticate = useCallback(function () {
    authDispatch({ type: 'unauthenticate' });
  }, [])

  const toggleSidebar = useCallback(function (action) {
    sidebarDispatch({ type: action });
  }, [])

  const setFilterOptions = useCallback(function (arr, budget) {
    // console.log(arr) // ES6 shorthand {arr:arr,budget:budget}
    sidebarDispatch({ type: 'filter', payload: { arr, budget } });
  }, [])

  const clearFilterOptions = useCallback(function () {
    sidebarDispatch({ type: 'clear' });
  }, [])

  const populateCartInitial = useCallback(function (items) {
    cartDispatch({ type: 'initial-populate', payload: { items } });
  }, [])

  const clearChangesOnSync = useCallback(function () {
    cartDispatch({ type: 'clear-on-sync' })
  }, [])

  const mutateLocalCart = useCallback(function (type, id) {
    cartDispatch({ type: 'mutate-local-cart', payload: { type, id } })
  }, [])

  const clearLocalCart = useCallback(function() {
    cartDispatch({ type: 'clear-local-cart' })
  }, [])

  const addChange = useCallback(function (change) {
    cartDispatch({ type: 'add-change', payload: { change } })
  }, [])

  return <DashboardContext.Provider value={{
    loading,
    setLoading,
    itemPrices,
    setItemPrices,
    wholeMenu,
    setWholeMenu,
    ...authState,
    authenticate,
    unauthenticate,
    ...sidebarState,
    toggleSidebar,
    setFilterOptions,
    clearFilterOptions,
    ...cartState,
    populateCartInitial,
    clearChangesOnSync,
    mutateLocalCart,
    clearLocalCart
  }}>
    {children}
  </DashboardContext.Provider>
}

const useDashboardContext = function () {
  return useContext(DashboardContext);
}

export { useDashboardContext, DashboardProvider }
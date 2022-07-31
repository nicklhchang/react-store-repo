import React, { useState, useContext, useCallback, useReducer } from 'react'
import { authReducer, sidebarReducer, cartReducer } from './dashboardReducer';
import { useAlertContext } from './alertContext';

import axios, { CanceledError } from 'axios'
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
  // changesSinceLastUpload is { property:value } => { item._id:count }
  changesSinceLastUpload: {},
  isCartLocked: false
}

const DashboardProvider = function ({ children }) {
  // no useRef's because want re renders whenever these states change
  const [loading, setLoading] = useState(true);
  const [wholeMenu, setWholeMenu] = useState([]);
  const [itemPrices, setItemPrices] = useState({});

  // wrapped dashboard provider inside alert provider
  const { setCustomAlert } = useAlertContext();

  const [authState, authDispatch] = useReducer(authReducer, stateAuthUser);
  const [sidebarState, sidebarDispatch] = useReducer(sidebarReducer, stateSidebar);
  const [cartState, cartDispatch] = useReducer(cartReducer, stateCart);

  // all the useCallback's prevent infinite loop when placing these functions in dep arr

  // authentication related
  const authenticate = useCallback(function (user, sessionCookie) {
    authDispatch({ type: 'authenticate', payload: { user, sessionCookie } });
  }, [])

  const unauthenticate = useCallback(function () {
    authDispatch({ type: 'unauthenticate' });
  }, [])

  // sidebar state
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

  // cart state
  const populateCartInitial = useCallback(function (items) {
    cartDispatch({ type: 'initial-populate', payload: { items } });
  }, [])

  const lockCart = useCallback(function () {
    cartDispatch({ type: 'lock-changes' })
  }, [])

  const unlockCart = useCallback(function () {
    cartDispatch({ type: 'unlock-changes' })
  }, [])

  const clearChangesOnSync = useCallback(function () {
    cartDispatch({ type: 'clear-on-sync' })
  }, [])

  const mutateLocalCart = useCallback(function (optionM, id) {
    cartDispatch({ type: 'mutate-local-cart', payload: { optionM, id } })
  }, [])

  const clearLocalCart = useCallback(function (optionC) {
    cartDispatch({ type: 'clear-local-cart', payload: { optionC } })
  }, [])

  const loadCart = useCallback(function (cart, controller) {
    axios.get('http://localhost:8000/api/v1/browse/cart', { signal: controller.signal })
      .then(function (response) {
        console.log(response.data)
        const { alreadyAuthenticated, user, result } = response.data;
        if (alreadyAuthenticated) {
          authenticate(user, document.cookie)
          // if empty localCart or new user need to populate; get req on Welcome and Cart fixes
          if (!Object.keys(cart).length) {
            populateCartInitial(result.cart?.items)
          }
          let prices = {};
          result.prices.forEach(id_cost => {
            prices[id_cost._id] = id_cost.cost;
          });
          // console.log(prices)
          setItemPrices(prices);
        } else {
          unauthenticate();
          // display session over
        }
        setLoading(false);
      })
      .catch(function (error) {
        if (error instanceof CanceledError) {
          console.log('Aborted: no longer waiting on api req to return result')
        } else {
          console.log('api error, maybe alert user in future')
          setCustomAlert(true, 'error loading your cart, please retry')
        }
      });
  },
    // setCustomAlert not wrapped in a useCallback
    [authenticate, populateCartInitial, setCustomAlert, unauthenticate])

  // // add remove (-1) and remove item can probably be wrapped into one
  // const addToCart = useCallback(function (lockStatus, id) {
  //   lockStatus
  //     ? setCustomAlert(true, 'please wait a moment for your changes to sync')
  //     : mutateLocalCart('add', id);
  // },
  //   // setCustomAlert not wrapped in a useCallback
  //   [mutateLocalCart, setCustomAlert])

  // const removeFromCart = useCallback(function (lockStatus, id) {
  //   lockStatus
  //     ? setCustomAlert(true, 'please wait a moment for your changes to sync')
  //     : mutateLocalCart('remove', id);
  // },
  //   // setCustomAlert not wrapped in a useCallback
  //   [mutateLocalCart, setCustomAlert])

  // const removeItemFromCart = useCallback(function (lockStatus, id) {
  //   // should implement checking if property exists 
  //   lockStatus
  //     ? setCustomAlert(true, 'please wait a moment for your changes to sync')
  //     : mutateLocalCart('remove-item', id);
  // }, [mutateLocalCart, setCustomAlert])

  const mutateCartCheckLock = useCallback(function (lockStatus, mutation, id) {
    lockStatus
      ? setCustomAlert(true, 'please wait a moment for your changes to sync')
      : mutateLocalCart(mutation, id);
  }, [mutateLocalCart, setCustomAlert])

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
    lockCart,
    unlockCart,
    clearChangesOnSync,
    mutateLocalCart,
    clearLocalCart,
    loadCart,
    // addToCart,
    // removeFromCart,
    // removeItemFromCart,
    mutateCartCheckLock
  }}>
    {children}
  </DashboardContext.Provider>
}

const useDashboardContext = function () {
  return useContext(DashboardContext);
}

export { useDashboardContext, DashboardProvider }
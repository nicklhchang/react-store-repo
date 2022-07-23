import React, { useState, useEffect, useCallback, useRef } from 'react'
import MenuItem from '../components/MenuItem';
import { useDashboardContext } from '../app-context/dashboardContext';
import SessionOver from '../components/SessionOver';
import Loading from '../components/Loading';
import { FaBars } from 'react-icons/fa';

import axios, { CanceledError } from 'axios'
import MenuSidebar from './MenuSidebar';
axios.defaults.withCredentials = true; // always send cookie to backend because passport wants

/**
 * if visit /dashboard/menu renders both Dashboard and Menu
 */
const Menu = function () {
    const axiosReqLink = 'http://localhost:8000/api/v1/browse/menu';
    const [pageLessOne, setPageLessOne] = useState(0);
    const [menuPage, setMenuPage] = useState([]);
    // constantly changing but need re-renders for new part of menu when switch pages
    // const pageLessOne = useRef(0);
    // const menuPage = useRef([]);
    const {
        loading,
        setLoading,
        wholeMenu,
        setWholeMenu,
        isAuthenticated,
        currentSessionCookie,
        authenticate,
        unauthenticate,
        isSidebarOpen,
        sidebarFilterOptions,
        toggleSidebar,
        clearFilterOptions,
        clearLocalCart
    } = useDashboardContext();

    const logOutUser = useCallback(function () {
        unauthenticate();
        // causing problems if combine two useEffects, workaround is clearing on login/registration
        // clearFilterOptions();
        setWholeMenu([]);
        setMenuPage([]);
        // bad bad will clear on backend because syncing, ok without because loads next user's cart on login
        // clearLocalCart();
        // menuPage.current = [];
    }, [clearFilterOptions, setWholeMenu, unauthenticate, clearLocalCart]) // setMenuPage from this component

    const bucket = function (arr) {
        const itemsPerBucket = 5;
        const numBuckets = Math.ceil(arr.length / itemsPerBucket);
        const bucketedArr = Array.from({ length: numBuckets }, (_, i) => {
            const indexArr = i * itemsPerBucket;
            return arr.slice(indexArr, indexArr + itemsPerBucket);
        });
        return bucketedArr
    }

    const handleAxiosGetThen = useCallback(function (response) {
        console.log(response.data);
        const { alreadyAuthenticated, user, result } = response.data;
        if (alreadyAuthenticated) {
            authenticate(user, document.cookie);
            // stores menu as 2d array
            const paginated = bucket(result);
            setWholeMenu(paginated);
            // use paginated instead of wholeMenu because state update kicks in after useEffect
            // by default start at page zero to prevent bug if on page e.g. 3 but only load 2 pages
            setMenuPage(paginated[0]);
            // menuPage.current = paginated[0];
        } else {
            // must set all states because visiting this route, on first render its first job
            // is to check whether or not still authenticated.
            logOutUser();
        }
    }, [authenticate, logOutUser, setWholeMenu])

    // useEffect(() => {
    //     setLoading(true);
    //     // console.log('initial render fetch whole menu')
    //     const controller = new AbortController();
    //     axios.get(axiosReqLink, { signal: controller.signal })
    //         .then(function (response) {
    //             console.log('being handled whole menu')
    //             handleAxiosGetThen(response);
    //             setLoading(false);
    //         })
    //         .catch(function (error) {
    //             // must be cancelled before receivig a response from backend
    //             if (error instanceof CanceledError) {
    //                 // note: second render will run cleanup function 
    //                 // (clean up from first render before running useEffect again),
    //                 // and hence second render (second request) is aborted and logs this to console
    //                 // cleanup function also run when component unmounted e.g switch from menu to welcome
    //                 console.log('Aborted: no longer waiting on api req to return result')
    //             } else {
    //                 console.log('api error, maybe alert user in future')
    //             }
    //         });
    //     return () => {
    //         /**
    //          * cancels request before component unmounts (unmounts; no longer need result of api fetch.
    //          * no need to run useEffect() anymore, so need to 'cancel' the request before response received
    //          * and .then() taken. else if api sends result, the not needed result leads to 'memory leak'.)
    //          * React throws hissy fit when this happens, so need this cleanup return function.
    //          * cleanup aborts the api request so no results come back and hang there to piss off React.
    //          * needed if user switch too quickly between menu and e.g. welcome; faster than time taken to reach api
    //         */
    //         setLoading(false);
    //         controller.abort();
    //     }
    // },
    //     // empty dep array makes it run only on initial render and never again; wanted because if not empty 
    //     // and without eslint-disable..., any state change (this functional component or in context)
    //     // will trigger this useEffect() to run, which messes with display
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     []);

    // useEffect(() => {
    //     // if leave menu tab while loading custom search filter, next time hit menu tab
    //     // will automatically appy filter because filter only cleared on response
    //     console.log('running custom menu useeffect', sidebarFilterOptions)
    //     const controller = new AbortController();
    //     if (Object.keys(sidebarFilterOptions).length) {
    //         // set to default; must have or breaks if on page 3 and filter returns 2 pages
    //         setPageLessOne(0);
    //         // pageLessOne.current = 0;
    //         // axios str construction
    //         const { mealTypes, budgetPrice } = sidebarFilterOptions
    //         let getReqStr = axiosReqLink;
    //         console.log(mealTypes, budgetPrice)
    //         if (mealTypes && budgetPrice) {
    //             getReqStr += `?price=${budgetPrice}`;
    //             if (mealTypes.length) {
    //                 const mealsStr = mealTypes.join()
    //                 getReqStr += ('&types=' + mealsStr);
    //             }
    //         }
    //         setLoading(true);
    //         axios.get(getReqStr, { signal: controller.signal })
    //             .then(function (response) {
    //                 console.log('being handled custom menu')
    //                 handleAxiosGetThen(response);
    //                 clearFilterOptions();
    //                 setLoading(false);
    //             })
    //             .catch(function (error) {
    //                 // console.log(error) // because Axios becomes CanceledError not AbortError (fetch api)
    //                 if (error instanceof CanceledError) {
    //                     console.log('Aborted: no longer waiting on api req to return result')
    //                 } else {
    //                     console.log('api error, maybe alert user in future')
    //                 }
    //             });
    //     }
    //     // cleanup if need to abort, so no hanging results that piss off React
    //     // if somehow sidebarFilterOptions changes or component unmounts (runs useEffect() again)
    //     // before receiving backend api response, will 'abort' that request to prevent memory leak
    //     // if response not received will not clearFilterOptions() so next time run useEffect()
    //     // no problems aborting (cleanup requires non empty sidebarFilterOptions)
    //     return () => {
    //         if (Object.keys(sidebarFilterOptions).length) {
    //             setLoading(false);
    //             controller.abort();
    //         }
    //     } // sidebarFilterOptions is the most important in dep array, must run every time it changes
    // },
    //     // prevents re renders because state from dashboardContext changes
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [sidebarFilterOptions]);

    useEffect(() => {
        /**
         * really should do this, writes less code but most importantly because 
         * if separate initial and whenever sidebarFilterOptions changes,
         * the two useEffect's both run initially.
         * and the order in which promises resolve (two axios get's) is random.
         * therefore the menu could be set differently.
         * 
         * however, this creates inifinite loop if logging out user and 
         * clearing filter options on logout. but if filter options isn't cleared on logout,
         * it will need to be cleared when user logs in again.
         */
        setLoading(true);
        const controller = new AbortController();
        // set to default; must have or breaks if on page 3 and filter returns 2 pages
        setPageLessOne(0);
        // pageLessOne.current = 0;
        let getReqStr = axiosReqLink;
        if (Object.keys(sidebarFilterOptions).length) {
            // axios str construction
            const { mealTypes, budgetPrice } = sidebarFilterOptions
            console.log(mealTypes, budgetPrice)
            if (mealTypes && budgetPrice) {
                getReqStr += `?price=${budgetPrice}`;
                if (mealTypes.length) {
                    const mealsStr = mealTypes.join()
                    getReqStr += ('&types=' + mealsStr);
                }
            }
        }
        axios.get(getReqStr, { signal: controller.signal })
            .then(function (response) {
                console.log('being handled custom menu')
                handleAxiosGetThen(response);
                // clearing filter options bad idea, because even if prevent infinite loop
                // clearing is changing so this useEffect runs again and grabs whole menu
                // // must have; prevent infinite loop on logout and when server responds with filtered menu
                // if (Object.keys(sidebarFilterOptions).length) {
                //     clearFilterOptions();
                // }
                setLoading(false);
            })
            .catch(function (error) {
                // console.log(error) // because Axios becomes CanceledError not AbortError (fetch api)
                if (error instanceof CanceledError) {
                    // note: second render will run cleanup function 
                    // (clean up from first render before running useEffect again),
                    // and hence second render (second request) is aborted and logs this to console
                    // cleanup function also run when component unmounted e.g switch from menu to welcome
                    console.log('Aborted: no longer waiting on api req to return result')
                } else {
                    console.log('api error, maybe alert user in future')
                }
            });
        return () => {
            /**
             * cancels request before component unmounts (unmounts; no longer need result of api fetch.
             * no need to run useEffect() anymore, so need to 'cancel' the request before response received
             * and .then() taken. else if api sends result, the not needed result leads to 'memory leak'.)
             * React throws hissy fit when this happens, so need this cleanup return function.
             * cleanup aborts the api request so no results come back and hang there to piss off React.
             * needed if user switch too quickly between menu and e.g. welcome; faster than time taken to reach api
            */
            setLoading(false);
            controller.abort();
        }
    },
        // prevents re renders because state from dashboardContext changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sidebarFilterOptions])

    const calcWholeMenu = function () {
        // reduce does not work because pass previous element to next (which is an array, not number)
        // number is needed because Array.prototype.length returns a number
        let sum = 0;
        wholeMenu.forEach((arr, index) => {
            sum += arr.length;
        });
        return sum;
    }

    const handlePaginateButtons = function ({ type, pageNum }) {
        // console.log(currentSessionCookie,document.cookie)
        // document.cookie is not an array because only one cookie for now
        // if array grab using document.cookie['connect.sid']
        if (document.cookie === currentSessionCookie) {
            switch (type) {
                case 'prev':
                    setPageLessOne((pageLessOne) => { return (pageLessOne - 1); });
                    // pageLessOne state kicks in after function runs, so it'll be updated
                    // next time prev/next/goToPage is called
                    // need to use old pageLessOne below
                    setMenuPage(wholeMenu[pageLessOne - 1]);

                    // pageLessOne.current -= 1;
                    // menuPage.current = wholeMenu[pageLessOne.current];
                    break;
                case 'next':
                    setPageLessOne((pageLessOne) => { return (pageLessOne + 1); });
                    setMenuPage(wholeMenu[pageLessOne + 1]);

                    // pageLessOne.current += 1; console.log(pageLessOne);
                    // menuPage.current = wholeMenu[pageLessOne.current]; 
                    // console.log(wholeMenu); console.log(menuPage);
                    break;
                case 'custom':
                    setPageLessOne(pageNum);
                    setMenuPage(wholeMenu[pageNum]);

                    // pageLessOne.current = pageNum; console.log(pageLessOne);
                    // menuPage.current = wholeMenu[pageNum]; console.log(menuPage);
                    break;
                default:
                    throw new Error('no type matched');
            }
        } else {
            logOutUser();
        }
    }

    return (
        <section>
            <SessionOver />
            <Loading />
            {isAuthenticated && !loading && <section>
                {isSidebarOpen && <MenuSidebar />}
                <section>
                    {!isSidebarOpen &&
                        <button className='sidebar-toggle' onClick={() => { toggleSidebar('open') }}>
                            <FaBars />
                        </button>}
                    <h2 className='section-title'>menu items</h2>
                    <h3>{`Total: ${calcWholeMenu()}`}</h3>
                    <div className='menu-center'>
                        {/* do not ever use array index as key */}
                        {menuPage.map((item) => {
                            return (
                                <MenuItem key={item._id} {...item} />
                            );
                        })}
                    </div>
                </section>
                {wholeMenu.length && <div className='btn-container'>
                    {(pageLessOne > 0) &&
                        <button
                            className='prev-btn'
                            onClick={() => { handlePaginateButtons({ type: 'prev', pageNum: null }) }}>
                            prev
                        </button>}
                    {wholeMenu.map((arr, menuIndex) => {
                        // in paginating with 2d array, using array index as key no problem; order no matter
                        return (
                            <button
                                key={arr[0]._id}
                                onClick={() => { handlePaginateButtons({ type: 'custom', pageNum: menuIndex }) }}>
                                {menuIndex + 1}
                            </button>
                        );
                    })}
                    {(pageLessOne < wholeMenu.length - 1) &&
                        <button
                            className='next-btn'
                            onClick={() => { handlePaginateButtons({ type: 'next', pageNum: null }) }}>
                            next
                        </button>}
                </div>}
            </section>}
        </section>
    );
}

export default Menu
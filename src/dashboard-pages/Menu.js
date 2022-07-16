import React, { useState,useEffect, useCallback } from 'react'
import MenuItem from '../components/MenuItem';
import { useDashboardContext } from '../app-context/dashboardContext';
import SessionOver from '../components/SessionOver';
import { FaBars } from 'react-icons/fa';

import axios from 'axios'
import MenuSidebar from './MenuSidebar';
axios.defaults.withCredentials = true; // always send cookie to backend because passport wants

/**
 * if visit /dashboard/menu renders both Dashboard and Menu
 */
const Menu = function() {
    const [pageLessOne,setPageLessOne] = useState(0);
    const [menuPage,setMenuPage] = useState([]);
    const {
        wholeMenu,
        setWholeMenu,
        isAuthenticated,
        currentSessionCookie,
        authenticate,
        unauthenticate,
        isSidebarOpen,
        sidebarFilterOptions,
        toggleSidebar
    } = useDashboardContext();

    const logOutUser = function() {
        unauthenticate();
        setWholeMenu([]);
        setMenuPage([]);
    }

    const bucket = function(arr) {
        const itemsPerBucket = 5;
        const numBuckets = Math.ceil(arr.length/itemsPerBucket);
        const bucketedArr = Array.from({ length:numBuckets }, (_,i) => {
            const indexArr = i * itemsPerBucket;
            return arr.slice(indexArr, indexArr+itemsPerBucket);
        });
        return bucketedArr
    }

    useEffect(() => {
        console.log(isSidebarOpen)
        // on first render i don't care need to fetch the menu anyways
        axios.get('http://localhost:8000/api/v1/browse/menu')
            .then(function (response) {
                // console.log(response.data);
                const { alreadyAuthenticated,user,result } = response.data;
                if (alreadyAuthenticated) {
                    authenticate(user,document.cookie);
                    // checks if already set wholeMenu by another api call from filtering
                    // have button clear filter options, so that every time refresh if not cleared
                    // will apply filter to search
                    if (!sidebarFilterOptions.length) {
                        // stores menu as 2d array
                        const paginated = bucket(result);
                        setWholeMenu(paginated);
                        // use paginated instead of wholeMenu because state update kicks in after useEffect
                        setMenuPage(paginated[pageLessOne]);
                    }
                } else {
                    // must set all states because visiting this route, on first render its first job
                    // is to check whether or not still authenticated.
                    logOutUser();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, 
    // disabling; do not want axios get request every time page state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

    const handlePaginateButtons = function({type,pageNum}) {
        // console.log(currentSessionCookie,document.cookie)
        // if property has . in it use below notation
        if (document.cookie === currentSessionCookie) {
            switch (type) {
                case 'prev':
                    setPageLessOne((pageLessOne) => {return (pageLessOne - 1);});
                    // pageLessOne state kicks in after function runs, so it'll be updated
                    // next time prev/next/goToPage is called
                    // need to use old pageLessOne below
                    setMenuPage(wholeMenu[pageLessOne - 1]);
                    break;
                case 'next':
                    setPageLessOne((pageLessOne) => {return (pageLessOne + 1);});
                    setMenuPage(wholeMenu[pageLessOne + 1]);
                    break;
                case 'custom':
                    setPageLessOne(pageNum);
                    setMenuPage(wholeMenu[pageNum]);
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
            {isSidebarOpen && <MenuSidebar />}
            {isAuthenticated && <section>
                {!isSidebarOpen && 
                <button className='sidebar-toggle' onClick={() => {toggleSidebar('open')}}>
                    <FaBars />
                </button>}
                <h2 className='section-title'>all menu items</h2>
                <h3>{`Total: ${menuPage.length}`}</h3>
                <div className='menu-center'>
                    {/* do not ever use array index as key */}
                    {menuPage.map((item) => {
                        return (
                            <MenuItem key={item._id} {...item} />
                        );
                    })}
                </div>
            </section>}
            {wholeMenu.length && <div className='btn-container'>
                {(pageLessOne > 0) && 
                <button 
                className='prev-btn' 
                onClick={() => {handlePaginateButtons({type:'prev',pageNum:null})}}>
                    prev
                </button>}
                {wholeMenu.map((arr,menuIndex) => {
                    // in paginating with 2d array, using array index as key no problem; order no matter
                    return (
                        <button 
                        key={arr[0]._id} 
                        onClick={() => {handlePaginateButtons({type:'custom',pageNum:menuIndex})}}>
                            {menuIndex+1}
                        </button>
                    );
                })}
                {(pageLessOne < wholeMenu.length - 1) && 
                <button 
                className='next-btn' 
                onClick={() => {handlePaginateButtons({type:'next',pageNum:null})}}>
                    next
                </button>}
            </div>}
        </section>
    );
}

export default Menu
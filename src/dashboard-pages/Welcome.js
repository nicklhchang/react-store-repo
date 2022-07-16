import React, { useCallback,useEffect } from 'react'
import { useDashboardContext } from '../app-context/dashboardContext';
import SessionOver from '../components/SessionOver';

import axios from 'axios'
axios.defaults.withCredentials = true; // always send cookie to backend because passport wants

/**
 * index element for /dashboard, so renders whenever visit /dashboard route
 * therefore checking auth status can be done just in here without repeating
 * in both Dashboard and Welcome
 */
const Welcome = function () {
    const { 
        isAuthenticated,
        authenticate,
        unauthenticate 
    } = useDashboardContext();

    // prevents infinite loop when placing function inside dependency array
    // because useCallback memoizes, function remains same, and hence no change
    const fetchAuthStatus = useCallback(function() {
        // on first render of this route, check if already have active cookie, if so redirect straight to dashboard
        // btw, useEffect does not like async await
        axios.get('http://localhost:8000/api/v1/auth/login-status')
        .then(function(response) {
          console.log(response.data);
          const { alreadyAuthenticated,user } = response.data;
          if (alreadyAuthenticated) {
            authenticate(user,document.cookie);
          } else {
            // set to default because unlike useState, re-renders do not reset dashboardContext states
            unauthenticate();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      }, []);

    useEffect(() => {
    //   console.log('render welcome')
      fetchAuthStatus();
    }, [fetchAuthStatus]);

    return (
        <section>
            <SessionOver />
            {isAuthenticated &&
                <p>fill this with info on how to use the website</p>}
        </section>
    );
}

export default Welcome
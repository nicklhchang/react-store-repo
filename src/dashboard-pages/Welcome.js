import React, { useCallback, useEffect } from 'react'
import { useDashboardContext } from '../app-context/dashboardContext';
import SessionOver from '../components/SessionOver';

import axios, { CanceledError } from 'axios';
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
  const fetchAuthStatusWelcome = useCallback(function () {
    // on first render of this route, check if already have active cookie, if so redirect straight to dashboard
    // btw, useEffect does not like async await
    const controller = new AbortController();
    axios.get('http://localhost:8000/api/v1/auth/login-status', { signal: controller.signal })
      .then(function (response) {
        // console.log(response.data);
        const { alreadyAuthenticated, user } = response.data;
        if (alreadyAuthenticated) {
          authenticate(user, document.cookie);
        } else {
          // set to default because unlike useState, re-renders do not reset dashboardContext states
          unauthenticate();
        }
      })
      .catch(function (error) {
        if (error instanceof CanceledError) {
            console.log('Aborted: no longer waiting on api req to return result')
        } else {
            console.log('api error, maybe alert user in future')
        }
      });
      return () => {controller.abort();}
    // before placing in dependency array useCallback to memoize and prevent infinite loop
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  useEffect(() => {
    //   console.log('render welcome')
    fetchAuthStatusWelcome();
  }, [fetchAuthStatusWelcome]);

  return (
    <section>
      <SessionOver />
      {isAuthenticated &&
        <div>
          <p>fill this with info on how to use the website</p>
          <p>after applying search filter, if refresh or leave then go back to menu will not apply filter again</p>
        </div>}
    </section>
  );
}

export default Welcome
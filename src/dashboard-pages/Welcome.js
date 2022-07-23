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
    setItemPrices,
    setLoading,
    isAuthenticated,
    authenticate,
    unauthenticate
  } = useDashboardContext();

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    axios.get('http://localhost:8000/api/v1/browse/cart/prices', { signal: controller.signal })
      .then(function (response) {
        console.log(response.data)
        const { alreadyAuthenticated, user, result } = response.data;
        if (alreadyAuthenticated) {
          authenticate(user, document.cookie)
          let prices = {};
          result.forEach(id_cost => {
            prices[id_cost._id] = id_cost.cost;
          });
          // console.log(prices)
          setItemPrices(prices);
          setLoading(false);
        } else {
          unauthenticate();
          // display session over
          setLoading(false);
        }
      })
      .catch(function (error) {
        if (error instanceof CanceledError) {
          console.log('Aborted: no longer waiting on api req to return result')
        } else {
          // second render runs this
          console.log('api error, maybe alert user in future')
        }
      });
    return () => { controller.abort(); }
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [])

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
import React, { useState, useEffect } from 'react'
import { useDashboardContext } from '../app-context/dashboardContext';
import SessionOver from '../components/SessionOver';
import CartItem from '../components/CartItem';

import axios, { CanceledError } from 'axios';
axios.defaults.withCredentials = true;

const Cart = function () {
  const {
    setLoading,
    itemPrices,
    setItemPrices,
    isAuthenticated,
    authenticate,
    unauthenticate,
    populateCartInitial,
    localCart
  } = useDashboardContext();
  // need re renders whenever state change
  // const iterableCart = useRef(Object.keys(localCart));
  // iterableCart.current = Object.keys(localCart);

  useEffect(() => {
    // need to grab cart and prices in case user decides to refresh /dashboard/cart route
    console.log('item prices', itemPrices)
    setLoading(true);
    const controller = new AbortController();
    axios.get('http://localhost:8000/api/v1/browse/cart', { signal: controller.signal })
      .then(function (response) {
        console.log(response.data)
        const { alreadyAuthenticated, user, result } = response.data;
        if (alreadyAuthenticated) {
          authenticate(user, document.cookie)
          populateCartInitial(result.cart.items)
          let prices = {};
          result.prices.forEach(id_cost => {
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
      {isAuthenticated && <section>
        {!Object.keys(localCart).length && <section>
          <p>Please go to menu and start addding to cart. Your changes will kick in after at most 15 seconds</p>
        </section>}
        {Object.keys(localCart).length &&
          <section className='cart'>
            <div>
              {Object.entries(localCart).map((id_count, index) => {
                let prop = {
                  id: id_count[0],
                  count: id_count[1],
                  cost: itemPrices[id_count[0]]
                };
                return <CartItem key={id_count[0]} {...prop} />;
              })}
            </div>
          </section>}</section>}
    </section>
  );
}

export default Cart
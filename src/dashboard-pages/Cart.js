import React, { useState,useEffect } from 'react'
import { useDashboardContext } from '../app-context/dashboardContext';
import SessionOver from '../components/SessionOver';

import axios, { CanceledError } from 'axios';
axios.defaults.withCredentials = true;

const Cart = function() {
    const {
        isAuthenticated,
        authenticate,
        unauthenticate,
        populateCartInitial,
    } = useDashboardContext();

    useEffect(() => {
        const controller = new AbortController();
        axios.get('http://localhost:8000/api/v1/browse/cart', { signal: controller.signal })
        .then(function(response) {
            console.log(response.data)
            const { alreadyAuthenticated,user,result } = response.data;
            if (alreadyAuthenticated) {
                authenticate(user, document.cookie)
                populateCartInitial(result.items)
            } else {
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
    }, [])

    return (
        <section>
            <SessionOver />
            {isAuthenticated && <section></section>}
        </section>
    );
}

export default Cart
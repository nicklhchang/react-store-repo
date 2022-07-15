import React, { useEffect } from 'react'
import { useDashboardContext } from '../dashboardContext';
import SessionOver from '../components/SessionOver';

/**
 * index element for /dashboard, so renders whenever visit /dashboard route
 * therefore checking auth status can be done just in here without repeating
 * in both Dashboard and Welcome
 */
const Welcome = function () {
    const { isAuthenticated,fetchAuthStatus } = useDashboardContext();

    useEffect(() => {
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
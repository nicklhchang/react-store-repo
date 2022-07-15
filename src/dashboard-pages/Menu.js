import React, { useEffect } from 'react'
import MenuItem from '../components/MenuItem';
import { useDashboardContext } from '../dashboardContext';
import SessionOver from '../components/SessionOver';
import axios from 'axios'
axios.defaults.withCredentials = true; // always send cookie to backend because passport wants

/**
 * if visit /dashboard/menu renders both Dashboard and Menu
 */
const Menu = function () {
    const {
        isAuthenticated,
        menu,
        setIsAuthenticated,
        setMenu,
        setCurrentUser
    } = useDashboardContext();

    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/browse/menu')
            .then(function (response) {
                console.log(response.data);
                const { alreadyAuthenticated, user, result } = response.data;
                if (alreadyAuthenticated) {
                    setIsAuthenticated(true);
                    setCurrentUser(user);
                    setMenu(result);
                } else {
                    // must set all three states because visiting this route, on first render its first job
                    // is to check whether or not still authenticated.
                    setIsAuthenticated(false);
                    setCurrentUser(null);
                    setMenu([]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <section>
            <SessionOver />
            {isAuthenticated && <section>
                <h2 className='section-title'>all menu items</h2>
                <div className='menu-center'>
                    {/* do not ever use array index as key */}
                    {menu.map((item) => {
                        return (
                            <MenuItem key={item._id} {...item} />
                        );
                    })}
                </div>
            </section>}
        </section>
    );
    // }
}

export default Menu
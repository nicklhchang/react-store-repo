import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AuthNavbar = function() {
    return (
        <div>
            <h3 className='section'>base for logging in and registering</h3>
            <Link to='/auth/login' className='section-center'>go to login</Link>
            <Link to='/auth/register' className='section-center'>go register</Link>
            <Outlet />
        </div>
    );
}

export default AuthNavbar;
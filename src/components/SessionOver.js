import React, { } from 'react'
import { Link } from 'react-router-dom'
import { useDashboardContext } from '../dashboardContext';

const SessionOver = function() {
    const { isAuthenticated } = useDashboardContext();
    if (!isAuthenticated) {
        // break out early if not/no longer authenticated 
        // very cheap workaround with the navbar expand right now
        return (
            <main>
                <h3>Session over, please login again</h3>
                <Link to='/auth/login' className='submit-btn'>go to login</Link>
            </main>
        );
    }
}

export default SessionOver
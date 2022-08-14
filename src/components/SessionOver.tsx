import React, { } from 'react'
import { Link } from 'react-router-dom'
import { useDashboardContext } from '../app-context/dashboardContext';

const SessionOver = function () {
    const {
        isAuthenticated,
        loading
    } = useDashboardContext();

    // Typescript complains if return inside conditional, so move conditional
    // at least returns something
    // if (!isAuthenticated && !loading) {
        // break out early if not/no longer authenticated 
        return (
            <main>
                {!isAuthenticated && !loading && <div>
                    <h3>Session over, please authenticate again</h3>
                    <Link to='/auth' className='submit-btn'>go authenticate</Link>
                </div>}
            </main>
        );
    // }
}

export default SessionOver
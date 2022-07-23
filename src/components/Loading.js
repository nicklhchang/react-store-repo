import React, { } from 'react'
import { useDashboardContext } from '../app-context/dashboardContext';

const Loading = function() {
    const { isAuthenticated,loading } = useDashboardContext();
    if (isAuthenticated && loading) {
        // break out early if not/no longer authenticated 
        // very cheap workaround with the navbar expand right now
        return (
            <main>
                <h3>Loading...</h3>
            </main>
        );
    }
}

export default Loading
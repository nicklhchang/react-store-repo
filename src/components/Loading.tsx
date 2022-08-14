import React, { } from 'react'
import { useDashboardContext } from '../app-context/dashboardContext';

const Loading = function () {
    const { loading } = useDashboardContext();
    // Typescript does not like conditional outside, has to render something
    // if (loading) {
        return (
            <main>
                {!!loading && <div>
                    <h3>Loading...</h3>
                </div>}
            </main>
        );
    // }
}

export default Loading
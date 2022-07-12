import React from 'react';
import { Link } from 'react-router-dom';

const SessionOver = function() {
    return (
        <main>
            <h3>Session over, please login again</h3>
            <Link to='/auth/login'>go to login</Link>
        </main>
    );
}

export default SessionOver;
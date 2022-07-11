import React from 'react';
import { Link } from 'react-router-dom';

const App = function() {
    return (
        <main>
            <h3>Home for now</h3>
            <Link to='/login'>go to login</Link>
        </main>
    );
}

export default App;
import React, { useEffect } from 'react';
import { Outlet,useNavigate } from 'react-router-dom'; // use to display different pages within dashboard
import axios from 'axios';
// import { useLoginContext } from '../loginContext';
axios.defaults.withCredentials = true; // always send cookie to backend because passport wants

/**
 * problem is that location.state does not persist changes between page refreshes, the logic without else delete
 * assumes that location.state persist changes and hence can make more efficient checks with backend
 * but change not persisting means this logic is broken, and must add else delete on top of inefficient checks.
 * no persistence of changes maybe because location.state passed like props to Dashboard
 * 
 * workaround is not pass state like justAuthenticated, and just make backend request every time
 * this route/page is visited, regardless of if you just came from login/register page or not.
 * because in prod useEffect() no longer runs twice, so changing props (state passed) for second render
 * will not hold up. interesting note is that useState values do not change between useEffect renders,
 * but changes to props will reflect in second render for useEffect()
 */

const Dashboard = function() {
    let navigate = useNavigate();

    useEffect(() => {
      // on first render of this route, check if already have active cookie, if not session-over
      // btw, useEffect does not like async await
      axios.get('http://localhost:8000/api/v1/auth/login-status')
        .then(function(response) {
          console.log(response.data);
          if (!response.data.alreadyAuthenticated) {
            // navigate back to login but show user session over first
            navigate('/session-over');
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      }, []);

    return (
        <main>
            <h3>Dashboard for now</h3>
            <div>
              <section>basic menu</section>
              <section>search by category</section>
              <section>search by price</section>
              <section>bestsellers</section>
            </div>
            <Outlet />
        </main>
    );
}

export default Dashboard;
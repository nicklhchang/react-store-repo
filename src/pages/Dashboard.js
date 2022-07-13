import React, { useState,useEffect } from 'react';
import { Outlet,useLocation,useNavigate,useParams,Link } from 'react-router-dom'; // use to display different pages within dashboard
import axios from 'axios';
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
 * 
 * the design of dashboard route is that only authenticated users can even load the page
 * 
 * just an idea, but maybe on first render get basic menu, but basic menu backend route has to
 * check isAuth middleware first. whether or not pass this middleware send back json with a property of
 * alreadyAuthenticated (true or false)
 */

const Dashboard = function() {
  // const { memberid } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  const [currentMenu, setCurrentMenu] = useState([]); // use .map() to render component

  // useEffect(() => {
  //   // on first render of this route, check if already have active cookie, if not session-over
  //   // btw, useEffect does not like async await
  //   axios.get('http://localhost:8000/api/v1/auth/login-status')
  //     .then(function(response) {
  //       console.log(response.data);
  //       if (response.data.alreadyAuthenticated) {
  //         setIsAuthenticated(true);
  //         setCurrentUser(response.data.user);
  //       } else {
  //         setIsAuthenticated(false); 
  //         // prevent bugs at return JSX, because isAuthenticated persists between renders
  //         // so if set to true but never set back to false anywhere, never renders session over message
  //         // EDIT:this was only the case when useContext, no longer an issue
  //         setCurrentUser(null);
  //         // set back to null or currentUser becomes like lastUser
          // EDIT:only a problem with useContext() no longer problem now, re-renders set to null from useState() ^
  //       }
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  //   }, []);

  useEffect(() => {
    // on first render of this route, check if already have active cookie, if not session-over
    // btw, useEffect does not like async await
    axios.get('http://localhost:8000/api/v1/browse/menu')
      .then(function(response) {
        console.log(response.data);
        const { alreadyAuthenticated,user,result } = response.data;
        if (alreadyAuthenticated) {
          setIsAuthenticated(true);
          setCurrentUser(user);
        } else {
          setIsAuthenticated(false); 
          // prevent bugs at return JSX, because isAuthenticated persists between renders
          // so if set to true but never set back to false anywhere, never renders session over message
          // EDIT:this was only the case when useContext, no longer an issue
          setCurrentUser(null);
          // set back to null or currentUser becomes like lastUser
          // EDIT:only a problem with useContext() no longer problem now, re-renders set to null from useState() ^
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    }, []);
    
    if (!isAuthenticated) {
      // break out early if not/no longer authenticated
      return (
        <main>
            <h3>Session over, please login again</h3>
            <Link to='/auth/login'>go to login</Link>
        </main>
      );
    } else {
      return (
          <main>
              <h3>Dashboard for now</h3>
              {/* ? means if property exists (won't exist if currentUser null), but then again if currentUser
              was null, isAuthenticated is always false so would never run this else condition anyways */}
              <h4>{`current user: ${currentUser?._id}`}</h4>
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
}

export default Dashboard;
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../dashboard-pages/Menu';
import { useDashboardContext } from '../dashboardContext';
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
 * the design of dashboard route is that only authenticated users don't get shown session over
 * 
 * just an idea, but maybe on first render get basic menu, but basic menu backend route has to
 * check isAuth middleware first. whether or not pass this middleware send back json with a property of
 * alreadyAuthenticated (true or false)
 * 
 * if want to use searching functionality can search=useRef('') as ref={search} in component then, 
 * setSearch(search.current.value)
 */

const Dashboard = function () {
  // const { memberid } = useParams();
  const { currentUser } = useDashboardContext();

  // for expanding and closing navbar
  const [showLinks, setShowLinks] = useState(false);
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  useEffect(() => {
    // annoying little bug is that you must use linksContainerRef and linksRef
    // in both of the if and else conditions below, because React won't pick it up
    // if ref is conditionally rendered
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (showLinks) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = '0px';
    }
  }, [showLinks]);

  // if (!isAuthenticated) {
  //   // break out early if not/no longer authenticated
  //   // very cheap workaround with the navbar expand right now
  //   return (
  //     <main>
  //       <div ref={linksContainerRef}></div>
  //       <div ref={linksRef}></div>
  //       <h3>Session over, please login again</h3>
  //       <Link to='/auth/login'>go to login</Link>
  //     </main>
  //   );
  // } else {
    return (
      <section>
        <nav>
          <section className='nav-center'>
            <div className='nav-header'>
              {/* <h3>Dashboard for now</h3> */}
              {/* ${currentUser?._id} */}
              <h4>{`Dashboard for: ${currentUser ? currentUser._id : 'unauthenticated'}`}</h4>
              <button className='nav-toggle' onClick={() => {
                setShowLinks(
                  (showLinks) => { return !showLinks; }
                )
              }}>
                Expand
              </button>
            </div>
            <div className='links-dashboard-container' ref={linksContainerRef}>
              <section className='links' ref={linksRef}>
                {/* Welcome checks whether auth or not upon visiting /dashboard; index element (App.js) */}
                <Link to='/dashboard'>welcome</Link>
                <Link to='/dashboard/menu'>menu</Link>
                {/* <Menu menuItems={currentMenu}/> */}
                {/* <section>
                  <h2 className='section-title'>all menu items</h2>
                  <div className='menu-item-center'>
                    {currentMenu.map((item) => {
                      return (
                        <Item key={item._id} {...item}/>
                      );
                    })}
                  </div>
                </section> */}
                <Link to='/dashboard/cart'>cart</Link>
              </section>
            </div>
          </section>
        </nav>
        <Outlet />
      </section>
    );
  // }
}

export default Dashboard;
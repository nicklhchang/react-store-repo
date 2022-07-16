import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import Menu from '../dashboard-pages/Menu';
import { useDashboardContext } from '../app-context/dashboardContext';
import { FaBars } from 'react-icons/fa'
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
  // note that ref={} in JSX CANNOT be conditionally rendered
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  useEffect(() => {
    console.log('renders dashboard')
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (showLinks) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = '0px';
    }
  }, [showLinks]);
  
  return (
    <section>
      <nav>
        <section className='nav-center'>
          <div className='nav-header'>
            <h4>{`Dashboard for: ${currentUser ? currentUser._id : 'unauthenticated'}`}</h4>
            <button className='nav-toggle' onClick={() => {
              setShowLinks(
                (showLinks) => { return !showLinks; }
              )
            }}>
              <FaBars />
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
}

export default Dashboard;
import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AuthNavbar from './auth-pages/AuthNavbar';
import Register from './auth-pages/Register';
import Login from './auth-pages/Login';

/** 
 * lazy loading implements code splitting so that the large bundle file
 * that loads and serves all application code is split into chunks.
 * prevents bundle file from getting too large.
 * 
 * tells React to only load components dynamically; only load particular component
 * if requested rather than whole bundle file.
 * 
 * AuthNavbar component uses <Outlet /> and if some components depend on it to load
 * using lazy loading is finnicky; doesn't work.
 * 
 * need React.Suspense below to display something while React waits to render lazy component.
*/
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

function App() {

  return (
    <Router>
      <React.Suspense fallback={<div>Loading ...</div>}>
        <Routes>
          <Route exact path='/' element={<Home />}/>
            {/* <Route path='dashboard/:memberid' element={<Dashboard />}/> */}
            <Route path='dashboard' element={<Dashboard />}/>
          {/* this syntax of routes after / works without <Outlet /> (does not show Home at dashboard etc.) */}
          <Route path='/auth/' element={<AuthNavbar />}>
            <Route path='register' element={<Register />}/>
            <Route path='login' element={<Login />}/>
          </Route> {/* this syntax <Route></Route> only works if use <Outlet /> in AuthNavbar */}
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;

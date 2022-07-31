import React, {  } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AuthIndex from './auth-pages/AuthIndex';
import Register from './auth-pages/Register';
import Login from './auth-pages/Login';

import Welcome from './dashboard-pages/Welcome';
import Menu from './dashboard-pages/Menu';
import Cart from './dashboard-pages/Cart';

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
const AuthNavbar = React.lazy(() => import('./auth-pages/AuthNavbar'));
const Error = React.lazy(() => import('./pages/Error'));

function App() {
  return (
    <Router>
      <React.Suspense fallback={<div>Loading ...</div>}>
        <Routes>
          <Route path='/' element={<Home />}/>
            <Route path='auth/' element={<AuthNavbar />}>
              <Route index element={<AuthIndex />}/>
              <Route path='register' element={<Register />}/>
              <Route path='login' element={<Login />}/>
            </Route> {/* this syntax <Route></Route> only works if use <Outlet /> in AuthNavbar */}
            {/* <Route path='dashboard/:memberid' element={<Dashboard />}/> */}
            <Route path='dashboard/' element={<Dashboard />}>
              <Route index element={<Welcome />}/>
              <Route path='menu' key='menu' element={<Menu key='menu' />}/>
              <Route path='cart' element={<Cart />}/>
            </Route>
          <Route path='*' element={<Error />}/>
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;

import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './pages/Home';
import AuthNavbar from './auth-pages/AuthNavbar';
import Register from './auth-pages/Register';
import Login from './auth-pages/Login';
import Dashboard from './pages/Dashboard';
import SessionOver from './pages/SessionOver';

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home />}/>
          <Route path='dashboard' element={<Dashboard />}/>
          <Route path='session-over' element={<SessionOver />}/>
        {/* this syntax of routes after / works without <Outlet /> (does not show Home at dashboard etc.) */}
        <Route path='/auth/' element={<AuthNavbar />}>
          <Route path='register' element={<Register />}/>
          <Route path='login' element={<Login />}/>
        </Route> {/* this syntax <Route></Route> only works if use <Outlet /> in AuthNavbar */}
      </Routes>
    </Router>
  );
}

export default App;

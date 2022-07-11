import React, { useState,useContext,useEffect } from 'react';
import axios from 'axios';
// import { useLoginContext } from '../loginContext';
// this does not achieve anything when logging in/registering; no credentials
// but will be needed when making get requests for dashboard; unique to each user
// EDIT:this is in fact needed to set cookie in browser
axios.defaults.withCredentials = true; // always send cookie to backend because passport wants

const Login = function() {
  /*
  story time: if the updating of state happens in useEffect or functions, the state's
  new value only kicks in after the function/useEffect runs. seems to be finnicky thing
  with react, so be careful about setting state and then immediately using that state as 
  a conditional inside useEffect and functions.

  one way to get around late state update is to not use state, just check response.data....
  */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
//   const { isAuthenticated,setIsAuthenticated } = useLoginContext();
  
//   const [temp, setTemp] = useState(false);

  useEffect(() => {
    // on first render of this route, check if already have active cookie
    // btw, useEffect does not like async await
    axios.get('http://localhost:8000/api/v1/auth/loginStatus')
      .then(function(response) {
        console.log(response.data);
        // isAuthenticated only seems to kick in after useEffect runs
        // setIsAuthenticated(response.data.alreadyAuthenticated);
        // console.log(`get:${isAuthenticated}`)
        if (response.data.alreadyAuthenticated) {
          // navigating
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

//   useEffect(() => {
//     let test = setTimeout(() => {
//         setTemp(!temp);
//         console.log(isAuthenticated);
//     },500);
//     return () => {clearTimeout(test);}
//   },[temp]);

  const submitLoginCredentials = async function(event) {
    event.preventDefault();
    /* https://stackoverflow.com/questions/42803394/cors-credentials-mode-is-include
    https://stackoverflow.com/questions/68793536/why-cant-i-use-a-wildcard-on-access-control-allow-headers-when-allow-credenti
    lowkey going you are trying to authenticate (to some private api), so we won't allow backend access from all (*) origins. 
    browser knows you are trying to authenticate because you set withCredentials to true.
    also need to set "credentials":true in backend code cors({}). so after pre-flight requests, 
    more requests can be made with credentials*/
    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/login', {
        username:username,
        password:password
      });
      console.log(response.data);
      // use res.json loginSuccess property as a conditional to navigate
      // isAuthenticated only seems to kick in after this function runs
      // setIsAuthenticated(response.data.loginSuccess);
      // console.log(`post:${isAuthenticated}`)
      if (response.data.loginSuccess) {
        // navigating
      }
    } catch (error) {
      console.log(error);
    }
    setUsername('');
    setPassword('');
  }

  return (
    <section className='section-center'>
      <form className='login-form' onSubmit={submitLoginCredentials}>
        <h3>login form</h3>
        <div className='form-control'>
          <input
            type='text'
            className='login'
            placeholder='username'
            value={username}
            onChange={(event) => {setUsername(event.target.value);}}
          />
        </div>
        <br/>
        <div className='form-control'>
          <input
            type='text'
            className='login'
            placeholder='password'
            value={password}
            onChange={(event) => {setPassword(event.target.value);}}
          />
        </div>
        <br/>
        <button type='submit' className='submit-btn'>
          login
        </button>
      </form>
    </section>
  );
}

export default Login;

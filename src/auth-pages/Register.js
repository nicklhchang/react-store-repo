import React, { useState,useContext,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// needed to set cookie in browser, then in dashboard needed to send cookie with axios requests
axios.defaults.withCredentials = true; // always send cookie to backend because passport wants

const Login = function() {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const submitRegisterCredentials = async function(event) {
    event.preventDefault();
    // https://stackoverflow.com/questions/42803394/cors-credentials-mode-is-include
    // https://stackoverflow.com/questions/68793536/why-cant-i-use-a-wildcard-on-access-control-allow-headers-when-allow-credenti
    // lowkey going you are trying to authenticate to private api, so we won't allow access from all (*) origins. 
    // browser knows you are trying to authenticate because you set withCredentials to true.
    // also need to set "credentials":true in backend code cors({}). so allows requests after pre-flight requests
    // to be made with credentials
    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/register', {
        username:username,
        email:email,
        password:password
      });
      console.log(response);
      if (response.data.newlyRegisteredMember) {
        navigate('/dashboard', {
          state:{
            justAuthenticated:true
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
    setUsername('');
    setEmail('');
    setPassword('');
  }

  return (
    <section className='section-center'>
      <form className='login-form' onSubmit={submitRegisterCredentials}>
        <h3>register form</h3>
        <h4>*please do not re-use another one of your passwords for this</h4>
        {/* note to users about password > 8 unique username email etc. */}
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
            placeholder='email'
            value={email}
            onChange={(event) => {setEmail(event.target.value);}}
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
          register
        </button>
      </form>
    </section>
  );
}

export default Login;

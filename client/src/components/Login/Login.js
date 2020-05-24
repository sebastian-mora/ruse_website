import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';

import { connect } from 'react-redux';
import {loginUser, loginFailed} from '../../redux/actions/authActions'

import axios from 'axios';

const Login = ({dispatch}) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const history = useHistory();

  function validateForm() {
    if (username.length > 0 && password.length > 0){
      setValid(true);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if(valid){
      login()
    }
  }

  function login (){
    axios.post('/login', {
      username,
      password
    })
    .then(function (response) {
      if(response.data.status){ 
        const user =  {
          jwt: response.data.accessToken,
          username: response.data.username,
          login_time: response.data.login_time
        }
        history.push('/')
        dispatch(loginUser(user))

      }
      
    })
    .catch(function (error) {
      console.log(error);
      dispatch(loginFailed())
    });
  }

  return (

    <div className="Login">
      <form onSubmit={handleSubmit} onChange={validateForm}>
        <input type="username" value={username} onChange={e => setUsername(e.target.value)}></input>
        <input type="pasword" value={password} onChange={e => setPassword(e.target.value)}></input>
        <input type="submit" value="Submit" />
      </form>
    </div>

  )
}


export default connect()(Login);

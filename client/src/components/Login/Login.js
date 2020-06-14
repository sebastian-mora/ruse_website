import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';

import { connect, useSelector } from 'react-redux';
import {loginUser} from '../../redux/actions/authActions'

const Login = ({dispatch}) => {
  const isAuthd = useSelector(state => state.user.isAuthd)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function validateForm() {
    if (username.length > 0 && password.length > 0){
      return true
    }
  }

  function redirectToAdmin(){
    history.push('/admin')
  }

  function handleSubmit(event) {
    event.preventDefault();
    if(validateForm()){  
      dispatch(loginUser(username, password))
      redirectToAdmin()
    }
  }

  //Check if user is already logged in 

  if(isAuthd){
    redirectToAdmin()
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit} onChange={validateForm}>
        <input type="username" value={username} onChange={e => setUsername(e.target.value)}></input>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}></input>
        <input type="submit" value="Submit" />
      </form>
    </div>

  )
}


export default connect()(Login);

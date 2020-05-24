import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';

import { connect } from 'react-redux';
import {loginUser} from '../../redux/actions/authActions'

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
      dispatch(loginUser(username, password))
      history.push('/admin')
    }
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

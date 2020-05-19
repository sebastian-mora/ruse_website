import React, {useState}from 'react';


import axios from 'axios';

const Login = ({check}) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);

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
        const token =  response.data.accessToken
        sessionStorage.setItem("jwt", token)
      }
      else{
        console.log("NO");
      }
      
    })
    .catch(function (error) {
      console.log(error);
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

export default Login;

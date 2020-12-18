import React from 'react';
import style from './EditUser.module.css'
import {addUser} from '../../../../api/adminApi'

class AddUser extends React.Component {

  constructor(props){
    super(props)

    this.state = {

        "username":"",
        "email":"",
        "password": "",
        "pass_confirm":""
      
    }


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) { this.setState({[e.target.name]: e.target.value });  }

  handleSubmit(e) {
    e.preventDefault();

    if(this.state.password !== this.state.pass_confirm){
      alert("Passwords do not match")
    }
    else if(!this.state.password){alert("Enter a password")}

    else{
      addUser(this.state).then(() =>{alert("User Created")})
      .catch((err)=> console.log(err))
    }
  }

  render() {
    return (
      <div className={style.container}>
        
      <form onSubmit={this.handleSubmit}>
        <label>Username</label>
        <input type="text" name="username" onChange={this.handleChange}/>

        <label>Email</label>
        <input type="text" name="email" onChange={this.handleChange}/>

        <label>Password</label>
        <input type="password" name="password" onChange={this.handleChange}/>

        <label>Confirm Password</label>
        <input type="password" name="pass_confirm" onChange={this.handleChange}/>

        <button type="submit">Add</button>
      </form>
    </div>


    )
  } 
  
  
}

export default AddUser;
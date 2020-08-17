import React from 'react';
import style from './EditUser.module.css'
import {resetPassword} from '../../../../api/adminApi'

class EditUser extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      "password": "",
      "pass_confirm": ""
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
      resetPassword(this.props.user.userid, this.state.password).then(() =>{alert("Password changed")})
      .catch((err)=> console.log(err))
    }
    
  }

  render() {
    return (
      <div className={style.container}>

        {Object.keys(this.props.user).map((key) => {
          return (
            <div>
              <label className={style.attribute}>{key}: </label>
              {this.props.user[key]}
            </div>
          )
        })}


      <form onSubmit={this.handleSubmit}>
        <label>Change Password</label>
        <input type="password" name="password" onChange={this.handleChange}/>
        <label>Confirm Password</label>
        <input type="password" name="pass_confirm" onChange={this.handleChange}/>
        <button type="submit">Change</button>
      </form>

    </div>


    )
  } 
  
  
}

export default EditUser;
import React from 'react';
import style from './EditUser.module.css'

class EditUser extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      "pass": "",
      "pass_confirm": ""
    }


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) { this.setState({[e.target]: e.target.value });  }

  handleSubmit(e) {
    e.preventDefault();

    if(this.state.pass !== this.state.pass_confirm){
      alert("Passwords do not match")
    }
    else if(!this.state.pass){alert("Enter a password")}

    else{
      

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
        <input type="password" name="pass"/>
        <label>Confirm Password</label>
        <input type="password" name="pass_confirm"/>
        <button type="submit">Change</button>
      </form>

    </div>


    )
  } 
  
  
}

export default EditUser;
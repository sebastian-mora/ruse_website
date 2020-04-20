import React, { Component } from 'react';
import axios from 'axios';

import Dropdown from './sub/Dropdown'
import BlogEditor from './sub/BlogEditor';

class Admin extends Component {

  state = {
    blogs: [],
    postid: '1',
    currentBlog: {
      title:"",
      date: "",
      post: "",
      published: false
    },
    displayEditor: false
  }
  
  updateSelectedBlog = this.updateSelectedBlog.bind(this);
  getCurrentBlog = this.getCurrentBlog.bind(this);
  editorSave = this.editorSave.bind(this);
  onNewPress = this.onNewPress.bind(this);
  onClosePress = this.onClosePress.bind(this);

  

  // Get all the blogs on load
  componentDidMount() {
    axios
      .get("/blog")
      .then(result => this.setState({blogs: result.data}) )
      .catch(err => {
        console.log(err);
        return null
      });
      this.getCurrentBlog()
  }


  //get the data for the selected blog
  getCurrentBlog(){
    axios
    .get(`/blog/${this.state.postid}`)
    .then(result =>{
      this.setState({currentBlog: result.data})
    })
    .catch(err => {
      console.log(err);
      return null
    })    
  }

  // Send new blog post to api
  postCurrentBlog(){
    // console.log(this.state.currentBlog);
    axios.post(`/blog`, {
      blog: this.state.currentBlog
    })
    .then(function (response) {
      // console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // Get value from drop down and get new blog post 
  updateSelectedBlog(value){
     this.setState({postid: value}, async () =>{
      //update with the newest blog post
      await this.getCurrentBlog()

      //set editor to show
      this.setState({displayEditor:true})         
    });
  }

  // When the save button is pressed in the BlogEditor send the data to the API
  editorSave(blog_update){
    this.setState({currentBlog: blog_update}, () => {
        this.postCurrentBlog()
        this.setState({displayEditor:false})
      })
  }

  //WHen the new button is pressed 
  onNewPress(){
    this.setState({displayEditor: true})
    this.setState({currentBlog: {
      title: "",
      date: "",
      post: ""
    }})
  }

  // When the close button is pressed
  onClosePress(){
    this.setState({displayEditor:false})
  }



  render() {

    let {displayEditor} = this.state;

    // Conditionally render the editor box
    const renderEditor = () =>{
      if (displayEditor){
        let {currentBlog} = this.state;
      
        return (
          <div>
            <BlogEditor blog={currentBlog} editorSave={this.editorSave} />
          </div>
        );
      }
    }

    const renderButtons = () =>{
      if (displayEditor){
        return <button onClick={this.onClosePress}>Close</button>
      }
      else{
        return <button onClick={this.onNewPress}>New</button>
      }
    }

    return (
      <div>
        <label>Edit exsiting post</label>
        <Dropdown blogs={this.state.blogs} updateBlog={this.updateSelectedBlog}/>
        {renderButtons()}
        {renderEditor()}
        
      </div>
    );
  }
}

export default Admin;
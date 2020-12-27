import React, { Component } from 'react';


import BlogEditor from './sub/BlogEditor/BlogEditor';
import BlogManager from './sub/BlogManager';
import style from './Admin.module.css'

import { connect } from 'react-redux';
import {loadBlogs, loadCategories} from '../../redux/actions/blogActions'
import {closeEditorBlog, openNewBlog, selectBlog} from '../../redux/actions/editorActions'

import Users from './sub/Users';


class Admin extends Component {

  state = {
    manageUsers: false,
    manageBlogs: false
  }
  
  // Get all the blogs on load
  componentDidMount() {
    if(this.props.user.isAuthd){
      this.props.dispatch(loadBlogs())
      this.props.dispatch(loadCategories())
    }
  }

  render() {

    const onCloseClick = () =>{this.props.dispatch(closeEditorBlog())}
    const onNewClick = () =>{this.props.dispatch(openNewBlog())}
    const onManageUsersClick = () => {
      this.setState({manageUsers:!this.state.manageUsers})
      this.setState({manageBlogs:false})
    }
    const onManageBlogsClick = () => {
      this.setState({manageBlogs:!this.state.manageBlogs})
      this.setState({manageUsers:false})
    }
    const onEditBlog = (e) => {
      this.props.dispatch(selectBlog(e.target.value))
      this.setState({manageBlogs:false})
      this.setState({manageUsers:false})
    }


    return (
        <div className={style.container}>

          <button onClick={onManageBlogsClick}>Manage Blogs</button>
          {this.state.manageBlogs &&
            <>
            <BlogManager onClick={onEditBlog}></BlogManager>
            </>
          }
          
          {this.props.editorShow &&
            <div>
              <BlogEditor/>
              <button onClick={onCloseClick}>Close</button>
            </div>
          }

          {!this.props.editorShow &&
             <button onClick={onNewClick}>New</button>
          }

          <button onClick={onManageUsersClick}>Manage Users</button>
          {this.state.manageUsers &&
            <>
            <Users></Users>
            </>
          }
          
          
        </div>
    ) 
  }
}

const mapStateToProps = (state, ownProps) =>{
  
  return {
    editorShow: state.editor.editorShow,
    blogs: state.blogs.blogs,
    user: state.user
  }
}


export default connect(mapStateToProps)(Admin);
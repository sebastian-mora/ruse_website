import React, { Component } from 'react';


import Dropdown from './sub/Dropdown'
import BlogEditor from './sub/BlogEditor/BlogEditor';
import UserEdit from './sub/User/'
import style from './Admin.module.css'

import { connect } from 'react-redux';
import {loadBlogs, closeEditorBlog, openNewBlog, selectBlog, loadCategories} from '../../redux/actions/blogActions'



class Admin extends Component {

  state = {
    manageUsers: false
  }
  
  // Get all the blogs on load
  componentDidMount() {
    this.props.dispatch(loadBlogs())
    this.props.dispatch(loadCategories())
  }

  render() {

    const onCloseClick = () =>{this.props.dispatch(closeEditorBlog())}
    const onNewClick = () =>{this.props.dispatch(openNewBlog())}
    const onBlogSelectClick = (e) =>{if(e.target.value) this.props.dispatch(selectBlog(e.target.value));}
    const onManageClick = () => {this.setState({manageUsers:!this.state.manageUsers})}


    return (
        <div className={style.container}>
          {/* Blog title selector */}
          <Dropdown name={"titles"} options={this.props.blogs} onChange={onBlogSelectClick} />

          
          {this.props.editorShow &&
            <div>
              <BlogEditor/>
              <button onClick={onCloseClick}>Close</button>
            </div>
          }

          {!this.props.editorShow &&
             <button onClick={onNewClick}>New</button>
          }

          <button onClick={onManageClick}>Manage Users</button>
          {!this.state.manageUsers &&
            <>
            
            <UserEdit></UserEdit>
            </>
          }
          
          
        </div>
    ) 
  }
}

const mapStateToProps = (state, ownProps) =>{
  
  return {
    editorShow: state.editor.editorShow,
    blogs: state.editor.blogs
  }
}


export default connect(mapStateToProps)(Admin);
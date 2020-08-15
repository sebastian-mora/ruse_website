import React, { Component } from 'react';


import Dropdown from './sub/Dropdown'
import BlogEditor from './sub/BlogEditor/BlogEditor';
import style from './Admin.module.css'

import { connect } from 'react-redux';
import {loadBlogs, closeEditorBlog, openNewBlog, selectBlog, loadCategories} from '../../redux/actions/blogActions'



class Admin extends Component {

  //
  
  // Get all the blogs on load
  componentDidMount() {
    this.props.dispatch(loadBlogs())
    this.props.dispatch(loadCategories())
  }




  render() {

    const onCloseClick = () =>{this.props.dispatch(closeEditorBlog())}
    const onNewClick = () =>{this.props.dispatch(openNewBlog())}
    const onBlogSelectClick = (e) =>{if(e.target.value) this.props.dispatch(selectBlog(e.target.value));}


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
          
        </div>
    ) 
  }
}

const mapStateToProps = (state) =>{
  return {
    editorShow: state.editor.editorShow,
    blogs: state.editor.blogs
  }
}


export default connect(mapStateToProps)(Admin);
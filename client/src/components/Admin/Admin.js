import React, { Component } from 'react';


import Dropdown from './sub/Dropdown'
import BlogEditor from './sub/BlogEditor';

import { connect } from 'react-redux';
import {loadBlogs, closeEditorBlog, newBlog, openNewBlog} from '../../redux/actions/blogActions'



class Admin extends Component {

  //
  
  // Get all the blogs on load
  componentWillMount() {
    this.props.dispatch(loadBlogs())
  }



  render() {

    const onCloseClick = () =>{this.props.dispatch(closeEditorBlog())}
    const onNewClick = () =>{this.props.dispatch(openNewBlog())}

    return (
        <div>
          <Dropdown />
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
    editorShow: state.editor.editorShow
  }
}


export default connect(mapStateToProps)(Admin);
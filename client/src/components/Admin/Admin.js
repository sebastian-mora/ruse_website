import React, { Component } from 'react';


import Dropdown from './sub/Dropdown'
import BlogEditor from './sub/BlogEditor';

import { connect } from 'react-redux';
import {loadBlogs} from '../../redux/actions/blogActions'



class Admin extends Component {

  //
  
  // Get all the blogs on load
  componentWillMount() {
    this.props.dispatch(loadBlogs())
  }
   


  render() {

    return (
        <div>
          <Dropdown />
          {this.props.editorShow &&
            <BlogEditor/>
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
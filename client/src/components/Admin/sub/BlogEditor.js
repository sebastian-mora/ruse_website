import React, {Component} from 'react';
import { connect } from 'react-redux';
import {updateNewBlog, postBlog} from '../../../redux/actions/blogActions'
import RichTextEditor from 'react-rte';
import style from './BlogEditor.module.css'

class BlogEditor extends Component {

  
  
  editorOnChange = (e) => {
    this.props.dispatch(updateNewBlog({...this.props.blog,
      post: e.target.value
    }))
  };

  saveClick = () => {
    this.props.dispatch(postBlog(this.props.blog))
  }

  render () {    
    return (
      <div>
        <textarea value={this.props.blog.post}  onChange={this.editorOnChange}/>
        <button onClick={this.saveClick}>Save</button>
      </div>
    );
  }
}

const mapToProps= (state) =>{

  let {post, title, date} = state.editor.newBlog
  return {
    blog:{
      post,
      title,
      date
    }
  }
}

export default connect(mapToProps)(BlogEditor)
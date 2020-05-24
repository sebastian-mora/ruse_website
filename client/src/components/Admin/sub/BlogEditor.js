import React, {Component} from 'react';
import { connect } from 'react-redux';
import {updateEditorBlog, postBlog} from '../../../redux/actions/blogActions'
import RichTextEditor from 'react-rte';
import style from './BlogEditor.module.css'

class BlogEditor extends Component {

  
  
  editorOnChange = (e) => {
    this.props.dispatch(updateEditorBlog({...this.props.blog,
      post: e.target.value
    }))
  };

  saveClick = () => {
    this.props.dispatch(postBlog(this.props.blog))
  }

  render () {    
    return (
      <div>
        <input type="text" value={this.props.blog.title}/>
        <input type="date" value={this.props.blog.date}/>
        <input type="checkbox"/>
        <textarea value={this.props.blog.post}  onChange={this.editorOnChange}/>
        <button onClick={this.saveClick}>Save</button>
      </div>
    );
  }
}

const mapToProps= (state) =>{

  let {post, title, date} = state.editor.editorBlog
  return {
    blog:{
      post,
      title,
      date
    }
  }
}

export default connect(mapToProps)(BlogEditor)
import React, {Component} from 'react';
import { connect } from 'react-redux';
import {updateEditorBlog, postBlog} from '../../../redux/actions/blogActions'
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
      <div className={style.container}>
        <div className={style.editorHeader}>
          <label>Title</label>
          <input type="text" value={this.props.blog.title}/>
          <label>Date</label>
          <input type="date" value={this.props.blog.date}/>
          <label>IsPosted</label>
          <input type="checkbox"/>
          <button onClick={this.saveClick}>Save</button>
        </div>
        <textarea value={this.props.blog.post}  onChange={this.editorOnChange}/>

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
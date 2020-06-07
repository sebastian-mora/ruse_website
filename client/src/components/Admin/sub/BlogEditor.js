import React, {Component} from 'react';
import { connect } from 'react-redux';
import {updateEditorBlog, postBlog} from '../../../redux/actions/blogActions'
import style from './BlogEditor.module.css'

class BlogEditor extends Component {

  editorOnChange = (e) => {

    console.log(e.target.name);
    
    this.props.dispatch(updateEditorBlog({...this.props.blog,
      [e.target.name] : e.target.value
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
          <input type="text" name="title" onChange={this.editorOnChange} value={this.props.blog.title}/>
          <label>Date</label>
          <input type="date" name = "date" onChange={this.editorOnChange} value={this.props.blog.date}/>
          <label>IsPosted</label>
          <input name="isPosted" type="checkbox" onChange={this.editorOnChange} checked={this.props.blog.isPosted}/>
          <button onClick={this.saveClick}>Save</button>
        </div>
        <textarea name="post" value={this.props.blog.post}  onChange={this.editorOnChange}/>

      </div>
    );
  }
}

const mapToProps= (state) =>{

  let {post, title, date ,isPosted} = state.editor.editorBlog
  return {
    blog:{
      post,
      title,
      date,
      isPosted
    }
  }
}

export default connect(mapToProps)(BlogEditor)
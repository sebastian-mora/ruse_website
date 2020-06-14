import React, {Component} from 'react';
import { connect } from 'react-redux';
import {updateEditorBlog, postBlog, updateBlog, deleteBlog, closeEditorBlog, loadBlogs} from '../../../redux/actions/blogActions'
import AceEditor from "react-ace";

import style from './BlogEditor.module.css'
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-monokai";

class BlogEditor extends Component {

  editorOnChange = (e) => {

    // ACE editor triggers this without a target?
    // Add this to filter that out to prevent crash
    if(!e.target){
      return
    }
    
 
    //TODO
    // This works to toggle isPosted but is not the general soultion
    if(e.target.name === "isPosted")
    {
      
      e.target.value = Boolean(!this.props.blog.isPosted);
      this.props.dispatch(  
        updateEditorBlog({...this.props.blog,
          isPosted: !this.props.blog.isPosted
      }))
      return
    }

    // for all other values update
    this.props.dispatch(  
      updateEditorBlog({...this.props.blog,
      [e.target.name] : e.target.value
    }))
  };



  saveClick = () => {
    if(this.props.isNewPost)
    {
      this.props.dispatch(postBlog(this.props.blog))
      this.props.dispatch(closeEditorBlog())
      this.props.dispatch(loadBlogs())
    } 
    else 
    {
      this.props.dispatch(updateBlog(this.props.blog))
      this.props.dispatch(closeEditorBlog())
    }
  }

  deleteClick = () =>{
    this.props.dispatch(deleteBlog(this.props.blog))
    this.props.dispatch(closeEditorBlog())
    this.props.dispatch(loadBlogs())
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
          <input name="isPosted" type="checkbox" checked={Boolean(this.props.blog.isPosted)}  onChange={this.editorOnChange} />
          <button onClick={this.saveClick}>Save</button>
          <label>Delete</label>
          <button onClick={this.deleteClick}>Delete</button>

        </div>
        <AceEditor
          mode="html"
          theme="monokai"
          onChange={this.editorOnChange}
          value={this.props.blog.post}
          name="Editor"
          enableBasicAutocompletion="false"
          enableLiveAutocompletion="true"
          className={style.Editor}
          width="1000"
          heigh="700"
          />

      </div>
    );
  }
}

const mapToProps= (state) =>{

  let {post, title, date ,isPosted, id} = state.editor.editorBlog
  let {isNewPost} = state.editor;
  return {
    blog:{
      post,
      title,
      date,
      isPosted,
      id
    },
    isNewPost
  }
}

export default connect(mapToProps)(BlogEditor)
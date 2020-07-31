import React, {Component} from 'react';
import { connect } from 'react-redux';
import {updateEditorBlog, postBlog, updateBlog, deleteBlog, closeEditorBlog, loadBlogs} from '../../../redux/actions/blogActions'
import AceEditor from "react-ace";

import style from './BlogEditor.module.css'
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-monokai";
import Dropdown from './Dropdown'

class BlogEditor extends Component {

  

  editorOnChange = (e) => {

    // ACE editor returns value from event rather than the event. SMH
    // 
    if(!e.target){
      this.props.dispatch(
        updateEditorBlog({...this.props.blog,
          post: e
        })
      )
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
    } 
    else 
    {
      this.props.dispatch(updateBlog(this.props.blog))
      this.props.dispatch(closeEditorBlog())
    }

    this.props.dispatch(loadBlogs())
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
          <label>Category</label>
          <Dropdown name={"category"}options={this.props.categories.map((cat) => {return {title:cat, id:cat}})} onChange={this.editorOnChange}/>
          
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
          className={style.Editor}
          width="1000"
          heigh="700"
          />

      </div>
    );
  }
}

const mapToProps= (state) =>{

  let {post, title, date ,isPosted, id, category} = state.editor.editorBlog
  let {isNewPost, categories} = state.editor;

  return {
    blog:{
      post,
      title,
      date,
      isPosted,
      id,
      category
    },
    isNewPost,
    categories
  }
}

export default connect(mapToProps)(BlogEditor)
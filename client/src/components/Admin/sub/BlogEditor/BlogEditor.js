import React, {Component} from 'react';
import { connect } from 'react-redux';
import {loadBlogs} from '../../../../redux/actions/blogActions'
import {updateBlog, updateEditorBlog, fetchBlog, postBlog, closeEditorBlog, deleteBlog, togglePreview} from '../../../../redux/actions/editorActions'


import Collapsible from 'react-collapsible';

import ImageSelect from './ImageSelect/ImageSelect'
import MDEditor from '@uiw/react-md-editor';

import style from './BlogEditor.module.css'
import Dropdown from '../Dropdown'
import { EDITOR_SAVE_ERROR_CLEAR } from '../../../../redux/actions/types';

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
    }
    else 
    {
      this.props.dispatch(updateBlog(this.props.blog))
    }

    this.props.dispatch(loadBlogs())
  }

  deleteClick = () =>{
    this.props.dispatch(deleteBlog(this.props.blog))
    this.props.dispatch(closeEditorBlog())
    this.props.dispatch(loadBlogs())
  }

  previewClick = () =>{
    this.props.dispatch(togglePreview())
  }

  categorySelect = (e) =>{
    // Work around method to get the name not the id of the selected catagory.
    var index = e.nativeEvent.target.selectedIndex;
    this.props.dispatch(  
      updateEditorBlog({...this.props.blog,
      category : e.nativeEvent.target[index].text
    }))
  }

  getCurrentCategory = () => {
    if (this.props.blog.category){
      return this.props.categories.find(c => c.name === this.props.blog.category).id
    }

    else{
      return this.props.categories
    }
  }

  renderEditor = () =>{

    // If blog is not loaded 
    if(!this.props.loaded){
      this.props.dispatch(fetchBlog(this.props.blog.id))
    }

    if(this.props.didSave === true){
      alert("Blog saved sucessful")
      this.props.dispatch({type: EDITOR_SAVE_ERROR_CLEAR})
    }

    if(this.props.didSave === false){
      alert(`Failed to Save: ${this.props.saveError}`)
      this.props.dispatch({type: EDITOR_SAVE_ERROR_CLEAR})
    }

    if(this.props.preview){
      return <div className="container"> <MDEditor.Markdown source={this.props.blog.post} /></div>
    }

    return(
      <div className="container">
            <MDEditor
              value={this.props.blog.post}
              onChange={this.editorOnChange}
              height={500}
            />
          </div>
    )
  }

  render () {


    return (
      <div className={style.container}>

        <div className={style.form}>

            <label>Title</label>
            <input type="text" name="title" onChange={this.editorOnChange} value={this.props.blog.title}/>
            <label>Date</label>
            <input type="date" name = "date" onChange={this.editorOnChange} value={this.props.blog.date}/>


            {/* This categories is mapped to {title, id } to match dropdown structure */}

            <label>Category</label>
            <Dropdown name={"category"} defaultValue={ this.getCurrentCategory() } options={this.props.categories.map((cat) => {return {title:cat.name, id:cat.id}})} onChange={this.categorySelect}/>



            <label>IsPosted</label>
            <input name="isPosted" type="checkbox"  checked={Boolean(this.props.blog.isPosted)}  onChange={this.editorOnChange} />
            
            <button onClick={this.saveClick}>Save</button>
            <button onClick={this.deleteClick}>Delete</button>
            <button onClick={this.previewClick}>Preview</button>
          </div>


            <Collapsible className={style.Collapsible} contentOuterClassName={style.CollapsibleOpen} contentInnerClassName={style.CollapsibleInner} trigger={<button>Images</button>}>
              <ImageSelect blog_id={this.props.blog.id} />
            </Collapsible>
    
          {this.renderEditor()}
          
      </div>
    );
  }
}

const mapToProps= (state) =>{

  let {post, title, date ,isPosted, category, id} = state.editor.editorBlog
  let {isNewPost, preview, loaded, saveError, didSave} = state.editor;
  let categories = state.blogs.categories;

  return {
    blog:{
      post,
      title,
      date,
      isPosted,
      category,
      id
    },
    isNewPost,
    categories,
    loaded,
    saveError,
    didSave,
    preview
  }
}

export default connect(mapToProps)(BlogEditor)
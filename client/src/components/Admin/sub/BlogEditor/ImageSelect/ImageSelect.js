import React, {useEffect, useCallback} from 'react';
import { connect, useDispatch } from 'react-redux';
import {fetchBlogImages, saveBlogImage} from '../../../../../redux/actions/editorActions'
import { UPDATE_EDITOR_BLOG } from '../../../../../redux/actions/types';

import {useDropzone} from 'react-dropzone'
import style from './ImageSelect.module.css'

const ImageSelect = (props) => {


  const dispatch = useDispatch()

  useEffect( () => {
    if(props.images.length === 0 || props.newUploadedImage){
      dispatch(fetchBlogImages(props.blog_id))
    }
  }, [props.newUploadedImage])


  // on click insert the .md line into the blog
  function imgClick(e) {
    const html_img = `![alt text](${e.target.src})`
    dispatch({type: UPDATE_EDITOR_BLOG, payload: {...props.blog, post: props.blog.post + '\n' +  html_img }})
  }

  const onDrop = useCallback(acceptedFiles => {
      acceptedFiles.forEach((file) => {
        dispatch(saveBlogImage(props.blog_id, file))
      }, [])

  })

  const {getRootProps, getInputProps} = useDropzone({onDrop})


  return (
      
      <div>
        {/* Show images */}
        <div>
          {
            props.images.map(image => (
              <div key={image.url}  className={style.thumbnail} >
              <img onClick={imgClick} alt={image.filename} src={image.url}/>
              <p>{image.filename}</p>
            </div> 
            ))
          }
  
        </div>
        

        {/* Image Upload Area */}
        <div className={style.Upload} {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Click or drop images here</p>
        </div>
        
      </div>
    )
}

const mapToProps= (state) =>{

  let {post, id } = state.editor.editorBlog
  let {images, newUploadedImage} = state.editor;

  return {
    blog:{
      post,
      id
    },
    images,
    newUploadedImage
  }
}

export default connect(mapToProps)(ImageSelect);
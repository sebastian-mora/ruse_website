import React, {useState, useEffect, useCallback} from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import {} from '../../../redux/actions/blogActions';

import {useDropzone} from 'react-dropzone'

import {getImages, uploadImage} from '../../../api/adminApi'
import style from './ImageSelect.module.css'
import { UPDATE_EDITOR_BLOG } from '../../../redux/actions/types';



const ImageSelect = (props) => {

  const [images, setImages] = useState([])
  const {post} =  useSelector(state => state.editor.editorBlog)
  const dispatch = useDispatch()

  useEffect( () => {
    setImages(loadImages(props.blog_id))
  }, [])

  function loadImages(blog_id){

    getImages(blog_id).then((data) =>{
      setImages(data);
    })
    .catch((err) => {
      return;
    })
    return []
  }

  function imgClick(e) {

    const html_img = `<img alt="null" src="${e.target.src}">`
    dispatch({type: UPDATE_EDITOR_BLOG, payload:{post: post + `\n ${html_img}`} })
  }

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {
        uploadImage(props.blog_id, file).then((res) =>{
          console.log(res);
        }).catch((err) => {
          console.log(err);
        })
  }, [])
})
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  
  return (
    
    <div>

      {/* Show images */}
      <div>
        {images.map((image) => {
              return (
                  <div key={image.url}  className={style.thumbnail} >
                    <img onClick={imgClick} alt={image.filename} src={image.url}/>
                    <p>{image.filename}</p>
                  </div> 
                )  
            })}
      </div>
      

      {/* Image Upload Area */}
      <div className={style.Upload} {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Click or drop images here</p>
      </div>
      
    </div>
  )
}

export default connect()(ImageSelect);
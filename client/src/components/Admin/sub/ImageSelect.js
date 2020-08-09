import React, {useState, useEffect, useCallback} from 'react';
import {useDropzone} from 'react-dropzone'

import {getImages, uploadImage} from '../../../api/adminApi'
import style from './ImageSelect.module.css'



const ImageSelect = (props) => {

  const [images, setImages] = useState([])

  useEffect( () => {
    setImages(loadImages(props.blog_id))
  }, [])

  function loadImages(blog_id){

    getImages(1).then((data) =>{
      setImages(data);
    })
    .catch((err) => {
      return;
    })
    return []
  }

  function imgClick() {
    console.log("IMAGE CLICK");
  }

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {
        uploadImage(1, file).then((res) =>{
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
                  <div className={style.thumbnail} >
                    <img key={image.url} onClick={imgClick} alt={image.filename} src={image.url}/>
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

export default ImageSelect;
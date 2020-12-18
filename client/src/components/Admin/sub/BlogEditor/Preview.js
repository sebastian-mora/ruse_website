import React from 'react';
import { connect, useSelector } from 'react-redux';
import style from '../../../Blog/BlogPage.module.css'

const Preview = () => {

  const blog =  useSelector(state => state.editor.editorBlog)

  return (


    <div>
      <div className={style.title}><h1>{blog.title}</h1></div>

      <div className={style.date}>{blog.date}</div>

      <div className={style.post}   dangerouslySetInnerHTML={{__html: blog.post}}></div>

    </div>
    


  )

}

export default connect()(Preview);
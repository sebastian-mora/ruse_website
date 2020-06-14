import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {getBlogs} from '../../api/blogsApi';
import style from './Blog.module.css'




const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loadErr, setErr] = useState(false);

 
  useEffect(() => {
      getBlogs().then(res => {
        setBlogs(res)
      })
      .catch(err => {
        setErr(err)
      });
  }, []);

    
  return (
    <div className={style.center}>

      <h1>Blogs:</h1>


      <ul className={style.root}>

        <li>General Blgos</li>
          <ul className={style.sub}>
            {blogs.map(({id,title}) =>{
              return <Link key={id} to={`blog/${id}`}><li>{title}</li></Link>
            })}
        </ul>


        <li>Tools:</li>
          <ul className={style.sub}>
        </ul>


        <li>Random:</li>


        <li>Interesting Articles:</li>


      
        {loadErr&& <p>Error Fetching Blogs</p>}

      </ul>



    </div>
  )
}

export default Blog;

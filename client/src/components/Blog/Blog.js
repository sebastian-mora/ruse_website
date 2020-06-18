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


  function lessThan30Days(blog){

    var blog_date = new Date(blog.date)
    var current_date = new Date()
    var delta = (current_date - blog_date)/(1000*60*60*24.0)

    return delta <= 30
  }

  console.log(blogs.filter(lessThan30Days));
  

  return (
    <div className={style.center}>

      <h1>Blogs:</h1>

  
      <ul className={style.root}>

        <li>Last 30 Days: </li>
        <ul className={style.sub}>
          {blogs.filter(lessThan30Days).map(({id,title, date}) => {
            return <Link key={id} to={`blog/${id}`}><li>{title} - {date}</li></Link>
          })}
        </ul>

        <li>General Blgos</li>
          <ul className={style.sub}>
            {blogs.map(({id,title, date}) =>{
              return <Link key={id} to={`blog/${id}`}><li>{title} - {date}</li></Link>
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

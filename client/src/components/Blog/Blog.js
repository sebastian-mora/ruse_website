import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {getBlogs} from '../../api/blogsApi';




const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loadErr, setErr] = useState(null);

 
  useEffect(() => {
      getBlogs().then(res => {
        setBlogs(res)
      })
      .catch(err => {
        setErr(err)
      });
  }, []);

    
  return (
    <div>
    
      
      {blogs.map(({id,title}) =>{
        return <Link key={id} to={`blog/${id}`}><li>{title}</li></Link>
      })}



    </div>
  )
}

export default Blog;

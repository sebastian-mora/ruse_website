import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {getBlogs} from '../../api/blogsApi';




const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loadErr, setErr] = useState(false);

 
  useEffect(() => {
    
      console.log("CALLED");
      
      getBlogs().then(res => {
        setBlogs(res)
      })
      .catch(err => {
        setErr(!loadErr)
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

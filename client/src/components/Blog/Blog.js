import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';


import axios from 'axios';



const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [fetchErr, setFetchErr] = useState(false);

  useEffect(() => {
    axios
      .get("/blog")
      .then(result => setBlogs(result.data))
      .catch(err => {
        console.log(err);
        setFetchErr(true);
        return null
      })
  }, []);

  return (
    <div>
    
      
      {blogs.map(({id,title}) =>{
        return <Link key={id} to={`blog/${id}`}><li>{title}</li></Link>
      })}

      {
        fetchErr && <p>Failed to get blogs</p>
      }

    </div>
  )
}

export default Blog;

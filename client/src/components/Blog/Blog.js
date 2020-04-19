import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';


import axios from 'axios';



const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("/blog")
      .then(result => setBlogs(result.data));
  }, []);

  return (
    <div>
      {blogs.map(({id,title}) =>{
        return <Link key={id} to={`blog/${id+1}`}><li>{title}</li></Link>
      })}
    </div>
  )
}

export default Blog;

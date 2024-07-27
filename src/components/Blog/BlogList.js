import React, { useState, useEffect } from 'react';
import { getAllBlogs } from '../../api/blogsApi';
import style from './BlogList.module.css';

import BlogTree from './BlogTree';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getAllBlogs().then((res) => {
      setBlogs(res.data);
    });
  }, []);


  return (
    <div className={style.center}>
      <BlogTree blogs={blogs} />
    </div>
  );
};

export default BlogList;

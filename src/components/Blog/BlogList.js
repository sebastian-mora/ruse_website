import React, { useState, useEffect } from 'react';
import { getAllBlogs } from '../../api/blogsApi';
import style from './BlogList.module.css';

import BlogTree from './BlogTree';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getAllBlogs().then((res) => {
      res.data.sort((a, b) => {
        return (
          convertStringToDate(b.metadata.dateposted) -
          convertStringToDate(a.metadata.dateposted)
        );
      });
      setBlogs(res.data);
    });
  }, []);

  const convertStringToDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Correct month to zero-based index
  };

  return (
    <div className={style.center}>
      <BlogTree blogs={blogs} />
    </div>
  );
};

export default BlogList;

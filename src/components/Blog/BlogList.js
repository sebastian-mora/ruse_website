import React, { useState, useEffect } from 'react';
import { getAllBlogs } from '../../api/blogsApi';
import style from './BlogList.module.css';

import BlogTree from './BlogTree';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllBlogs()
      .then((res) => {
        res.data.sort((a, b) => {
          return (
            convertStringToDate(b.metadata.dateposted) -
            convertStringToDate(a.metadata.dateposted)
          );
        });
        setBlogs(res.data);
      })
      .catch((err) => {
        setError('Failed to load blogs. Please try again later.');
      });
  }, []);

  const convertStringToDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Correct month to zero-based index
  };

  return (
    <div className={style.center}>
      {error ? (
        <div className={style.error}>{error}</div>
      ) : (
        <BlogTree blogs={blogs} />
      )}
    </div>
  );
};

export default BlogList;

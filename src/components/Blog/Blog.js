import React, { useState, useEffect } from "react";
import { getAllBlogs } from "../../api/blogsApi";
import style from "./Blog.module.css";

import Card from "./Card";

const Blog = () => {
  // store the blogs from the api in blogs
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

  // DATE FORMAT IS MM/DD/YYYY
  const convertStringToDate = (dateString) => {
    const date = dateString.split("-");
    return new Date(date[2], date[0], date[1]);
  };

  return (
    <div className={style.center}>
      <h1 className={style.pageTitle}>Blogs</h1>

      {/* <div className={style.pinnedBlogs}>
          <h2>Featured</h2>
          {// eslint-disable-next-line
            blogs.map((blog, _) => {
              if (blog.pinned)
              return( 
                <><Card blog={blog}></Card></> 
              )
              
          })}
        </div> */}

      <div className={style.cardDiv}>
        {
          // eslint-disable-next-line
          blogs.map((blog, _) => {
            // if (!blog.pinned)
            return (
              <div key={blog.id}>
                <Card blog={blog}></Card>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default Blog;

import React, { useState, useEffect } from "react";
import { getAllBlogs } from "../../api/blogsApi";
import style from "./Blog.module.css";

import Card from "./Card";

const BlogList = () => {
  // store the blogs from the API in blogs
  const [blogs, setBlogs] = useState([]);
  const [selectedYear, setSelectedYear] = useState(""); // State for selected year

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

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Function to filter blogs based on the selected year
  const filterBlogsByYear = (blog) => {
    const datePosted = convertStringToDate(blog.metadata.dateposted);
    if (selectedYear === "ALL" || selectedYear === "") {
      return true; // Show all blogs when no year is selected
    } else {
      return datePosted.getFullYear() === parseInt(selectedYear);
    }
  };

  const years = ["ALL", "2023", "2022", "2021"]; // Add more years as needed

  return (
    <div className={style.center}>
      <h1 className={style.pageTitle}>Blogs</h1>

      {/* Year filter horizontal list */}
      <div className={style.horizontalList}>
        {years.map((year) => (
          <button
            key={year}
            className={selectedYear === year ? style.selectedYear : style.yearButton}
            onClick={() => handleYearChange(year)}
          >
            {year}
          </button>
        ))}
      </div>

      <div className={style.cardDiv}>
        {blogs
          .filter(filterBlogsByYear) // Use the filter function
          .map((blog) => (
            <div key={blog.id}>
              <Card blog={blog}></Card>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BlogList;

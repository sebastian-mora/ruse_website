import React from 'react';
import style from './BlogTree.module.css';
import { Link } from 'react-router-dom'; // assuming you're using react-router for navigation

const BlogTree = ({ blogs }) => {
    const years = {};

    const convertStringToDate = (dateString) => {
        const [day, month, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // Correct month to zero-based index
    };

    blogs.forEach(blog => {
        const year = convertStringToDate(blog.metadata.dateposted).getFullYear();

        if (!years[year]) {
            years[year] = [];
        }
        years[year].push(blog);
    });

    const sortedYears = Object.keys(years).sort((a, b) => b - a); // Sort years from high to low



    return (
        <div className={style.tree}>
            {sortedYears.map((year, yearIndex) => (
                <div key={year} className={style.year}>
                    {year}
                    {years[year].map((blog, blogIndex) => (
                        <div key={blog.id} className={style.blog}>
                            <Link to={`/blogs/${blog.id}`}>{blog.metadata.title}</Link>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BlogTree;

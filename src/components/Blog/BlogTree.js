import React, { useMemo } from 'react';
import style from './BlogTree.module.css';
import { Link } from 'react-router-dom'; // assuming you're using react-router for navigation

const BlogTree = ({ blogs }) => {
    const convertStringToDate = (dateString) => {
        const [month, day, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // Correct month to zero-based index
    };

    const sortedBlogsByYear = useMemo(() => {
        const years = {};

        blogs.forEach(blog => {
            const date = convertStringToDate(blog.metadata.dateposted);
            const year = date.getFullYear();

            if (!years[year]) {
                years[year] = [];
            }
            years[year].push(blog);
        });

        // Sort blogs by date within each year
        Object.keys(years).forEach(year => {
            years[year].sort((a, b) => convertStringToDate(b.metadata.dateposted) - convertStringToDate(a.metadata.dateposted));
        });

        // Sort years from high to low
        return Object.keys(years).sort((a, b) => b - a).map(year => ({
            year,
            blogs: years[year]
        }));
    }, [blogs]);

    return (
        <div className={style.tree}>
            {sortedBlogsByYear.map(({ year, blogs }) => (
                <div key={year} className={style.year}>
                    <div className={style.yearTitle}>{year}</div>
                    {blogs.map(blog => (
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

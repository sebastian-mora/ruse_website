import React, { useState, useEffect } from 'react';
import {getAllBlogs} from '../../../api/blogsApi';
import BlogEditor from './BlogEditor';


const BlogManager = () => {

  const [blogs, setBlogs] = useState([]);
  const [edit, setEdit] = useState({state:false, id:""});

  useEffect(() => {
    getAllBlogs()
      .then(res => {
        res.data.sort((a, b) => {
          return  convertStringToDate(b.datePosted) - convertStringToDate(a.datePosted) 
        })
        setBlogs(res.data)
      })
  }, []);


  // DATE FORMAT IS MM/DD/YYYY
  const convertStringToDate = (dateString) => {
    const date  = dateString.split('-')
    return new Date(date[2], date[0], date[1])
  }

  const renderEdit = () =>{
    if(edit.state) {
      return (
        <>
          <BlogEditor id={edit.id}/>
          <button onClick={handelEditClick}> Back</button>
        </>
      )
    }
  }

  const handelEditClick = (e) =>{
    setEdit({
      state: !edit.state,
      id: e.target.value
    })
  }

  console.log(edit);
  return (
    <div>

      {renderEdit()}
      {!edit.state && 
        <table>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Tags</th>
          </tr>
          {blogs.map((blog, index) => {
            return(
                  <tr>
                    <td> {blog.title} </td>
                    <td>{blog.datePosted}</td>
                    <td>{blog.tags.join(', ')}</td>
                    <td><button value={blog.id} onClick={handelEditClick}>...</button></td>
                  </tr>
            ) 
          })}
      </table>
      }
    </div>
  );
};

export default BlogManager;
import React, {  useEffect } from 'react';
import {getBlogBySlug, deleteBlog} from '../../../../api/blogsApi';
import { useAuth0 } from "@auth0/auth0-react";


const BlogEditor = (prop) => {

  // const [blog, setBlog] = useState({});
  const {getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getBlogBySlug(prop.id)
      .then(res => {
        // setBlog(res.data)
      })
  }, [prop.id]);

  const onClickDelete = async () =>{
    const token = await getAccessTokenSilently();
    deleteBlog(prop.id, token)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div>
    
      <div>
        <h2>Options</h2>
        <button onClick={onClickDelete}>Delete</button>
      </div>
    </div>
  );
};

export default BlogEditor;
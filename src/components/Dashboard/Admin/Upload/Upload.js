import React, { useState  } from "react";
import style from './Upload.module.css'

import { useAuth0 } from "@auth0/auth0-react";


import {postBlog} from '../../../../api/blogsApi'


const Upload = () => {


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([])
  const [date, setDate] = useState("")
  const [mdFile, setFile] = useState()

  const {getAccessTokenSilently } = useAuth0();
  
  let formData = new FormData();

  const handleSubmit = async (e) =>{
    e.preventDefault()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('tags', tags)
    formData.append('datePosted', date)
    formData.append('file', mdFile)
 
    const token = await getAccessTokenSilently();
    postBlog(formData, token)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div>
      <form className={style.uploadForm} onSubmit={handleSubmit}> 
        <label>
          Name:
          <input onChange={(e) => setTitle(e.target.value)} type="text" />        
        </label>

        <label>
          description:
          <input onChange={(e) => setDescription(e.target.value)}  type="text" />        
        </label>

        <label>
          datePosted (dd-mm-yyyy):
          <input onChange={(e) => setDate(e.target.value)}  type="text" />        
        </label>

        <label>
          tags (dev,pentest):
          <input onChange={(e) => {setTags(e.target.value.split(","))} } type="text" />        
        </label>

        <label>
          .md file:
          <input onChange={(e) => setFile(e.target.files[0])} type="file" />        
        </label>

        <input type="submit" onSubmit={handleSubmit} value="Submit" />
      </form>
    </div>
  );
};

export default Upload;
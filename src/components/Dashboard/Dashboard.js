import React, {useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Upload from "./Admin/Upload/Upload";
import BlogManager from "./Admin/BlogManager/BlogManager";


const Dashboard = () => {

  const { user } = useAuth0();

  const [postBlog, setPostBlog] = useState(false);
  const [manageBlog, setManageBlog] = useState(false);

  const clickPostBlog = (e) => {
    setPostBlog(!postBlog)
  }

  const clickManageBlog = (e) => {
    setManageBlog(!manageBlog)
  }

  const renderPostBlog = () => {
    if(postBlog){
      return (
        <>
        <Upload/>
        <button onClick={clickPostBlog}>Exit</button>
        </>
      )
    } else {
        return <button onClick={clickPostBlog}> Post Blog </button>
    }
  }

  const renderManageBlog = () => {

  }

  return (
    <div>
      {/* <Profile></Profile> */}
      <h1>Dashboard</h1>
      {renderPostBlog()}
      <BlogManager/>
    </div>
  );
};

export default Dashboard
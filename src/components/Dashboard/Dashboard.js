import React, {useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Upload from "./Upload/Upload";


const Dashboard = () => {

  const { user } = useAuth0();

  const [postBlog, setPostBlog] = useState(false);

  const clickPostBlog = (e) => {
    setPostBlog(!postBlog)
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

  return (
    <div>
      {/* <Profile></Profile> */}
      <h1>Dashboard</h1>
      {renderPostBlog()}
    </div>
  );
};

export default Dashboard
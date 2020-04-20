import React, {} from 'react';


const Dropdown = ({blogs, updateBlog}) => {

  function setBlog(e){
    updateBlog(e.target.value)
  }
  
  return (
    <div>
      <select onChange={e => setBlog(e)}id="blogs">
        {blogs.map(({id, title}) =>{
          return <option key={id} value={id}>{title}</option>
        })}
      </select>
    </div>
  )
}

export default Dropdown;
import React, {} from 'react';


import { connect, useSelector } from 'react-redux';
import {selectBlog} from '../../../redux/actions/blogActions'



const Dropdown = ({dispatch}) => {

  const blogs = useSelector(state => state.editor.blogs)

  function setBlog(e){
   dispatch(selectBlog(e.target.value))
  }
  
  return (
    <div>
      <select onChange={e => setBlog(e)} id="blogs">
        {blogs.map(({title, id}) =>{
          return <option key={id} value={id}>{title}</option>
        })}
      </select>
    </div>
  )
}

export default connect()(Dropdown);
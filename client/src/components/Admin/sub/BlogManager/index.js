import React from 'react';
import {selectBlog} from '../../../../redux/actions/editorActions'
import { connect, useDispatch } from 'react-redux';
import style from './BlogManager.module.css'

const BlogManager = ({blogs ,onClick}) => {

  return (
    <div >
      <table className={style.userTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>ID</th>
            <th>Category</th>
            <th>Date</th>
            <th>IsPosted</th>
            <td></td>
          </tr>
        </thead>

        <tbody>
          {blogs.map(({title, id, isPosted, date, category}) =>{
            return( 
              <tr key={id}>
                <td>{title}</td>
                <td>{id}</td>
                <td>{category}</td>
                <td>{date}</td>
                <td>{String(isPosted)}</td>
                <td><button onClick={onClick} value={id}>edit</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (state) => {
  return state.blogs
}

export default connect(mapStateToProps)(BlogManager);
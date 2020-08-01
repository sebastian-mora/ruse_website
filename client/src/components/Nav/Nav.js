import React from 'react';
import style from './Nav.module.css'
import {Link} from 'react-router-dom';
import { connect, useSelector } from 'react-redux';


const Nav = () => {

  const isAuthd =  useSelector(state => state.user.isAuthd)

  return (
    <div className={style.container}>
      <Link className={style.link} to="/">RU$E</Link>
      <Link className={style.link} to="/blog">Blog</Link>
      <Link className={style.link} to="/about">About</Link>
      {isAuthd && 
        <>
          <Link className={style.link} to="/admin">Admin</Link>
          <Link className={style.link} to="/logout">Logout</Link>
        </>
      }
    </div>

  )

}

export default connect()(Nav);
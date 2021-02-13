import React from 'react';
import style from './Nav.module.css'
import {Link} from 'react-router-dom';


const Nav = () => {
  return (
    <div className={style.container}>
      <Link className={style.link} to="/">Ru$e</Link>
      <Link className={style.link} to="/blogs">Blog</Link>
      <Link className={style.link} to='/projects'>Projects</Link>
      <Link className={style.link} to="/about">About</Link>
    </div>
  )
}

export default Nav;
import React from 'react';
import style from './Nav.module.css'
import {Link} from 'react-router-dom';

import { useAuth0 } from "@auth0/auth0-react";


const Nav = () => {

  const { isAuthenticated } = useAuth0();

  return (
    <div className={style.container}>
      <Link className={style.link} to="/">Ru$e</Link>
      <Link className={style.link} to="/blogs">Blog</Link>
      <Link className={style.link} to='/projects'>Projects</Link>
      <Link className={style.link} to="/about">About</Link>

      {isAuthenticated && <>
        <Link className={style.link} to="/dashboard">Dashboard</Link>
        <Link className={style.link} to="/logout">Logout</Link>
        </>
      }
      
    </div>
  )
}

export default Nav;
import React from 'react';
import style from './Nav.module.css'
import {Link} from 'react-router-dom';
import { connect, useSelector } from 'react-redux';


const Nav = () => {

  const isAuthd =  useSelector(state => state.user.isAuthd)

  return (
    <div className={style.container}>
      <ul className={style.container}>
      <Link className='text-link' to="/"><li className={style.liButton}>RU$E</li></Link>
      <Link className='text-link' to="/blog"><li className={style.liButton}>Blog</li></Link>
      <Link className='text-link' to="/about"><li className={style.liButton}>About</li></Link>
      {isAuthd && 
        <>
          <Link className='text-link' to="/admin"><li className={style.liButton}>Admin</li></Link>
          <Link className='text-link' to="/logout"><li className={style.liButton}>Logout</li></Link>
        </>
      }
      </ul>
    </div>

  )

}

export default connect()(Nav);
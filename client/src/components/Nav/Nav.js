import React from 'react';
import style from './Nav.module.css'
import {Link} from 'react-router-dom';


const Nav = () => {

  return (
    <div className={style.container}>
      <ul className={style.container}>
      <Link className='text-link' to="/"><li>RU$E</li></Link>
      <Link className='text-link' to="/blog"><li>Blog</li></Link>
      <Link className='text-link' to="/about"><li>About</li></Link>
      </ul>
    </div>

  )

}

export default Nav;
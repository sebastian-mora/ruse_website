import React from 'react';
import style from './About.module.css'

const About = () => {

  return (
    <div className={style.center}>
      <p className={style.boxed}>
      This website is dedicated to whatever content I feel is interesting or relevant.
      If you wish to contact me email me at <a href="mailto:ruse@ruse.tech">ruse@ruse.tech</a>
      <br></br>
      <a href="https://github.com/seb1055">GIT<img src="public/imgs/github.png" alt=""/></a>
      </p>
     
    </div>
  )
}

export default About;

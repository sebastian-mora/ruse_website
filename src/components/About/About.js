import React from 'react';
import style from './About.module.css'
import ruse_dark from './ruse.png'

const About = () => {

  return (
    <div className={style.center}>

    <h1><code>typeof(RU$E)</code></h1>
      <img src={ruse_dark} className={style.ruseImg} alt="Ruse Logo"></img>
      <p className={style.boxedAbout}>
        Pentester turned Cloud Security Engineer interest in privacy.
        This website is dedicated to whatever content I feel is interesting or relevant.
        If you wish to contact my email is <a href="seb@ruse.tech"> seb@ruse.tech </a>

        <p></p>
        Links:
        <ul>
          <li><a  href="https://github.com/sebastian-mora"  rel="noopener noreferrer"target="_blank">Github</a></li>
          <li><a href="https://twitter.com/rusesec"  rel="noopener noreferrer" target="_blank">Twitter</a></li>
        </ul>
      </p>
    </div>
  )
}

export default About;

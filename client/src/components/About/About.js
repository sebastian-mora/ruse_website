import React from 'react';
import style from './About.module.css'
import ruse_dark from './ruse.png'

const About = () => {

  return (
    <div className={style.center}>

    <h1><code>typeof(RU$E)</code></h1>
      <img src={ruse_dark} className={style.ruseImg} alt="Ruse Logo"></img>
      <p className={style.boxedAbout}>
        I am an infosec person. I working in pentesting and have interests in offsec and privacy.
        This website is dedicated to whatever content I feel is interesting or relevant.
        If you wish to contact me email me at <a href="mailto:info@ruse.tech">??? (tbd)</a>
        <br></br>
        Links:
        <ul>
          <li><a href="https://github.com/seb1055">Github<img src="public/imgs/github.png" alt=""/></a></li>
          <li><a href="https://twitter.com/seb1055">Twitter</a></li>
        </ul>
      </p>

 
    </div>

    
  )
}

export default About;

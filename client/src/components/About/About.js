import React from 'react';
import style from './About.module.css'
import ruse_dark from './ruse.png'

const About = () => {

  return (
    <div className={style.center}>

    <h1><code>typeof(RU$E)</code></h1>
      <img src={ruse_dark} className={style.ruseImg} alt="Ruse Logo"></img>
      <p className={style.boxedAbout}>
        I am an infosec person. I am a Pentester with focus on Cloud/WebApps and an intrest in privacy.
        This website is dedicated to whatever content I feel is interesting or relevant.
        If you wish to contact my email is <a href=""> seb@ruse.tech</a> (<a href="https://keys.openpgp.org/vks/v1/by-fingerprint/61594A228EE2FF3B7811A5C0423803123B071223">PGP Available</a>).

        <br></br>
        Links:
        <ul>
          <li><a  href="https://github.com/seb1055"  rel="noopener noreferrer"target="_blank">Github</a></li>
          <li><a href="https://twitter.com/seb1055"  rel="noopener noreferrer" target="_blank">Twitter</a></li>
        </ul>
      </p>

 
    </div>

    
  )
}

export default About;

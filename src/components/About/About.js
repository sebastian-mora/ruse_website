import React from "react";
import style from "./About.module.css";
import ruse_dark from "./ruse.png";

const About = () => {
  return (
    <div className={style.center}>
      <img src={ruse_dark} className={style.ruseImg} alt="Ruse Logo" />
      <div className={style.boxedAbout}>
        <p>Pentester turned Security Engineer with an interest in privacy. This website is dedicated to hosting a collection of content that I find interesting or relevant.</p>
        <p>
          <a href="mailto:ruse@ruse.tech">ruse@ruse.tech</a>
        </p>
        <p>
          <a href="https://github.com/sebastian-mora" target="_blank" rel="noopener noreferrer">github.com/sebastian-mora</a>
        </p>
      </div>
    </div>
  );
};

export default About;

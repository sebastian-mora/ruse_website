import React from "react";
import style from "./About.module.css";
import ruse_dark from "./ruse.png";

const About = () => {
  return (
    <div className={style.center}>
      <img src={ruse_dark} className={style.ruseImg} alt="Ruse Logo"></img>
      <p className={style.boxedAbout}>
        Pentester turned Cloud Security Engineer with an interest in privacy. This website is dedicated to hosting a collection of content that I find intresting or relevant. If you wish to get in touch, please feel free to contact me via email:
        {" "}
        <a href="seb@ruse.tech"> seb@ruse.tech </a>
        <p></p>
        <ul>
          <li>
            <a
              href="https://github.com/sebastian-mora"
              rel="noopener noreferrer"
              target="_blank"
            >
              Github
            </a>
          </li>
        </ul>
      </p>
    </div>
  );
};

export default About;

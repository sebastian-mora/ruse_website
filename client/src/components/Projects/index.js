import React from 'react';
import Card from './Card'
import style from './index.module.css'





const Projects = () => {


  return (
    <div className={style.cardContainer} >

      <Card  
        title="Ruse Website" 
        description="My adventures into fullstack devlopment and source for this website." 
        imageUrl="https://s3-us-west-2.amazonaws.com/ruse.tech/imgs/public/website_icon.png" 
        githubUrl="https://github.com/seb1055/ruse_website" 
        projectUrl="https://ruse.tech/blog/4GjUExwitLBd63AAoNSQq5">
      </Card>

      <Card  
        title="CloudGoat: ECS_EFS_ATTACK" 
        description="A complex AWS security training environment that leverages a multitude of AWS services including ECS, EC2, EFS, Lambda, Systems Manager, and Cloudwatch. 
        A predefined attack path gives assessors experience attacking containers to gain privileges to other AWS services." 
        imageUrl="https://camo.githubusercontent.com/107ece37c06c8f1a02d0469fbdefd8b264f51860532c1401144286c95ad678f0/68747470733a2f2f7268696e6f73656375726974796c6162732e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031382f30372f636c6f7564676f61742d65313533333034333933383830322d31313430783430302e6a7067" 
        githubUrl="https://github.com/RhinoSecurityLabs/cloudgoat/tree/master/scenarios/ecs_efs_attack" 
        projectUrl="https://rhinosecuritylabs.com/cloud-security/cloudgoat-aws-ecs_efs_attack/">
      </Card>

      <Card  
        title="AWS Loot" 
        description="Searches an AWS environment looking for secrets, by enumerating environment variables and source code. This tool allows quick enumeration over large sets of AWS instances and services. This tool was later implemented
        into Pacu as a passive scanning feature." 
        imageUrl="https://s3-us-west-2.amazonaws.com/ruse.tech/imgs/public/aws_loot.png" 
        githubUrl="https://github.com/seb1055/AWS-Loot" 
        projectUrl="https://github.com/RhinoSecurityLabs/pacu/commit/4fdc0409046f10ee93c33e3413a76cdba6877339">
      </Card>

      <Card  
        title="RDS Spy" 
        description="A python program to track analyz publicly exposed RDS snapshots. RDS Spy polls for public snapshots and automates the restore/build process, once restored the DB tables are analyzed. This research resulted in direct disclosure of ~450k user accounts, payment info, and personal information.
        The code for this project is unreased...for now." 
        imageUrl="https://s3-us-west-2.amazonaws.com/ruse.tech/imgs/public/rds.png" 
        githubUrl="" 
        projectUrl="">
      </Card>


      



    </div>
  )
}

export default Projects;

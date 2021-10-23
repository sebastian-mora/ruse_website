import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {getGithubRepos} from '../../api/githubApi'

import style from './index.module.css'

const Projects = () => {

      // store the blogs from the api in blogs
  const [repos, setRepos] = useState([]);


  useEffect(() => {
    getGithubRepos()
      .then(res => {
        let repos = res.data.filter(repo => repo.owner.login === "sebastian-mora")

        setRepos(repos.sort((a,b) => {return b.stargazers_count - a.stargazers_count}))
      })
  }, []);

  return (
    <div >
        <p>

            {
                repos.map((repo) => {
                    return (
                        <div>
                            <h3>{repo.name}</h3>
                            <p>Stars: {repo.stargazers_count}</p>
                            <p>{repo.description}</p>
                            <a href={repo.url}>Github</a>
                        </div>
                    )
                })
            }  
                
        </p>
    </div>
  )
}

export default Projects;

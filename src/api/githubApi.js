import axios from 'axios';



export const api = axios.create()

export function getGithubRepos(slug){
  return api.get(`https://api.github.com/users/sebastian-mora/repos`)
}





import axios from 'axios';


export default function setAuthToken(token){
  if(token){
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    console.log("SETTING");
    
  } else{
    console.log("DELETING");
    
    delete axios.defaults.headers.common['Authorization'];
  }
}
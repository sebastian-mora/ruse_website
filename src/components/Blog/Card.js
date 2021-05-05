import React from 'react';
import {Link} from 'react-router-dom';
import style from './Card.module.css'


const Card = ({blog}) => {

  let {title, description, datePosted, id, tags, previewImageUrl} = blog
  return (

    <Link className={style.link} to={`blogs/${id}`}> 
      <div className={style.card}>
        <h1 className={style.title}>{title}</h1>
        <p className={style.postDate}>Date: {datePosted}</p>

        <div className={style.tagGroup}>
          {tags.map((tag, _) => {
            return( 
                <p className={style.tag}>{tag}</p>
            ) 
          })}
        </div>

        <img className={style.blogImage} src={`https://via.placeholder.com/468x60?text=${title}"`}></img>
        <p className={style.description}> {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}</p>
      </div>
    </Link>

  )
}

export default Card;

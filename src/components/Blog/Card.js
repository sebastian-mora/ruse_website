import React from 'react';
import {Link} from 'react-router-dom';
import style from './Card.module.css'


const Card = ({blog}) => {

  let {title, description, datePosted, id, tags, previewImageUrl} = blog
  return (

    <Link className={style.link} to={id}> 
      <div className={style.card}>

        <img className={style.blogImage} alt="Blog Preview" src={previewImageUrl || "https://cdn.ruse.tech/assets/ruse-200x200.png"}></img>
        <div className={style.text}>
          <h1 className={style.title}>{title}</h1>
          <p className={style.postDate}>{datePosted}</p>

          <p className={style.description}> {description}</p>

          <div className={style.tagGroup}>
            {tags.map((tag, _) => {
              return( 
                  <p className={style.tag}>{tag}</p>
              ) 
            })}
          </div>
        </div>
        
      </div>
    </Link>

  )
}

export default Card;

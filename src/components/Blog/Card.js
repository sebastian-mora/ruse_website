import React from 'react';
import { Link } from 'react-router-dom';
import style from './Card.module.css'


const Card = ({ blog }) => {

  let { title, description, dateposted, tags, previewimageurl } = blog.metadata
  return (


    <div className={style.card}>
      <Link className={style.link} to={blog.id}>

        <img className={style.blogImage} alt="Blog Preview" src={previewimageurl || "https://cdn.ruse.tech/assets/ruse-200x200.png"}></img>

        <div className={style.text}>
          <h1 className={style.title}>{title}</h1>
          <p className={style.postDate}>{dateposted}</p>

          <p className={style.description}> {description}</p>

          <div className={style.tagGroup}>
            {tags.map((tag, _) => {
              return (
                <p className={style.tag}>{tag}</p>
              )
            })}
          </div>
        </div>

      </Link>

    </div>



  )
}

export default Card;

import React, { useState, useEffect } from 'react';

import style from './Scroller.module.css'

const Scroller = () => {


  // Generate the 4 random letters

  const seedLetters = (string_length) => {
    let random_array = []
    let random_ascii;
    let ascii_low = 65;
    let ascii_high = 90

    for (let i = 0; i < string_length; i++) {
      random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
      random_array.push(random_ascii)
    }
    return random_array
  }

  // What we want to crack 
  // const match_letters = [114, 117 , 115 , 101]
  const match_letters = [82, 85, 83, 69]

  // Create the state and init the letter
  const [letters, setLetters] = useState(seedLetters(4));
  const [completed, setCompleted] = useState(false);


  useEffect(() => {
    setTimeout(() => {   
      if(!completed){
        setLetters(crack())
      }
      if (letters.toString() === match_letters.toString()){
        setCompleted(true);
        return
      }
    }, 100);
  });

  const crack = () => {

    const new_letters = []
    letters.forEach((letter, i) => {

      if (letter === match_letters[i]) {
        new_letters.push(letter)
        return
      }
      var new_char = letter - 1;
      if (new_char < 65) {
        new_char = 90
      }
      new_letters.push(new_char)
    })
    return new_letters
  }

  return (
    <div className={style.crypto}>
      <ul className={style.crypto}>
        {letters.map((letter, i) => <li className={style.crypto} key={i}>{String.fromCharCode(letter)}</li>)}
      </ul>
    </div>
  );
}

export default Scroller;


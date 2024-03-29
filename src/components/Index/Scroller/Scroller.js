import React, { useState, useEffect } from "react";
import style from "./Scroller.module.css";

const Scroller = ({ text }) => {
  const stringToAsciiArray = (inputString) =>
    inputString.split("").map((char) => char.charCodeAt());

  const asciiLow = 48;
  const asciiHigh = 90;
  const matchLetters = stringToAsciiArray(text); // "RUSE" in ASCII
  const animationDelay = 50; // Set the animation delay in milliseconds

  const getRandomAscii = () => {
    return Math.floor(Math.random() * (asciiHigh - asciiLow) + asciiLow);
  };

  const seedLetters = () => {
    return Array(matchLetters.length)
      .fill()
      .map(() => getRandomAscii());
  };

  const [letters, setLetters] = useState(seedLetters());
  const [completed, setCompleted] = useState(false);

  const crack = () => {
    return letters.map((letter, i) => {
      if (letter === matchLetters[i]) {
        return letter;
      }
      let newChar = letter - 1;
      if (newChar < asciiLow) {
        newChar = asciiHigh;
      }
      return newChar;
    });
  };

  useEffect(() => {
    if (!completed) {
      // Add a time delay using setTimeout
      const timeoutId = setTimeout(() => {
        setLetters(crack());
        if (letters.toString() === matchLetters.toString()) {
          setCompleted(true);
        }
      }, animationDelay);

      return () => {
        // Clear the timeout when the component unmounts or re-renders
        clearTimeout(timeoutId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letters, completed, animationDelay]);

  return (
    <div className={style.container}>
      <ul className={style.crypto}>
        {letters.map((letter, i) => (
          <li className={style.crypto} key={i}>
            {String.fromCharCode(letter)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scroller;

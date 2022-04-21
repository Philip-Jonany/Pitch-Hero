import './App.css';
import styled from "styled-components";
import { useEffect, useState } from "react";

const BIBBY_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;

function App() { 
  const [bibbyPosition, setBibbyPosition] = useState(250);

  useEffect(() => {
    let timeID;
    if (birdPosition < GAME_HEIGHT - BIRD_SIZE) {
      timeID = setInterval(() => {
        setBibbyPosition(birdPosition => birdPosition + GRAVITY);
      }, 24);
    }
    return () => {
      clearInterval(timeId);
    };
  });

  return (
    <Div>
      <GameBox height ={GAME_HEIGHT} width = {GAME_WIDTH}>
        <Bibby size = {BIBBY_SIZE} top = {bibbyPosition} />
      </GameBox>
    </Div>
  );
}

export default App;

const Bibby = styled.div`
  position:absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top:  ${(props) => props.size}px;
  border-radius = 50%;
`;

const Div = styled.div`
  display:flex;
  width:100%;
  justify-content:center;
`

const GameBox = styled.div`
  height:  ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: deepskyblue;
`


// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
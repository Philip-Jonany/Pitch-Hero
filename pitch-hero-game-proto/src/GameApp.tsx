import { useEffect, useState } from 'react';
import "./Game.css";
import Game from "./Game";
import { GameInfo, GamePhase } from './GameTypes';

function GameApp() {
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.8);
  const [canvasHeight, setCanvasHeight] = useState(250);
  const [gameInput, setGameInput] = useState(50);

  const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameInput(parseInt(e.target.value));
  }

  const onPhaseChanged = (lastPhase: GamePhase, newPhase: GamePhase, info: GameInfo) => {
    console.log(`Transitioned from ${lastPhase} to ${newPhase}`);
    switch (newPhase) {
      case GamePhase.INIT:
        break;
      case GamePhase.ALIVE:
        break;
      case GamePhase.DEAD:
        alert(`Player died! Passed ${info.score} pipes before dying!`)
        break;
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setCanvasHeight(250);
      setCanvasWidth(window.innerWidth * 0.8);
    }

    window.addEventListener('resize', handleResize);
  });

  return (
    <div className="Game-App">
      <Game 
        width={ canvasWidth }
        height={ canvasHeight }
        input={ gameInput }
        onPhaseChangeCallback={ onPhaseChanged }
      />
      <input type="number" min={ 0 } max={ 100 } value={ gameInput } onChange={ onInputChanged }/>
    </div>
  );
}

export default GameApp;

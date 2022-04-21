import { useEffect, useState } from 'react';
import "./Game.css";
import Game from "./Game";
import { GameInfo, GamePhase } from './GameTypes';

interface GameAppProps {
  onInit?(): void,
  onDeath?(info: GameInfo): void
}

function GameApp(props: GameAppProps) {
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.8);
  const [canvasHeight, setCanvasHeight] = useState(250);
  const [gameInput, setGameInput] = useState(50);

  const [currentPhase, setCurrentPhase] = useState(GamePhase.INIT);
  const [pauseInfo, setPauseInfo] = useState<{paused: boolean, previous: GamePhase}>({ paused: false, previous: GamePhase.INIT});
  const [requestedPhase, setRequestedPhase] = useState<GamePhase | null>(null);

  const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameInput(parseInt(e.target.value));
  }

  const onPhaseChanged = (lastPhase: GamePhase, newPhase: GamePhase, info: GameInfo) => {
    console.log(`Transitioned from ${lastPhase} to ${newPhase}`);
    
    if (newPhase === requestedPhase) {
      // our request has been answered
      setRequestedPhase(null);
    }

    setCurrentPhase(newPhase);

    switch (newPhase) {
      case GamePhase.INIT:
        props.onInit?.();
        break;
      case GamePhase.ALIVE:
        break;
      case GamePhase.DEAD:
        // alert(`Player died! Passed ${info.score} pipes before dying!`)
        props.onDeath?.(info);
        break;
      case GamePhase.PAUSED:
        break;
    }
  }

  const onResetClicked = () => {
    setRequestedPhase(GamePhase.INIT);
  }

  const onPauseClicked = () => {
    if (currentPhase !== GamePhase.PAUSED) {
      setRequestedPhase(GamePhase.PAUSED);
    } else {
      setRequestedPhase(GamePhase.UNPAUSED);
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
        requestedPhase={ requestedPhase }
        onPhaseChangeCallback={ onPhaseChanged }
      />
      <input type="number" min={ 0 } max={ 100 } value={ gameInput } onChange={ onInputChanged }/>
      <button onClick={ onResetClicked }>Reset game</button>
      <button onClick={ onPauseClicked }> {currentPhase === GamePhase.PAUSED? "Unpause" : "Pause"} game</button>
    </div>
  );
}

export default GameApp;

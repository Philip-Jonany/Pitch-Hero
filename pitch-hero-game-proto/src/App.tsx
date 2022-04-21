import { useEffect, useState } from 'react';
import './App.css';

import Game from "./Game";

function App() {
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.8);
  const [canvasHeight, setCanvasHeight] = useState(250);
  const [gameInput, setGameInput] = useState(50);

  const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>)=> {
    setGameInput(parseInt(e.target.value));
  }

  useEffect(() => {
    const handleResize = () => {
      setCanvasHeight(250);
      setCanvasWidth(window.innerWidth * 0.8);
    }

    window.addEventListener('resize', handleResize);
  });

  return (
    <div className="App">
      <Game 
        width={ canvasWidth }
        height={ canvasHeight }
        input={ gameInput }
      />
      <input type="number" min={ 0 } max={ 100 } value={ gameInput } onChange={ onInputChanged }/>
    </div>
  );
}

export default App;

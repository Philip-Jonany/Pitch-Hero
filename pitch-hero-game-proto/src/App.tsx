import { useState } from 'react';
import './App.css';

import Game from "./Game";

function App() {
  const [gameInput, setGameInput] = useState(50);

  const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>)=> {
    setGameInput(parseInt(e.target.value));
  }

  return (
    <div className="App">
      <Game input={ gameInput }/>
      <input type="number" min={0} max={100} value={ gameInput } onChange={ onInputChanged }/>
    </div>
  );
}

export default App;

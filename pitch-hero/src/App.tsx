import './App.css';
import styled from "styled-components";
import { useEffect, useState } from "react";
import AudioContext from "./contexts/AudioContext";
import autoCorrelate from "./libs/AutoCorrelate";

const BIBBY_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;

const audioCtx = AudioContext.getAudioContext();
const analyserNode = AudioContext.getAnalyser();
const buflen = 2048;
var buf = new Float32Array(buflen);

function App() { 
  const [bibbyPosition, setBibbyPosition] = useState(250);

  const [source, setSource] = useState<any|null>(null);
  const [started, setStart] = useState(false);
  const [pitchNote, setPitchNote] = useState("C");
  const [pitchScale, setPitchScale] = useState("4");
  const [pitch, setPitch] = useState("0 Hz");
  const [detune, setDetune] = useState("0");
  const [notification, setNotification] = useState(false);

  const updatePitch = (time) => {
    analyserNode.getFloatTimeDomainData(buf);
    var ac = autoCorrelate(buf, audioCtx.sampleRate);
    if (ac > -1) {
      // let note = noteFromPitch(ac);
      // let sym = noteStrings[note % 12];
      // let scl = Math.floor(note / 12) - 1;
      // let dtune = centsOffFromPitch(ac, note);
      setPitch(ac.toFixed(2) + " Hz");
      // setPitchNote(sym);
      // setPitchScale(scl);
      // setDetune(dtune);
      setNotification(false);
      // console.log(note, sym, scl, dtune, ac);
    }
  };

  useEffect(() => {
    if (source != null) {
      source!.connect(analyserNode);
    }
    let timeID;
    if (bibbyPosition < GAME_HEIGHT - BIBBY_SIZE) {
      timeID = setInterval(() => {
        setBibbyPosition(bibbyPosition => bibbyPosition + GRAVITY);
      }, 24);
    }
  },[source]);

  setInterval(updatePitch, 1);

  const start = async () => {
    const input = await getMicInput();

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
    setStart(true);
    setNotification(true);
    setTimeout(() => setNotification(false), 5000);
    setSource(audioCtx!.createMediaStreamSource(input));
  };

  const stop = () => {
    source!.disconnect(analyserNode);
    setStart(false);
  };

  const getMicInput = () => {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0,
      },
    });
  };

  const Bibby = styled.div`
  position:absolute;
  background-color: red;
  height: ${(props:any) => props.size}px;
  width: ${(props:any) => props.size}px;
  top:  ${(props:any) => props.size}px;
  border-radius = 50%;
`;

const Div = styled.div`
  display:flex;
  width:100%;
  justify-content:center;
`

const GameBox = styled.div`
  height:  ${(props:any) => props.height}px;
  width: ${(props:any) => props.width}px;
  background-color: deepskyblue;
`

  return (
    <Div>
      {!started ? (
          <button
            
            onClick={start}
          >
            Start
          </button>
        ) : (
          <button
            className="bg-red-800 text-white w-20 h-20 rounded-full shadow-xl transition-all"
            onClick={stop}
          >
            Stop
          </button>
          
        )}
        <div className="mt-2 text-xs text-gray-400">
            <span>{pitch}</span>
          </div>
      <GameBox height ={GAME_HEIGHT} width = {GAME_WIDTH}>
        <Bibby size = {BIBBY_SIZE} top = {bibbyPosition} />
      </GameBox>
      
    </Div>
    
  );
}

export default App;
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

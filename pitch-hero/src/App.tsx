import './App.css';
import styled from "styled-components";
import { useEffect, useState } from "react";
import AudioContextFunction from "./contexts/AudioContext";
import autoCorrelate from "./libs/AutoCorrelate";
const BIBBY_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;
const AudioContext = new AudioContextFunction();
const audioCtx = AudioContext.getAudioContext();
const analyserNode = AudioContext.getAnalyser();
const buflen = 2048;
var buf = new Float32Array(buflen);


function App() { 
  const [bibbyPosition, setBibbyPosition] = useState(250);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);
  const [source, setSource] = useState<any|null>(null);
  const [started, setStart] = useState(false);
  // const [pitchNote, setPitchNote] = useState("C");
  // const [pitchScale, setPitchScale] = useState("4");
  const [pitch, setPitch] = useState(0);
  // const [detune, setDetune] = useState("0");
  // const [notification, setNotification] = useState(false);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  const updatePitch = (time) => {
    analyserNode.getFloatTimeDomainData(buf);
    console.log(buf);
    var ac = autoCorrelate(buf, audioCtx.sampleRate);
    if (ac > -1) {
      // let note = noteFromPitch(ac);
      // let sym = noteStrings[note % 12];
      // let scl = Math.floor(note / 12) - 1;
      // let dtune = centsOffFromPitch(ac, note);
      setPitch(ac);
      setBibbyPosition(pitch);
      // setPitchNote(sym);
      // setPitchScale(scl);
      // setDetune(dtune);
      // setNotification(false);
      // console.log(note, sym, scl, dtune, ac);
    }
  };



  useEffect(() => {
    if (source != null) {
      source!.connect(analyserNode);
    }
    let timeId;
    if (started ) {

    // if (started && bibbyPosition < GAME_HEIGHT - BIBBY_SIZE) {
      timeId = setInterval(() => {
        setBibbyPosition((bibbyPosition) => pitch);
        setBibbyPosition((bibbyPosition) => bibbyPosition - GRAVITY);
      }, 24);
    }
    return () => {
      clearInterval(timeId);
    };
  }, [source, started, bibbyPosition, pitch]);

  // for obstacles
  useEffect(() => {
    let obstacleId;
    if (started && obstacleLeft >= -OBSTACLE_WIDTH) {
    // if (started && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 24);
      return () => {
        clearInterval(obstacleId);
      };
    }
    else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
      );
    }
  }, [obstacleLeft, setObstacleLeft, started]);


  setInterval(updatePitch, 1);

  const start = async () => {
    const input = await getMicInput();

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
    setStart(true);
    setScore(10);
    // setNotification(true);
    // setTimeout(() => setNotification(false), 5000);
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
        <Obstacle 
          top = {0}
          width = {OBSTACLE_WIDTH} 
          height={obstacleHeight}
          left={obstacleLeft}
        />
        <Obstacle
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
          width={OBSTACLE_WIDTH}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />
        <Bibby size = {BIBBY_SIZE} top = {bibbyPosition} />
      </GameBox>
      <span> {score} </span>
    </Div>
    
  );
}

export default App;

const Bibby = styled.div`
position:absolute;
background-color: red;
height: ${(props:any) => props.size}px;
width: ${(props:any) => props.size}px;
top:  ${(props:any) => props.top}px;
border-radius = 50%;
`;

const Div = styled.div`
  display:flex;
  width:100%;
  justify-content:center;
  & span{
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  height:  ${(props:any) => props.height}px;
  width: ${(props:any) => props.width}px;
  background-color: deepskyblue;
  overflow:hidden;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props: any) => props.top}px;
  background-color:green;
  width: ${(props: any) => props.width}px;
  height: ${(props: any) => props.height}px;
  left: ${(props: any) => props.left}px;
`;
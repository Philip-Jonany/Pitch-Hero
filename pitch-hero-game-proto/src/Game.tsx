import React from "react";
import { Component } from "react";
import GameTimer from "./GameTimer";

interface GameProps {
  input: number    // height input from outside the game
}

interface GameState {
  blockX : number,
  blockY : number
}

const height = 250;

class Game extends Component<GameProps, GameState> {
  canvas: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);
    this.state = {
      blockX: 0,
      blockY: 0
    }

    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.initGame()
  }

  componentDidUpdate() {
  }

  // game startup/reset; run once when game starts up/resets
  initGame = () => {
    this.setState({
      blockX: 0
    });
  }

  // game tick, called once every frame
  tickGame = (dt : number) => {
    this.setState({
      blockX: this.state.blockX + dt * 10,
      blockY: height * (1 - this.props.input / 100.0)
    });
  }

  // render canvas, called every frame after tickGame
  drawGame = (dt: number) => {
    let canvas = this.canvas.current;
    if (canvas === null) throw Error("No canvas ref");

    let ctx = canvas.getContext("2d");
    if (ctx === null) throw Error("No valid graphics context");

    canvas.width = window.innerWidth * 0.8;
    canvas.height = height;

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const rectWidth = 10;
    const rectHeight = 10;

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.fillRect(this.state.blockX - rectWidth / 2, this.state.blockY - rectHeight / 2, rectWidth, rectHeight);
  }

  render() {
    return (
      <div className="game">
        <GameTimer
          onTickCallback = { this.tickGame }
          postTickCallback = { this.drawGame }
        />
        <p>X position: { Math.floor(this.state.blockX) }</p>
        <p>Y position: { Math.floor(this.state.blockY) }</p>
        <button onClick={ this.initGame }>Reset game</button>
        <canvas className="gameCanvas" ref={ this.canvas }/>
      </div>
    );
  }
}

export default Game;

import React from "react";
import { Component } from "react";
import GameTimer from "./GameTimer";
import { GameEntity, PipeEntity, PlayerEntity } from "./GameEntities";

enum GamePhase {
  INIT,
  ALIVE,
  DEAD
}

interface GameProps {
  width: number,
  height: number,
  input: number
}

interface GameState {
  phase: GamePhase,
  entities: GameEntity[],
  player: PlayerEntity | null
  sinceLastPipe: number
}

class Game extends Component<GameProps, GameState> {
  canvas: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);
    this.state = {
      phase: GamePhase.INIT,
      entities: [],
      player: null,
      sinceLastPipe: 0
    }

    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.initGame()
  }

  componentDidUpdate() {
  }

  getInputFunc = () => this.props.input;

  // game startup/reset; run once when game starts up/resets
  initGame = () => {
    // this.setState({ phase: GamePhase.INIT });
    this.transitionPhase(GamePhase.INIT);
  }

  transitionPhase = (nextPhase: GamePhase) => {
    // todo: also call the relevant callbacks so the rest of the app can know
    this.setState({ phase: nextPhase }, () => {
      switch (this.state.phase) {
        case GamePhase.INIT:
          console.log("Transition to INIT");
          // onInitPhase
          break;
        case GamePhase.ALIVE:
          console.log("Transition to ALIVE");
          // onAlivePhase
          break;
        case GamePhase.DEAD:
          console.log("Transition to DEAD");
          // onDeadPhase
          break;
      }
    });
  }

  // game tick, called once every frame
  // dt: time in seconds since last frame
  tickGame = (dt : number) => {
    let player: PlayerEntity;
    let entities: GameEntity[];
    switch(this.state.phase) {
      case GamePhase.INIT:
        // start updating game on the next frame
        player = new PlayerEntity(this.getInputFunc);
        entities = [];
        entities.push(player);
        entities.push(new PipeEntity(50, 5, 20));

        this.setState({
          entities: entities,
          player: player,
          sinceLastPipe: 0
        }, () => console.log(this.state));
        this.transitionPhase(GamePhase.ALIVE);
        break;

      case GamePhase.ALIVE:
        // check to make sure the player hasn't died
        player = this.state.player!;  // player is definitely not null
        entities = this.state.entities;
        if (this.state.entities.some((e: GameEntity) => e.name === "pipe" && (e as PipeEntity).inDangerZone(player.x, player.y))) {
          // there's at least one pipe we're in the danger zone of, we died :(
          this.transitionPhase(GamePhase.DEAD);
          break;
        }
        
        // check to see how long it's been since we spawned a pipe; if it's been 3 seconds, spawn a new pipe
        let sinceLastPipe = this.state.sinceLastPipe;
        if (sinceLastPipe > 3) {
          this.state.entities.push(new PipeEntity(Math.random() * 60 + 20, 5, 20));
          sinceLastPipe = 0;
        }
        this.setState({sinceLastPipe: sinceLastPipe + dt});
        
        // tick each entity
        this.state.entities.map((e: GameEntity) => {
          e.tick(dt);
          return e;
        });

        // queue a setstate, and remove any entities that should be dead
        this.setState({
          entities: this.state.entities.filter((e: GameEntity) => !e.shouldRemove())
        });
        break;

      case GamePhase.DEAD:
        // sit forever without doing any special ticking, we're dead lol
        break;
    }
  }

  // render canvas, called every frame after tickGame
  // note: DON'T do any setState in here
  drawGame = (dt: number) => {
    let canvas = this.canvas.current;
    let ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      canvas.width = this.props.width;
      canvas.height = this.props.height;
  
      // background
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      this.state.entities.map((e: GameEntity) => {
        e.draw(dt, canvas!, ctx!);
        return e;
      });
    }
  }

  render() {
    return (
      <div className="game">
        <GameTimer
          onTickCallback = { this.tickGame }
          postTickCallback = { this.drawGame }
        />
        <p>Game Phase: { this.state.phase }</p>
        <p>X position: { this.state.player?.x }</p>
        <p>Y position: { this.state.player?.y }</p>
        <button onClick={ this.initGame }>Reset game</button>
        <canvas className="gameCanvas" ref={ this.canvas }/>
      </div>
    );
  }
}

export default Game;

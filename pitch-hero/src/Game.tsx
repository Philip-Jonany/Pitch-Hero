import { Component } from "react";

interface GameState {

}

class Game extends Component<{}, GameState> {
  constructor(props: any) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (<div><p>this is a game, believe it or not</p></div>);
  }
}
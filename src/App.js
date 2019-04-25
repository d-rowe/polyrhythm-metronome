import React from "react";
import Geometry from "./components/Geometry";
import "bulma/css/bulma.css";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sides1: 3,
      sides2: 4,
      playing: true
    };
  }

  handleClick = e => {
    this.setState({ playing: !this.state.playing });
  };

  handleSides1 = e => {
    this.setState({ sides1: parseInt(e.target.value) });
  };

  handleSides2 = e => {
    this.setState({ sides2: parseInt(e.target.value) });
  };

  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column vCenter">
              <input
                onInput={this.handleSides1}
                className="input"
                type="number"
                defaultValue="3"
                min="3"
                max="100000"
              />
              <input
                onInput={this.handleSides2}
                className="input"
                type="number"
                defaultValue="4"
                min="3"
                max="100000"
              />
              <button onClick={this.handleClick} className="button is-info">
                {this.state.playing ? "Stop" : "Play"}
              </button>
            </div>
            <div className="column is-three-fifths">
              <Geometry playing={this.state.playing} sides1={this.state.sides1} sides2={this.state.sides2} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default App;

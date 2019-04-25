import React from "react";
import Geometry from "./components/Geometry";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.sides1 = 3;
    this.sides2 = 4;
    this.state = {
      tempo: 100,
      sides1: this.sides1,
      sides2: this.sides2,
      playing: false
    };
  }

  handleStop = () => {
    this.setState({ playing: false });
  };

  handleClick = e => {
    this.setState({ playing: !this.state.playing });
  };

  handleTempo = e => {
    this.setState({ tempo: parseInt(e.target.value) });
  };

  handleSides1 = e => {
    this.sides1 = parseInt(e.target.value);
    if (this.sides1 < 3) {
      this.refs.sides1.value = 3;
      this.sides1 = 3;
      this.setState({ sides1: 3 });
    } else {
      this.setState({ sides1: this.sides1 });
      if (this.sides1 >= this.sides2) {
        this.sides2 = this.sides1 + 1;
        this.refs.sides2.value = this.sides2;
        this.setState({ sides2: this.sides2 });
      }
    }
  };

  handleSides2 = e => {
    this.sides2 = parseInt(e.target.value);
    if (this.sides2 < 4) {
      this.refs.sides2.value = 4;
      this.sides2 = 4;
      this.setState({ sides2: 4 });
    } else {
      this.setState({ sides2: this.sides2 });
      if (this.sides2 <= this.sides1) {
        this.sides1 = this.sides1 - 1;
        this.refs.sides1.value = this.sides1;
        this.setState({ sides1: this.sides1 });
      }
    }
  };

  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column vCenter">
              <div className="box shadow">
              <div className="bar">
              <h6 class="title is-6">polyrhythms</h6>
              {/* <br/>
              <h6 class="subtitle is-6">metronome</h6> */}
              </div>
                <div className="bar">
                  <p className="paditem">tempo</p>
                  <input
                    onInput={this.handleTempo}
                    className="input paditem"
                    type="number"
                    defaultValue="100"
                    min="3"
                    max="1000"
                  />
                  <button onClick={this.handleClick} className="button is-info paditem">
                    {this.state.playing ? (
                      <i class="fas fa-stop" />
                    ) : (
                      <i class="fas fa-play" />
                    )}
                  </button>
                </div>
                <div className="bar">
                  <input
                    ref="sides2"
                    onInput={this.handleSides2}
                    className="input is-info"
                    type="number"
                    defaultValue="4"
                    min="3"
                    max="100000"
                  />
                  <input
                    ref="sides1"
                    onInput={this.handleSides1}
                    className="input is-danger"
                    type="number"
                    defaultValue="3"
                    min="3"
                    max="100000"
                  />
                </div>
              </div>
            </div>
            <div className="column is-three-fifths">
              <Geometry
                tempo={this.state.tempo}
                playing={this.state.playing}
                sides1={this.state.sides1}
                sides2={this.state.sides2}
                handleStop={this.handleStop.bind(this)}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default App;

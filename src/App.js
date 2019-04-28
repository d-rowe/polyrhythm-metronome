import React from "react";
import Geometry from "./components/Geometry";
import Sampler from "./audio/Sampler";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.sampler = new Sampler();
    this.sides1 = 3;
    this.sides2 = 4;
    this.state = {
      tempo: 100,
      sides1: this.sides1,
      sides2: this.sides2,
      playing: false,
    };
  }

  keyTempo = e => {
    if (e.keyCode === 13) {
      this.handleTempo(e);
    }
  };

  keySides1 = e => {
    if (e.keyCode === 13) {
      this.handleSides1(e);
    }
  };

  keySides2 = e => {
    if (e.keyCode === 13) {
      this.handleSides2(e);
    }
  };

  handleStop = () => {
    this.setState({ playing: false });
  };

  handleClick = e => {
    this.setState({ playing: !this.state.playing });
  };

  handleTempo = e => {
    if (e.target.value > 1000) {
      e.target.value = 1000;
    }
    if (e.target.value < 20) {
      e.target.value = 20;
    }
    if (e.target.value !== "") {
      this.setState({ tempo: parseInt(e.target.value) });
    }
  };

  handleSides1 = e => {
    if (e.target.value >= 1000) {
      e.target.value = 999;
    }
    if (e.target.value >= 3) {
      if (e.target.value !== "") {
        this.sides1 = parseInt(e.target.value);
        this.setState({ sides1: this.sides1 });
        if (this.sides1 >= this.sides2) {
          this.sides2 = this.sides1 + 1;
          this.refs.sides2.value = this.sides2;
          this.setState({ sides2: this.sides2 });
        }
      }
    } else {
      this.refs.sides1.value = 3;
      this.sides1 = 3;
      this.setState({ sides1: 3 });
    }
  };

  handleSides2 = e => {
    if (e.target.value > 1000) {
      e.target.value = 1000;
    }
    if (e.target.value >= 4) {
      if (e.target.value !== "") {
        this.sides2 = parseInt(e.target.value);
        this.setState({ sides2: this.sides2 });
        if (this.sides2 <= this.sides1) {
          this.sides1 = this.sides2 - 1;
          this.refs.sides1.value = this.sides1;
          this.setState({ sides1: this.sides1 });
        }
      }
    } else {
      this.refs.sides2.value = 4;
      this.sides2 = 4;
      this.setState({ sides2: 4 });
      if (this.sides2 <= this.sides1) {
        this.sides1 = this.sides2 - 1;
        this.refs.sides1.value = this.sides1;
        this.setState({ sides1: this.sides1 });
      }
    }
  };

  render() {
    return (
      <div className="row">
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column vCenter">
                <div className="box shadow">
                  <div className="bar">
                    <h6 className="title is-6">polyrhythm metronome</h6>
                  </div>
                  <div className="bar">
                    <p className="paditem">tempo</p>
                    <input
                      onBlur={this.handleTempo}
                      onKeyDown={this.keyTempo}
                      className="input paditem"
                      type="number"
                      defaultValue="100"
                      min="3"
                      max="1000"
                    />
                    <button
                      onClick={this.handleClick}
                      className="button is-info paditem"
                    >
                      {this.state.playing ? (
                        <i className="fas fa-stop" />
                      ) : (
                        <i className="fas fa-play" />
                      )}
                    </button>
                  </div>
                  <div className="bar">
                    <input
                      ref="sides2"
                      onBlur={this.handleSides2}
                      onKeyDown={this.keySides2}
                      className="input is-info side"
                      type="number"
                      defaultValue="4"
                      // min="3"
                      // max="100000"
                    />
                    <input
                      ref="sides1"
                      onBlur={this.handleSides1}
                      onKeyDown={this.keySides1}
                      className="input is-danger side"
                      type="number"
                      defaultValue="3"
                      // min="3"
                      // max="100000"
                    />
                  </div>
                </div>
              </div>
              <div className="column is-three-fifths">
                <Geometry
                  sampler={this.sampler}
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
      </div>
    );
  }
}

export default App;

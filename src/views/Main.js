import React from "react";
import PlayButton from "../components/PlayButton";
import Geometry from "../components/Geometry";
import Sampler from "../audio/sampler";
import { connect } from "react-redux";
import SubdivisionInput from "../components/SubdivisionInput";

class Main extends React.Component {
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
      blueMute: false,
      redMute: false
    };
  }

  toggleBlue = () => {
    if (this.state.blueMute) {
      this.sampler.blueClick.volume.value = 0;
    } else {
      this.sampler.blueClick.volume.value = -100;
    }
    let blueMute = !this.state.blueMute;
    this.setState({ blueMute: blueMute });
    this.props.setMute("outside", !this.props.mute.outside);
  };

  toggleRed = () => {
    if (this.state.redMute) {
      this.sampler.redClick.volume.value = 0;
    } else {
      this.sampler.redClick.volume.value = -100;
    }
    let redMute = !this.state.redMute;
    this.setState({ redMute: redMute });
    this.props.setMute("inside", !this.props.mute.inside);
  };

  keyTempo = e => {
    if (e.keyCode === 13) {
      this.handleTempo(e);
    }
  };

  onOutsideSubKeyDown = e => {
    if (e.keyCode === 13) {
      this.handleSides1(e);
    }
  };

  onInsideSubKeyDown = e => {
    if (e.keyCode === 13) {
      this.handleSides2(e);
    }
  };

  handleStop = () => {
    this.setState({ playing: false });
    this.props.setPlay(false);
  };

  handleClick = e => {
    this.setState({ playing: !this.state.playing });
    this.props.setPlay(!this.props.play);
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
      this.props.setTempo(e.target.value);
    }
  };

  handleSides1 = e => {
    if (e.target.value >= 1000) {
      e.target.value = 999;
    }
    if (e.target.value >= 3) {
      if (e.target.value !== "") {
        this.sides1 = parseInt(e.target.value);
        const insideSub = parseInt(e.target.value);
        this.props.setSubdivision("inside", insideSub);
        this.setState({ sides1: this.sides1 });
        if (this.sides1 >= this.sides2) {
          this.sides2 = this.sides1 + 1;
          const outsideSub = this.props.subdivision.inside + 1;
          this.props.setSubdivision("outside", outsideSub);
          this.refs.sides2.value = this.sides2;
          this.setState({ sides2: this.sides2 });
        }
      }
    } else {
      this.refs.sides1.value = 3;
      this.sides1 = 3;
      this.setState({ sides1: 3 });
      this.props.setSubdivision("inside", 3);
    }
  };

  handleSides2 = e => {
    if (e.target.value > 1000) {
      e.target.value = 1000;
    }
    if (e.target.value >= 4) {
      if (e.target.value !== "") {
        this.sides2 = parseInt(e.target.value);
        const outsideSub = parseInt(e.target.value);
        this.props.setSubdivision("outside", outsideSub);
        this.setState({ sides2: this.sides2 });
        if (this.sides2 <= this.sides1) {
          this.sides1 = this.sides2 - 1;
          const insideSub = this.props.subdivision.outside - 1;
          this.props.setSubdivision("inside", insideSub);
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
        this.props.setSubdivision("outside", 4);
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
                <div className="box shadow has-text-centered">
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
                    <PlayButton />
                  </div>
                  <div className="bar">
                    <div className="polybar">
                      <div className="bar">
                        <SubdivisionInput side="outside" />
                        <button
                          className="button toggleButton"
                          onClick={this.toggleBlue}
                        >
                          <i
                            className={
                              this.state.blueMute
                                ? "fas fa-volume-mute"
                                : "fas fa-volume-up"
                            }
                          />
                        </button>
                      </div>
                      <div className="bar">
                      <SubdivisionInput side="inside" />
                        <button
                          className="button toggleButton"
                          onClick={this.toggleRed}
                        >
                          <i
                            className={
                              this.state.redMute
                                ? "fas fa-volume-mute"
                                : "fas fa-volume-up"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <br />
                  <p>
                    &copy; 2019{" "}
                    <a href="https://danielrowetech.com">daniel rowe</a>
                  </p>
                </div>
              </div>
              <div className="column is-three-fifths">
                <Geometry
                  redMute={this.state.redMute}
                  blueMute={this.state.blueMute}
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

const mapStateToProps = state => {
  return {
    tempo: state.tempo,
    play: state.play,
    mute: state.mute,
    subdivision: state.subdivision
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTempo: tempo => {
      dispatch({ type: "SET_TEMPO", tempo: tempo });
    },
    setMute: (side, mute) => {
      dispatch({ type: "SET_MUTE", side: side, mute: mute });
    },
    setPlay: play => {
      dispatch({ type: "SET_PLAY", play: play });
    },
    setSubdivision: (side, subdivision) => {
      dispatch({
        type: "SET_SUBDIVISION",
        side: side,
        subdivision: subdivision
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);

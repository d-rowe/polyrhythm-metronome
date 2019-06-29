import React from "react";
import PlayButton from "../components/PlayButton";
import Geometry from "../components/Geometry";
import SubdivisionInput from "../components/SubdivisionInput";
import TempoInput from "../components/TempoInput";
import { connect } from "react-redux";

const Main = () => {
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
                  <TempoInput />
                  <PlayButton />
                </div>
                <div className="bar">
                  <div className="polybar">
                    <div className="bar">
                      <SubdivisionInput side="outside" />
                      <button
                        className="button toggleButton"
                        // onClick={this.toggleBlue}
                      >
                        <i
                          className={
                            true ? "fas fa-volume-mute" : "fas fa-volume-up"
                          }
                        />
                      </button>
                    </div>
                    <div className="bar">
                      <SubdivisionInput side="inside" />
                      <button
                        className="button toggleButton"
                        // onClick={this.toggleRed}
                      >
                        <i
                          className={
                            true ? "fas fa-volume-mute" : "fas fa-volume-up"
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
              <Geometry />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

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

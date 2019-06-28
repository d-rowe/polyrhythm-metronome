import React from "react";
import { connect } from "react-redux";

const PlayButton = ({ play, setPlay }) => {
  return (
    <button
      onClick={() => {
        setPlay(!play);
      }}
      className="button is-info paditem"
    >
      {play ? <i className="fas fa-stop" /> : <i className="fas fa-play" />}
    </button>
  );
};

const mapStateToProps = state => {
  return {
    play: state.play
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPlay: play => {
      dispatch({ type: "SET_PLAY", play: play });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayButton);

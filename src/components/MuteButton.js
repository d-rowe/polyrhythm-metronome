import React from "react";
import { connect } from "react-redux";

const MuteButton = ({ side, mute, setMute }) => {
  return (
    <button
      className="button toggleButton"
      onClick={() => setMute(side, !mute[side])}
    >
      <i className={mute[side] ? "fas fa-volume-mute" : "fas fa-volume-up"} />
    </button>
  );
};

const mapStateToProps = state => {
  return {
    mute: state.mute
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMute: (side, mute) => {
      dispatch({ type: "SET_MUTE", side: side, mute: mute });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MuteButton);

import React from "react";
import { connect } from "react-redux";

const TempoInput = ({ setTempo }) => {
  const onKeyDown = e => {
    if (e.keyCode === 13) {
      onChange(e);
    }
  };

  const onChange = e => {
    if (e.target.value > 999) {
      e.target.value = 999;
    }
    if (e.target.value < 20) {
      e.target.value = 20;
    }
    if (e.target.value !== "") {
      setTempo(parseInt(e.target.value));
    }
  };

  return (
    <input
      onKeyDown={onKeyDown}
      onBlur={onChange}
      className="input paditem"
      type="number"
      defaultValue="100"
      min="3"
      max="1000"
    />
  );
};

const mapDispatchToProps = dispatch => {
  return {
    setTempo: tempo => {
      dispatch({ type: "SET_TEMPO", tempo: tempo });
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(TempoInput);

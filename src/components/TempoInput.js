import React from "react";
import { connect } from "react-redux";

const TempoInput = ({ tempo, setTempo }) => {
  const [min, max] = [10, 999];

  const onKeyDown = e => {
    if (e.keyCode === 13) {
      onChange(e);
    }
  };

  const onChange = e => {
    if (e.target.value > max) {
      e.target.value = max;
    }
    if (e.target.value < min) {
      e.target.value = min;
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
      defaultValue={tempo}
    />
  );
};

const mapStateToProps = state => {
  return {
    tempo: state.tempo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTempo: tempo => {
      dispatch({ type: "SET_TEMPO", tempo: tempo });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TempoInput);

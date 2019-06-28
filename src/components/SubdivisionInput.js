import React from "react";
import { connect } from "react-redux";

const SubdivisionInput = ({ side, subdivision, setSubdivision }) => {

  const className =
    side === "outside" ? " is-info" : side === "inside" ? " is-danger" : null;

  const onKeyDown = e => {
    if (e.keyCode === 13) {
      onChange(e);
    }
  };

  const onChange = e => {
    const value = parseInt(e.target.value);
    setSubdivision(side, value);
  };

  return (
    <input
      onBlur={onChange}
      onKeyDown={onKeyDown}
      className={"input side" + className}
      type="number"
      defaultValue={subdivision[side]}
    />
  );
};

const mapStateToProps = state => {
  return {
    subdivision: state.subdivision
  };
};

const mapDispatchToProps = dispatch => {
  return {
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
)(SubdivisionInput);

import React from "react";
import { SET_SUBDIVISION } from "../../constants/actions";
import { connect } from "react-redux";

class SubdivisionInput extends React.Component {
  constructor(props) {
    super(props);
    this.side = this.props.side;
    this.setSubdivision = this.props.setSubdivision;
    this.className =
      this.side === "outside"
        ? " is-info"
        : this.side === "inside"
        ? " is-danger"
        : null;
  }

  componentDidUpdate() {
    this.refs.subInput.value = this.props.subdivision[this.side];
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.onChange(e);
    }
  };

  onBlur = e => {
    if (parseInt(e.target.value) !== this.props.subdivision[this.side]) {
      this.onChange(e);
    }
  };

  onChange = e => {
    const ranges = { outside: [4, 1000], inside: [3, 999] };
    const [min, max] = this.side === "outside" ? ranges.outside : ranges.inside;
    // Check value is at or below max
    if (e.target.value > max) {
      e.target.value = max;
    }
    // Check value is at or above min
    if (e.target.value < min) {
      e.target.value = min;
    }

    // Make sure that outside is never <= inside
    if (e.target.value !== "") {
      const value = parseInt(e.target.value);
      this.setSubdivision(this.side, value);

      if (this.side === "outside") {
        if (value <= this.props.subdivision.inside) {
          this.setSubdivision("inside", value - 1);
        }
      } else {
        if (value >= this.props.subdivision.outside) {
          this.setSubdivision("outside", value + 1);
        }
      }
    }
  };

  render() {
    return (
      <input
        ref="subInput"
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        className={"input side" + this.className}
        type="number"
        defaultValue={this.props.subdivision[this.side]}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    subdivision: state.subdivision
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSubdivision: (side, subdivision) => {
      dispatch({
        type: SET_SUBDIVISION,
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

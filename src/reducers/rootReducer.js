import { Power2, Power4 } from "gsap/TweenMax";

const colors = ["hsl(348, 100%, 61%)", "hsl(204, 86%, 53%)"];
const initState = {
  tempo: 100,
  play: false,
  mute: { outside: false, inside: false },
  subdivision: { outside: 4, inside: 3 },
  ball: {
    inner: {
      maxRadius: 25,
      minRadius: 5,
      fill: colors[0],
      stroke: colors[0],
      radiusEasing: Power4.easeIn
    },
    outer: {
      maxRadius: 25,
      minRadius: 5,
      fill: colors[1],
      stroke: colors[1],
      radiusEasing: Power2.easeIn
    }
  },
  polygons: {
    lineWidth: 2,
    outer: { color: colors[1] },
    inner: { color: colors[0] }
  },
  render: {
    origin: { x: 250, y: 250 },
    width: 500,
    height: 500,
    innerRadius: 100,
    outerRadius: 200
  }
};

const rootReducer = (state = initState, action) => {
  if (action.type === "SET_TEMPO") {
    return {
      ...state,
      tempo: action.tempo
    };
  }

  if (action.type === "SET_PLAY") {
    return {
      ...state,
      play: action.play
    };
  }

  if (action.type === "SET_MUTE") {
    return {
      ...state,
      mute: { ...state.mute, [action.side]: action.mute }
    };
  }

  if (action.type === "SET_SUBDIVISION") {
    return {
      ...state,
      subdivision: { ...state.subdivision, [action.side]: action.subdivision }
    };
  }

  return state;
};

export default rootReducer;

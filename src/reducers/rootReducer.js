import initState from "../store/store";
import {
  SET_TEMPO,
  SET_PLAY,
  SET_MUTE,
  SET_SUBDIVISION
} from "../constants/actions";

const rootReducer = (state = initState, action) => {
  if (action.type === SET_TEMPO) {
    return {
      ...state,
      tempo: action.tempo
    };
  }

  if (action.type === SET_PLAY) {
    return {
      ...state,
      play: action.play
    };
  }

  if (action.type === SET_MUTE) {
    return {
      ...state,
      mute: { ...state.mute, [action.side]: action.mute }
    };
  }

  if (action.type === SET_SUBDIVISION) {
    return {
      ...state,
      subdivision: { ...state.subdivision, [action.side]: action.subdivision }
    };
  }

  return state;
};

export default rootReducer;

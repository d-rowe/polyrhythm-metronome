import Tone from "tone";
import hi from "../sounds/hi.ogg";
import low from "../sounds/low.ogg";

let orangePanVol = new Tone.PanVol(-0.5, 0).toMaster();
let bluePanVol = new Tone.PanVol(0.5, 0).toMaster();
export const orangeClick = new Tone.Player({
  url: hi
}).connect(orangePanVol);
export const blueClick = new Tone.Player({
  url: low
}).connect(bluePanVol);
// export const flipStereo = () => {
//   orangePanVol.pan.value = orangePanVol.pan.value * -1;
//   bluePanVol.pan.value = bluePanVol.pan.value * -1;
// };

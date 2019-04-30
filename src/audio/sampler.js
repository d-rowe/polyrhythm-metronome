import Tone from "tone";
import hi from "../sounds/hi.ogg";
import low from "../sounds/low.ogg";

export default class Sampler {
  constructor() {
    this.bluePanVol = new Tone.PanVol(0, 0).toMaster();
    this.redPanVol = new Tone.PanVol(0, 0).toMaster();
    this.blueClick = new Tone.Player({
      url: low
    }).connect(this.bluePanVol);
    this.redClick = new Tone.Player({
      url: hi
    }).connect(this.redPanVol);
  }
}

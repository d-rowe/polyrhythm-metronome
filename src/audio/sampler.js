import Tone from "tone";
import hi from "../sounds/hi.ogg";
import low from "../sounds/low.ogg";

export default class Sampler {
  constructor() {
    this.outsidePanVol = new Tone.PanVol(0, 0).toMaster();
    this.insidePanVol = new Tone.PanVol(0, 0).toMaster();
    this.outsideClick = new Tone.Player({
      url: low
    }).connect(this.outsidePanVol);
    this.insideClick = new Tone.Player({
      url: hi
    }).connect(this.insidePanVol);
  }

  playInside = () => {
    this.insideClick.start()
  }

  playOutside = () => {
    this.outsideClick.start()
  }
}

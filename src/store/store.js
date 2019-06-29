import { Power2, Power4 } from "gsap/TweenMax";

const colors = ["hsl(348, 100%, 61%)", "hsl(204, 86%, 53%)"];
const initState = {
  tempo: 100,
  play: false,
  mute: { outside: false, inside: false },
  subdivision: { outside: 4, inside: 3 },
  ball: {
    inside: {
      maxRadius: 25,
      minRadius: 5,
      fill: colors[0],
      stroke: colors[0],
      radiusEasing: Power4.easeIn
    },
    outside: {
      maxRadius: 25,
      minRadius: 5,
      fill: colors[1],
      stroke: colors[1],
      radiusEasing: Power2.easeIn
    }
  },
  polygons: {
    lineWidth: 2,
    outside: { color: colors[1] },
    inside: { color: colors[0] }
  },
  render: {
    origin: { x: 250, y: 250 },
    width: 500,
    height: 500,
    radius: {
      inside: 100,
      outside: 200
    }
  }
};

export default initState;

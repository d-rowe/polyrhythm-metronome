import React from "react";
import Tone from "tone";
import Two from "two.js";
import { TweenMax, Power2 } from "gsap/TweenMax";
import { TimelineMax } from "gsap/TimelineMax";
import click1 from "../sounds/click1.wav";
import click2 from "../sounds/click2.wav";

class Geometry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempo: 120,
      ball: {
        bigRadius: 40,
        smallRadius: 10,
        inner: {
          fill: "orangered",
          stroke: "orangered"
        },
        radiusEasing: Power2.easeIn,
        outer: {
          fill: "rgb(0, 200, 255)",
          stroke: "rgb(0, 200, 255)"
        }
      },
      polygon: {
        lineWidth: 15,
        inner: { color: "orangered", sides: 4 },
        outer: { color: "rgb(0, 200, 255)", sides: 7 }
      },
      render: {
        origin: { x: 300, y: 300 },
        width: 1000,
        height: 1000,
        innerRadius: 100,
        outerRadius: 200
      }
    };
  }
  componentDidMount() {
    this.initializeTwo();
    this.drawShapes();
    this.initiateBeatCircles();
    this.timelineSetup();
  }

  initializeTwo() {
    let params = {
      width: this.state.render.width,
      height: this.state.render.height,
      autostart: true
    };
    this.two = new Two(params).appendTo(this.refs.geoCanvas);
  }

  drawShapes() {
    let shape1 = this.two.makePolygon(
      this.state.render.origin.x,
      this.state.render.origin.y,
      this.state.render.innerRadius,
      this.state.polygon.inner.sides
    );
    let shape2 = this.two.makePolygon(
      this.state.render.origin.x,
      this.state.render.origin.y,
      this.state.render.outerRadius,
      this.state.polygon.outer.sides
    );

    shape1.stroke = this.state.polygon.inner.color;
    shape1.linewidth = this.state.polygon.lineWidth;
    shape1.rotation = Math.PI + Math.PI / this.state.polygon.inner.sides;
    shape1.noFill();
    shape1.points = this.getPoints(shape1, this.state.polygon.inner.sides);
    shape1.sides = this.state.polygon.inner.sides;

    shape2.stroke = this.state.polygon.outer.color;
    shape2.linewidth = this.state.polygon.lineWidth;
    shape2.rotation = Math.PI + Math.PI / this.state.polygon.outer.sides;
    shape2.noFill();
    shape2.points = this.getPoints(shape2, this.state.polygon.outer.sides);
    shape2.sides = this.state.polygon.outer.sides;

    this.shape1 = shape1;
    this.shape2 = shape2;
  }

  initiateBeatCircles() {
    this.beatCircle1 = this.two.makeCircle(
      this.state.render.origin.x,
      this.state.render.origin.y - this.state.render.innerRadius,
      this.state.ball.bigRadius
    );
    this.beatCircle1.fill = this.state.ball.inner.fill;
    this.beatCircle1.stroke = this.state.ball.inner.stroke;
    this.beatCircle2 = this.two.makeCircle(
      this.state.render.origin.x,
      this.state.render.origin.y - this.state.render.outerRadius,
      this.state.ball.bigRadius
    );
    this.beatCircle2.fill = this.state.ball.outer.fill;
    this.beatCircle2.stroke = this.state.ball.outer.stroke;
  }

  timelineSetup() {
    let duration = (60 / this.state.tempo) * this.state.polygon.outer.sides;
    let clicker1 = new Tone.Player({
      url: click1
    }).toMaster();
    let clicker2 = new Tone.Player({
      url: click2
    }).toMaster();
    this.timeline1 = new TimelineMax({ repeat: -1 });
    this.timeline2 = new TimelineMax({ repeat: -1 });
    this.radiusFlash1 = new TimelineMax({ repeat: -1 });
    this.radiusFlash2 = new TimelineMax({ repeat: -1 });

    let points1 = this.shape1.points;
    for (let i = 1; i <= points1.length; i++) {
      this.timeline1.add(
        TweenMax.to(this.beatCircle1.translation, 1, {
          x: points1[i % this.shape1.sides].x,
          y: points1[i % this.shape1.sides].y,
          ease: Power2.easeIn,
          onComplete: function() {
            clicker1.start();
          }
        })
      );
    }
    this.timeline1.duration(duration);

    for (let i = 1; i <= points1.length; i++) {
      this.radiusFlash1.add(
        TweenMax.to(this.beatCircle1, 1, {
          radius: this.state.ball.smallRadius,
          ease: this.state.ball.radiusEasing
        })
      );
      this.radiusFlash1.add(
        TweenMax.to(this.beatCircle1, 1, {
          radius: this.state.ball.bigRadius,
          ease: this.state.ball.radiusEasing
        })
      );
    }
    this.radiusFlash1.duration(duration);

    let points2 = this.shape2.points;
    for (let i = 1; i <= points2.length; i++) {
      this.timeline2.add(
        TweenMax.to(this.beatCircle2.translation, 1, {
          x: points2[i % this.shape2.sides].x,
          y: points2[i % this.shape2.sides].y,
          ease: Power2.easeIn,
          onComplete: function() {
            clicker2.start();
          }
        })
      );
    }
    this.timeline2.duration(duration);

    for (let i = 1; i <= points2.length; i++) {
      this.radiusFlash2.add(
        TweenMax.to(this.beatCircle2, 1, {
          radius: this.state.ball.smallRadius,
          ease: this.state.ball.radiusEasing
        })
      );
      this.radiusFlash2.add(
        TweenMax.to(this.beatCircle2, 1, {
          radius: this.state.ball.bigRadius,
          ease: this.state.ball.radiusEasing
        })
      );
    }
    this.radiusFlash2.duration(duration);
  }

  getPoints(shape, sides) {
    let points = [];
    for (let i = 0; i < sides; i++) {
      let vertex = shape.vertices[i];
      let point = this.rotatePoints(
        this.state.render.origin.x,
        this.state.render.origin.y,
        this.state.render.origin.x - vertex.x,
        this.state.render.origin.y - vertex.y,
        180 / sides
      );
      points.push({ x: point[0], y: point[1] });
    }
    points.push(points.shift());
    return points.reverse();
  }

  rotatePoints(cx, cy, x, y, angle) {
    let radians = (Math.PI / 180) * angle;
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);
    let nx = cos * (x - cx) + sin * (y - cy) + cx;
    let ny = cos * (y - cy) - sin * (x - cx) + cy;
    return [nx, ny];
  }

  render() {
    return <div ref="geoCanvas" className="geoCanvas" />;
  }
}

export default Geometry;

import React from "react";
import Tone from "tone";
import Two from "two.js";
import { TweenMax, Power2 } from "gsap/TweenMax";
import { TimelineMax } from "gsap/TimelineMax";
import click1 from "../sounds/click1.wav";
import click2 from "../sounds/click2.wav";

class Geometry extends React.Component {
  componentDidMount() {
    this.initializeTwo();
    this.drawShapes(5, 6, 150);
    this.initiateBeatCircles(20);
    this.timelineStart(10);
  }

  initializeTwo() {
    var params = { width: 1000, height: 1000, autostart: true };
    this.two = new Two(params).appendTo(this.refs.geoCanvas);
    this.origin = { x: 300, y: 300 };
  }

  drawShapes(sides1, sides2, radius) {
    var lineWidth = 4;
    var outerMultiply = 1.7;
    this.radius = radius;
    this.outerRadius = radius * outerMultiply;
    var shape1 = this.two.makePolygon(
      this.origin.x,
      this.origin.y,
      radius,
      sides1
    );
    var shape2 = this.two.makePolygon(
      this.origin.x,
      this.origin.y,
      this.outerRadius,
      sides2
    );

    shape1.stroke = "orangered";
    shape1.linewidth = lineWidth;
    shape1.rotation = Math.PI + Math.PI / sides1;
    shape1.noFill();
    shape1.points = this.getPoints(shape1, sides1);
    shape1.sides = sides1;

    shape2.stroke = "rgb(0, 200, 255)";
    shape2.linewidth = lineWidth;
    shape2.rotation = Math.PI + Math.PI / sides2;
    shape2.noFill();
    shape2.points = this.getPoints(shape2, sides2);
    shape2.sides = sides2;

    this.shape1 = shape1;
    this.shape2 = shape2;
  }

  initiateBeatCircles(radius) {
    this.beatCircle1 = this.two.makeCircle(
      this.origin.x,
      this.origin.y - this.radius,
      radius
    );
    this.beatCircle1.fill = "orangered";
    this.beatCircle1.noStroke();
    this.beatCircle2 = this.two.makeCircle(
      this.origin.x,
      this.origin.y - this.outerRadius,
      radius
    );
    this.beatCircle2.fill = "rgb(0, 200, 255)";
    this.beatCircle2.noStroke();
  }

  timelineStart(duration) {
    var clicker1 = new Tone.Player({
      url: click1
    }).toMaster();
    var clicker2 = new Tone.Player({
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
          radius: 15,
          ease: Power2.easeIn
        })
      );
      this.radiusFlash1.add(
        TweenMax.to(this.beatCircle1, 1, {
          radius: 20,
          ease: Power2.easeIn
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
          radius: 15,
          ease: Power2.easeIn
        })
      );
      this.radiusFlash2.add(
        TweenMax.to(this.beatCircle2, 1, {
          radius: 20,
          ease: Power2.easeIn
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
        this.origin.x,
        this.origin.y,
        this.origin.x - vertex.x,
        this.origin.y - vertex.y,
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

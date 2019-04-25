import React from "react";
import Two from "two.js";
import { TweenMax, SlowMo } from "gsap/TweenMax";

class Geometry extends React.Component {
  componentDidMount() {
    this.initializeTwo();
    this.drawShapes(3, 5, 100);
    this.initiateBeatCircles();
    this.startAnimation();
  }

  initializeTwo() {
    var params = { width: 1000, height: 500, autostart: true };
    this.two = new Two(params).appendTo(this.refs.geoCanvas);
    this.origin = { x: 200, y: 200 };
  }

  drawShapes(sides1, sides2, radius) {
    var lineWidth = 2;
    var outerRadius = radius * 1.5;
    var shape1 = this.two.makePolygon(
      this.origin.x,
      this.origin.y,
      radius,
      sides1
    );
    var shape2 = this.two.makePolygon(
      this.origin.x,
      this.origin.y,
      outerRadius,
      sides2
    );
    var circle1 = this.two.makeCircle(this.origin.x, this.origin.y, radius);
    var circle2 = this.two.makeCircle(
      this.origin.x,
      this.origin.y,
      outerRadius
    );

    shape1.stroke = "orangered";
    shape1.linewidth = lineWidth;
    shape1.rotation = Math.PI + Math.PI / sides1;
    shape1.noFill();
    shape1.points = this.getPoints(shape1, sides1);

    shape2.stroke = "rgb(0, 200, 255)";
    shape2.linewidth = lineWidth;
    shape2.rotation = Math.PI + Math.PI / sides2;
    shape2.noFill();
    shape2.points = this.getPoints(shape2, sides2);

    circle1.linewidth = lineWidth;
    circle1.opacity = 0;
    circle1.noFill();

    circle2.linewidth = lineWidth;
    circle2.opacity = 0;
    circle2.noFill();

    this.shape1 = shape1;
    this.shape2 = shape2;
  }

  initiateBeatCircles() {
    this.beatCircle1 = this.two.makeCircle(200, 100, 15);
    this.beatCircle1.fill = "orangered";
    this.beatCircle1.noStroke();
    this.beatCircle2 = this.two.makeCircle(200, 50, 10);
    this.beatCircle2.fill = "rgb(0, 200, 255)";
    this.beatCircle2.noStroke();
  }

  startAnimation() {
    TweenMax.to(this.beatCircle1.translation, 1, {
      x: this.shape1.points[1].x,
      y: this.shape1.points[1].y,
      yoyo: true,
      repeat: -1
    });

    TweenMax.to(this.beatCircle1, 1, {
      radius: 5,
      ease: SlowMo.easeInOut,
      yoyo: true,
      repeat: -1
    });

    TweenMax.to(this.beatCircle2.translation, 1, {
      x: this.shape2.points[1].x,
      y: this.shape2.points[1].y,
      yoyo: true,
      repeat: -1
    });

    TweenMax.to(this.beatCircle2, 1, {
      radius: 5,
      ease: SlowMo.easeInOut,
      yoyo: true,
      repeat: -1
    });
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

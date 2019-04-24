import React from "react";
import Two from "two.js";
import { TweenMax, Expo } from "gsap/TweenMax";

class Geometry extends React.Component {
  initializeTwo() {
    var params = { width: 1000, height: 500, autostart: true };
    this.two = new Two(params).appendTo(this.refs.geoCanvas);
    this.drawShapes(3, 5, 100);
  }

  drawShapes(sides1, sides2, radius) {
    var lineWidth = 2;
    var outerRadius = radius * 1.5;
    var shape1 = this.two.makePolygon(200, 200, radius, sides1);
    var shape2 = this.two.makePolygon(200, 200, outerRadius, sides2);
    var circle1 = this.two.makeCircle(200, 200, radius);
    var circle2 = this.two.makeCircle(200, 200, outerRadius);

    shape1.stroke = "orangered";
    shape1.linewidth = lineWidth;
    shape1.rotation = Math.PI + Math.PI / sides1;
    shape1.noFill();

    shape2.stroke = "rgb(0, 200, 255)";
    shape2.linewidth = lineWidth;
    shape2.rotation = Math.PI + Math.PI / sides2;
    shape2.noFill();

    circle1.linewidth = lineWidth;
    circle1.opacity = 0;
    circle1.noFill();

    circle2.linewidth = lineWidth;
    circle2.opacity = 0;
    circle2.noFill();

    this.shape1 = shape1;
    this.shape2 = shape2;

    this.initiateBeatCircles();
    this.two.update();
  }

  initiateBeatCircles() {
    console.log(this.shape1.vertices);

    var beatCircle1 = this.two.makeCircle(200, 100, 10);
    beatCircle1.fill = "orangered";
    beatCircle1.noStroke();

    var beatCircle2 = this.two.makeCircle(200, 50, 10);
    beatCircle2.fill = "rgb(0, 200, 255)";
    beatCircle2.noStroke();
    // console.log(beatCircle1);

    TweenMax.to(beatCircle1, 0.4, {
      radius: 20,
      x: "10",
      ease: Expo.easeInOut,
      yoyo: true,
      repeat: -1
    });
    TweenMax.to(beatCircle2, 0.4, {
      radius: 20,
      ease: Expo.easeInOut,
      yoyo: true,
      repeat: -1
    });
    // this.two.bind('update', (frameCount) ->
    // ).play()
  }

  componentDidMount() {
    this.initializeTwo();
  }

  render() {
    return <div ref="geoCanvas" className="geoCanvas" />;
  }
}

export default Geometry;

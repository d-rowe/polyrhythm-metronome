import React from "react";
import Two from "two.js";

class Geometry extends React.Component {
  initializeTwo() {
    var params = { width: 1000, height: 500 };
    this.two = new Two(params).appendTo(this.refs.geoCanvas);
    this.drawShapes(3, 5, 100);
  }

  drawShapes(sides1, sides2, radius) {
    var lineWidth = 2;
    var outerRadius = radius * 1.5
    var shape1 = this.two.makePolygon(200, 200, radius, sides1);
    var shape2 = this.two.makePolygon(200, 200, outerRadius, sides2);
    var circle1 = this.two.makeCircle(200, 200, radius);
    var circle2 = this.two.makeCircle(200, 200, outerRadius);

    shape1.stroke = "orangered"; // Accepts all valid css color
    shape1.linewidth = lineWidth;
    shape1.rotation = Math.PI + Math.PI / sides1;
    shape1.noFill();

    shape2.stroke = "rgb(0, 200, 255)";
    shape2.linewidth = lineWidth;
    shape2.rotation = Math.PI + Math.PI / sides2;
    shape2.noFill();

    circle1.linewidth = lineWidth;
    circle1.opacity = 0.05;
    circle1.noFill();

    circle2.linewidth = lineWidth;
    circle2.opacity = 0.05;
    circle2.noFill();

    this.two.update();
  }

  initiateBeatCircles() {}

  componentDidMount() {
    this.initializeTwo();
  }

  render() {
    return <div ref="geoCanvas" className="geoCanvas" />;
  }
}

export default Geometry;

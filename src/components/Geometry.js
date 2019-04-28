import React from "react";
import Two from "two.js";
import { TweenMax, Power2, Power4 } from "gsap/TweenMax";
import { TimelineMax } from "gsap/TimelineMax";
import "./Geometry.scss";

class Geometry extends React.Component {
  constructor(props) {
    super(props);
    this.sampler = this.props.sampler;
    let colors = [
      "hsl(348, 100%, 61%)",
      "hsl(348, 100%, 61%)",
      "hsl(204, 86%, 53%)",
      "hsl(204, 86%, 53%)"
    ];
    this.state = {
      tempo: 100,
      playing: false,
      ball: {
        animationOpacity: 0.7,
        inner: {
          bigRadius: 25,
          smallRadius: 10,
          fill: colors[1],
          stroke: colors[1],
          radiusEasing: Power4.easeIn
        },
        outer: {
          bigRadius: 25,
          smallRadius: 10,
          fill: colors[3],
          stroke: colors[3],
          radiusEasing: Power2.easeIn
        }
      },
      polygons: {
        lineWidth: 2,
        inner: { color: colors[0], sides: 3 },
        outer: { color: colors[2], sides: 4 }
      },
      render: {
        origin: { x: 250, y: 250 },
        width: 500,
        height: 500,
        innerRadius: 100,
        outerRadius: 200
      }
    };
  }

  componentDidMount() {
    this.initializeTwo();
    this.drawShapes();
  }

  componentDidUpdate(prevProps) {
    if (this.props.tempo !== prevProps.tempo) {
      this.setState({ tempo: this.props.tempo });
      this.stop();
      this.props.handleStop();
    }

    if (this.props.sides1 !== prevProps.sides1) {
      let polygons = { ...this.state.polygons };
      polygons.inner.sides = this.props.sides1;
      this.setState({ polygons: polygons });
      this.restart();
    }

    if (this.props.sides2 !== prevProps.sides2) {
      let polygons = { ...this.state.polygons };
      polygons.outer.sides = this.props.sides2;
      this.setState({ polygons: polygons });
      this.restart();
    }

    if (this.props.playing !== prevProps.playing) {
      if (this.props.playing) {
        this.play();
      } else {
        this.stop();
      }
    }
  }

  restart() {
    this.stop();
    if (this.state.playing) {
      this.play();
    }
  }

  play() {
    this.setState({ playing: true });
    this.initiateBeatCircles();
    this.timelineSetup();
    this.timeline1.play();
    this.timeline2.play();
    this.radiusFlash1.play();
    this.radiusFlash2.play();
  }

  stop() {
    if (typeof this.timeline1 !== "undefined") {
      this.setState({ playing: false });
      this.timeline1.remove(this.timeline1.getChildren());
      this.timeline2.remove(this.timeline2.getChildren());
      this.radiusFlash1.remove();
      this.radiusFlash2.remove();
    }
    this.two.clear();
    this.drawShapes();
  }

  initializeTwo() {
    let params = {
      width: this.state.render.width,
      height: this.state.render.height,
      autostart: true
    };
    this.two = new Two(params).appendTo(this.refs.geoCanvas);
    var mySVG = this.refs.geoCanvas.children[0];
    mySVG.setAttribute("viewBox", "0 0 500 500");
    mySVG.setAttribute("class", "geoSVG");
    // mySVG.setAttribute("shape-rendering", "geometricPrecision");
  }

  drawShapes() {
    let shape1 = this.two.makePolygon(
      this.state.render.origin.x,
      this.state.render.origin.y,
      this.state.render.innerRadius,
      this.state.polygons.inner.sides
    );
    let shape2 = this.two.makePolygon(
      this.state.render.origin.x,
      this.state.render.origin.y,
      this.state.render.outerRadius,
      this.state.polygons.outer.sides
    );

    shape1.stroke = this.state.polygons.inner.color;
    shape1.linewidth = this.state.polygons.lineWidth;
    shape1.rotation = Math.PI + Math.PI / this.state.polygons.inner.sides;
    shape1.noFill();
    shape1.points = this.getPoints(shape1, this.state.polygons.inner.sides);
    shape1.sides = this.state.polygons.inner.sides;

    shape2.stroke = this.state.polygons.outer.color;
    shape2.linewidth = this.state.polygons.lineWidth;
    shape2.rotation = Math.PI + Math.PI / this.state.polygons.outer.sides;
    shape2.noFill();
    shape2.points = this.getPoints(shape2, this.state.polygons.outer.sides);
    shape2.sides = this.state.polygons.outer.sides;

    this.shape1 = shape1;
    this.shape2 = shape2;
  }

  initiateBeatCircles() {
    this.beatCircle1 = this.two.makeCircle(
      this.state.render.origin.x,
      this.state.render.origin.y - this.state.render.innerRadius,
      this.state.ball.inner.bigRadius
    );
    this.beatCircle1.fill = this.state.ball.inner.fill;
    this.beatCircle1.stroke = this.state.ball.inner.stroke;
    this.beatCircle1.opacity = this.state.ball.animationOpacity;
    this.beatCircle2 = this.two.makeCircle(
      this.state.render.origin.x,
      this.state.render.origin.y - this.state.render.outerRadius,
      this.state.ball.outer.bigRadius
    );
    this.beatCircle2.fill = this.state.ball.outer.fill;
    this.beatCircle2.stroke = this.state.ball.outer.stroke;
    this.beatCircle2.opacity = this.state.ball.animationOpacity;
  }

  timelineSetup() {
    let sampler = this.sampler;
    let duration = (60 / this.state.tempo) * this.state.polygons.outer.sides;

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
          ease: this.state.ball.inner.radiusEasing,
          onStart: function() {
            sampler.redClick.start();
          }
        })
      );
    }
    this.timeline1.duration(duration);

    for (let i = 1; i <= points1.length; i++) {
      this.radiusFlash1.add(
        TweenMax.to(this.beatCircle1, 1, {
          radius: this.state.ball.inner.smallRadius,
          opacity: 1,
          ease: Power4.easeOut
        })
      );
      this.radiusFlash1.add(
        TweenMax.to(this.beatCircle1, 1, {
          radius: this.state.ball.inner.bigRadius,
          opacity: this.state.ball.animationOpacity,
          ease: this.state.ball.inner.radiusEasing
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
          onStart: function() {
            sampler.blueClick.start();
          }
        })
      );
    }
    this.timeline2.duration(duration);

    for (let i = 1; i <= points2.length; i++) {
      this.radiusFlash2.add(
        TweenMax.to(this.beatCircle2, 1, {
          radius: this.state.ball.outer.smallRadius,
          opacity: 1,
          ease: Power4.easeOut
        })
      );
      this.radiusFlash2.add(
        TweenMax.to(this.beatCircle2, 1, {
          radius: this.state.ball.outer.bigRadius,
          opacity: this.state.ball.animationOpacity,
          ease: this.state.ball.outer.radiusEasing
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
    // points.push(points.shift());
    // points.reverse()
    return points;
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

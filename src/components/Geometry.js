import React from "react";
import Two from "two.js";
import { TweenMax, Power2, Power4 } from "gsap/TweenMax";
import { TimelineMax } from "gsap/TimelineMax";
import { connect } from "react-redux";
import hi from "../sounds/hi.ogg";
import low from "../sounds/low.ogg";
import "./Geometry.scss";

class Geometry extends React.Component {
  componentDidMount() {
    this.initializeTwo();
    this.drawShapes();
    this.initiateBeatCircles();
    this.lowClick = new Audio(low);
    this.hiClick = new Audio(hi);
  }

  componentDidUpdate = prevProps => {
    if (this.props.tempo !== prevProps.tempo) {
      this.restart();
    }

    if (this.props.subdivision !== prevProps.subdivision) {
      this.restart();
    }

    if (this.props.play !== prevProps.play) {
      if (this.props.play) {
        this.play();
      } else {
        this.stop();
      }
    }

    if (this.props.mute.inside !== prevProps.mute.inside) {
      if (this.props.mute.inside) {
        this.insideCircle.opacity = 0;
      } else if (this.props.play) {
        this.insideCircle.opacity = 1;
      }
    }

    if (this.props.mute.outside !== prevProps.mute.outside) {
      if (this.props.mute.outside) {
        this.outsideCircle.opacity = 0;
      } else if (this.props.play) {
        this.outsideCircle.opacity = 1;
      }
    }
  };

  restart = () => {
    this.stop();
    if (this.props.play) {
      this.play();
    }
  };

  play = () => {
    this.props.setPlay(true);
    if (this.props.mute.inside) {
      this.insideCircle.opacity = 0;
    } else {
      this.insideCircle.opacity = 1;
    }
    if (this.props.mute.outside) {
      this.outsideCircle.opacity = 0;
    } else {
      this.outsideCircle.opacity = 1;
    }
    this.timelineSetup();
    this.timeline1.play();
    this.timeline2.play();
    this.radiusFlash1.play();
    this.radiusFlash2.play();
  };

  stop = () => {
    this.props.setPlay(false);
    if (typeof this.timeline1 !== "undefined") {
      this.timeline1.remove(this.timeline1.getChildren());
      this.timeline2.remove(this.timeline2.getChildren());
      this.radiusFlash1.remove();
      this.radiusFlash2.remove();
    }
    this.two.clear();
    this.drawShapes();
    this.initiateBeatCircles();
  };

  initializeTwo = () => {
    let params = {
      width: this.props.render.width,
      height: this.props.render.height,
      autostart: true
    };
    this.two = new Two(params).appendTo(this.refs.geoCanvas);
    var mySVG = this.refs.geoCanvas.children[0];
    mySVG.setAttribute("viewBox", "0 0 500 500");
    mySVG.setAttribute("class", "geoSVG");
  };

  drawShapes = () => {
    let shape1 = this.two.makePolygon(
      this.props.render.origin.x,
      this.props.render.origin.y,
      this.props.render.innerRadius,
      this.props.subdivision.inside
    );
    let shape2 = this.two.makePolygon(
      this.props.render.origin.x,
      this.props.render.origin.y,
      this.props.render.outerRadius,
      this.props.subdivision.outside
    );

    shape1.stroke = this.props.polygons.inner.color;
    shape1.linewidth = this.props.polygons.lineWidth;
    shape1.rotation = Math.PI + Math.PI / this.props.subdivision.inside;
    shape1.noFill();
    shape1.points = this.getPoints(shape1, this.props.subdivision.inside);
    shape1.sides = this.props.subdivision.inside;

    shape2.stroke = this.props.polygons.outer.color;
    shape2.linewidth = this.props.polygons.lineWidth;
    shape2.rotation = Math.PI + Math.PI / this.props.subdivision.outside;
    shape2.noFill();
    shape2.points = this.getPoints(shape2, this.props.subdivision.outside);
    shape2.sides = this.props.subdivision.outside;

    this.shape1 = shape1;
    this.shape2 = shape2;
  };

  initiateBeatCircles = () => {
    this.insideCircle = this.two.makeCircle(
      this.props.render.origin.x,
      this.props.render.origin.y - this.props.render.innerRadius,
      this.props.ball.inner.maxRadius
    );
    this.insideCircle.fill = this.props.ball.inner.fill;
    this.insideCircle.stroke = this.props.ball.inner.stroke;
    this.outsideCircle = this.two.makeCircle(
      this.props.render.origin.x,
      this.props.render.origin.y - this.props.render.outerRadius,
      this.props.ball.outer.maxRadius
    );
    this.outsideCircle.fill = this.props.ball.outer.fill;
    this.outsideCircle.stroke = this.props.ball.outer.stroke;

    this.insideCircle.opacity = 0;
    this.outsideCircle.opacity = 0;
  };

  timelineSetup() {
    let duration = (60 / this.props.tempo) * this.props.subdivision.outside;

    this.timeline1 = new TimelineMax({ repeat: -1 });
    this.timeline2 = new TimelineMax({ repeat: -1 });
    this.radiusFlash1 = new TimelineMax({ repeat: -1 });
    this.radiusFlash2 = new TimelineMax({ repeat: -1 });

    let points1 = this.shape1.points;
    for (let i = 1; i <= points1.length; i++) {
      this.timeline1.add(
        TweenMax.to(this.insideCircle.translation, 1, {
          x: points1[i % this.shape1.sides].x,
          y: points1[i % this.shape1.sides].y,
          ease: this.props.ball.inner.radiusEasing,
          onStart: () => {
            if (!this.props.mute.inside) {
              this.hiClick.play();
            }
          }
        })
      );
    }
    this.timeline1.duration(duration);

    for (let i = 1; i <= points1.length; i++) {
      this.radiusFlash1.add(
        TweenMax.to(this.insideCircle, 1, {
          radius: this.props.ball.inner.minRadius,
          ease: Power4.easeOut
        })
      );
      this.radiusFlash1.add(
        TweenMax.to(this.insideCircle, 1, {
          radius: this.props.ball.inner.maxRadius,
          ease: this.props.ball.inner.radiusEasing
        })
      );
    }
    this.radiusFlash1.duration(duration);

    let points2 = this.shape2.points;
    for (let i = 1; i <= points2.length; i++) {
      this.timeline2.add(
        TweenMax.to(this.outsideCircle.translation, 1, {
          x: points2[i % this.shape2.sides].x,
          y: points2[i % this.shape2.sides].y,
          ease: Power2.easeIn,
          onStart: () => {
            if (!this.props.mute.outside) {
              this.lowClick.play();
            }
          }
        })
      );
    }
    this.timeline2.duration(duration);

    for (let i = 1; i <= points2.length; i++) {
      this.radiusFlash2.add(
        TweenMax.to(this.outsideCircle, 1, {
          radius: this.props.ball.outer.minRadius,
          ease: Power4.easeOut
        })
      );
      this.radiusFlash2.add(
        TweenMax.to(this.outsideCircle, 1, {
          radius: this.props.ball.outer.maxRadius,
          ease: this.props.ball.outer.radiusEasing
        })
      );
    }
    this.radiusFlash2.duration(duration);
  }

  getPoints = (shape, sides) => {
    let points = [];
    for (let i = 0; i < sides; i++) {
      let vertex = shape.vertices[i];
      let point = this.rotatePoints(
        this.props.render.origin.x,
        this.props.render.origin.y,
        this.props.render.origin.x - vertex.x,
        this.props.render.origin.y - vertex.y,
        180 / sides
      );
      points.push({ x: point[0], y: point[1] });
    }
    return points;
  };

  rotatePoints = (cx, cy, x, y, angle) => {
    let radians = (Math.PI / 180) * angle;
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);
    let nx = cos * (x - cx) + sin * (y - cy) + cx;
    let ny = cos * (y - cy) - sin * (x - cx) + cy;
    return [nx, ny];
  };

  render = () => {
    return <div ref="geoCanvas" className="geoCanvas" />;
  };
}

const mapStateToProps = state => {
  return {
    tempo: state.tempo,
    play: state.play,
    mute: state.mute,
    subdivision: state.subdivision,
    ball: state.ball,
    polygons: state.polygons,
    render: state.render
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPlay: play => {
      dispatch({ type: "SET_PLAY", play: play });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Geometry);

import React from "react";
import Two from "two.js";
import { SET_PLAY } from "../constants/actions";
import { TweenMax } from "gsap/TweenMax";
import { TimelineMax } from "gsap/TimelineMax";
import { connect } from "react-redux";
import hi from "../sounds/hi.ogg";
import low from "../sounds/low.ogg";

class PolygonAnimation extends React.Component {
  componentDidMount() {
    this.sides = ["inside", "outside"];
    this.initializeTwo();
    this.createPolygons();
    this.createCircles();
    this.click = { inside: new Audio(hi), outside: new Audio(low) };
  }

  componentDidUpdate = prevProps => {
    // Restart playback on tempo or subdivision change
    const propChanged = propName => {
      return this.props[propName] !== prevProps[propName];
    };
    if (propChanged("tempo") || propChanged("subdivision")) {
      this.restart();
    }
    // Handle playback changes
    if (this.props.play !== prevProps.play) {
      this.props.play ? this.play() : this.stop();
    }
    // Handle mute changes
    this.sides.forEach(side => {
      if (this.props.mute[side] !== prevProps.mute[side]) {
        if (this.props.mute[side]) {
          this.circles[side].opacity = 0;
        } else if (this.props.play) {
          this.circles[side].opacity = 1;
        }
      }
    });
  };

  restart = () => {
    this.stop();
    if (this.props.play) {
      this.play();
    }
  };

  play = () => {
    this.props.setPlay(true);
    this.timelineSetup();
    this.sides.forEach(side => {
      if (this.props.mute[side]) {
        this.circles[side].opacity = 0;
      } else {
        this.circles[side].opacity = 1;
      }
      this.timeline[side].play();
      this.radiusFlash[side].play();
    });
  };

  stop = () => {
    this.props.setPlay(false);
    try {
      if (typeof this.timeline.inside !== "undefined") {
        this.sides.forEach(side => {
          this.timeline[side].remove(this.timeline[side].getChildren());
          this.radiusFlash[side].remove();
        });
      }
    } catch {}
    this.two.clear();
    this.createPolygons();
    this.createCircles();
  };

  initializeTwo = () => {
    this.two = new Two({
      width: this.props.render.width,
      height: this.props.render.height,
      autostart: true
    }).appendTo(this.refs.geoCanvas);
    var mySVG = this.refs.geoCanvas.children[0];
    mySVG.setAttribute("viewBox", "0 0 500 500");
    mySVG.setAttribute("class", "geoSVG");
  };

  createPolygons = () => {
    this.polygons = {};
    this.sides.forEach(side => {
      this.polygons[side] = this.two.makePolygon(
        this.props.render.origin.x,
        this.props.render.origin.y,
        this.props.render.radius[side],
        this.props.subdivision[side]
      );
      this.polygons[side].stroke = this.props.polygons[side].color;
      this.polygons[side].linewidth = this.props.polygons.lineWidth;
      this.polygons[side].rotation =
        Math.PI + Math.PI / this.props.subdivision[side];
      this.polygons[side].noFill();
      this.polygons[side].points = this.getPoints(
        this.polygons[side],
        this.props.subdivision[side]
      );
    });
  };

  createCircles = () => {
    this.circles = {};
    this.sides.forEach(side => {
      this.circles[side] = this.two.makeCircle(
        this.props.render.origin.x,
        this.props.render.origin.y - this.props.render.radius[side],
        this.props.balls[side].maxRadius
      );
      this.circles[side].fill = this.props.balls[side].fill;
      this.circles[side].stroke = this.props.balls[side].stroke;
      this.circles[side].opacity = 0;
    });
  };

  // Setup animation timeline
  timelineSetup() {
    // Set time interval between beats based in relation to the larger subdivision
    let duration = (60 / this.props.tempo) * this.props.subdivision.outside;

    let points = {};
    [this.timeline, this.radiusFlash] = [{}, {}];

    this.sides.forEach(side => {
      this.timeline[side] = new TimelineMax({ repeat: -1 });
      this.radiusFlash[side] = new TimelineMax({ repeat: -1 });

      points[side] = this.polygons[side].points;
      for (let i = 1; i <= points[side].length; i++) {
        this.timeline[side].add(
          TweenMax.to(this.circles[side].translation, 1, {
            x: points[side][i % this.polygons[side].sides].x,
            y: points[side][i % this.polygons[side].sides].y,
            ease: this.props.balls[side].radiusEasing,
            onStart: () => {
              if (!this.props.mute[side]) {
                this.click[side].play();
              }
            }
          })
        );
      }
      this.timeline[side].duration(duration);

      for (let i = 1; i <= points[side].length; i++) {
        this.radiusFlash[side].add(
          TweenMax.to(this.circles[side], 1, {
            radius: this.props.balls[side].minRadius,
            ease: this.props.balls[side].ease
          })
        );
        this.radiusFlash[side].add(
          TweenMax.to(this.circles[side], 1, {
            radius: this.props.balls[side].maxRadius,
            ease: this.props.balls[side].radiusEasing
          })
        );
      }
      this.radiusFlash[side].duration(duration);
    });
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
    balls: state.balls,
    polygons: state.polygons,
    render: state.render
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPlay: play => {
      dispatch({ type: SET_PLAY, play: play });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PolygonAnimation);

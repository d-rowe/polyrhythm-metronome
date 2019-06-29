import React from "react";
import ControlBox from "../components/ControlBox";
import PolygonAnimation from "../components/PolygonAnimation";

const Main = () => {
  return (
    <div className="row">
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column vCenter">
              <ControlBox />
            </div>
            <div className="column is-three-fifths">
              <PolygonAnimation />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;

import React, { useState } from "react";
import "./Hero.css";

export default function Hero() {
  const [hoverState, setHoverState] = useState("center");

  return (
    <div className="hero">
      <div className="top-nav">
        <div className="logo">
          SKINSTRIC <span className="bracket">[</span> INTRO{" "}
          <span className="bracket">]</span>
        </div>
        <button className="enter-code-btn">ENTER CODE</button>
      </div>

      <div
        className={`side-square left-square ${hoverState === "right" ? "hidden" : ""}`}
      >
        <div className="square-inner">
          <div className="square-border"></div>
        </div>
        <button
          className="side-button left-button"
          onMouseEnter={() => setHoverState("left")}
          onMouseLeave={() => setHoverState("center")}
        >
          <div className="button-diamond">
            <span className="button-arrow">◀</span>
          </div>
          <span className="button-text">DISCOVER A.I.</span>
        </button>
      </div>

      <div
        className={`side-square right-square ${hoverState === "left" ? "hidden" : ""}`}
      >
        <div className="square-inner">
          <div className="square-border"></div>
        </div>
        <button
          className="side-button right-button"
          onMouseEnter={() => setHoverState("right")}
          onMouseLeave={() => setHoverState("center")}
        >
          <span className="button-text">TAKE TEST</span>
          <div className="button-diamond">
            <span className="button-arrow">▶</span>
          </div>
        </button>
      </div>

      <div className={`text-container ${hoverState}`}>
  <div className="title-wrapper">
    <h1 className="main-title">
      <span className="title-inner">Sophisticated<br />skincare</span>
    </h1>
  </div>
</div>

      <div className="bottom-text">
        <p>
          SKINSTRIC DEVELOPED AN A.I. THAT CREATES
          <br />
          A HIGHLY-PERSONALISED ROUTINE TAILORED TO
          <br />
          WHAT YOUR SKIN NEEDS.
        </p>
      </div>
    </div>
  );
}

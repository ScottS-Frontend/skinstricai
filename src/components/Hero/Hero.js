import React from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <div className="hero">
      <div className="top-nav">
        <div className="logo">
          SKINSTRIC <span className="bracket">[</span> INTRO <span className="bracket">]</span>
        </div>
        <button className="enter-code-btn">
          ENTER CODE
        </button>
      </div>

      <div className="side-square left-square">
        <div className="square-inner">
          <div className="square-border"></div>
        </div>
        <button className="side-button left-button">
          <div className="button-diamond">
            <span className="button-arrow">◀</span>
          </div>
          <span className="button-text">DISCOVER A.I.</span>
        </button>
      </div>

      <div className="side-square right-square">
        <div className="square-inner">
          <div className="square-border"></div>
        </div>
        <button className="side-button right-button">
          <span className="button-text">TAKE TEST</span>
          <div className="button-diamond">
            <span className="button-arrow">▶</span>
          </div>
        </button>
      </div>

      <div className="center-content">
        <h1 className="main-title">
          Sophisticated<br />skincare
        </h1>
      </div>

      <div className="bottom-text">
        <p>
          SKINSTRIC DEVELOPED AN A.I. THAT CREATES<br />
          A HIGHLY-PERSONALISED ROUTINE TAILORED TO<br />
          WHAT YOUR SKIN NEEDS.
        </p>
      </div>
    </div>
  );
}
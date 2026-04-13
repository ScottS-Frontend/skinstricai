import React, { useState } from "react";
import "./Hero.css";
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import diamondSmall from '../../assets/images/diamond-small.png';

export default function Hero() {
  const [hoverState, setHoverState] = useState("center");

  return (
    <div className="hero">
      <Header />

      {/* Left Diamond */}
      <div
        className={`side-diamond left-diamond ${hoverState === "right" ? "hidden" : ""}`}
      >
        <img 
          src={diamondSmall} 
          alt="Left diamond" 
          className="diamond-img"
        />
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

      {/* Right Diamond */}
      <div
        className={`side-diamond right-diamond ${hoverState === "left" ? "hidden" : ""}`}
      >
        <img 
          src={diamondSmall} 
          alt="Right diamond" 
          className="diamond-img"
        />
        <Link to="/testing"
          className="side-button right-button"
          onMouseEnter={() => setHoverState("right")}
          onMouseLeave={() => setHoverState("center")}
        >
          <span className="button-text">TAKE TEST</span>
          <div className="button-diamond">
            <span className="button-arrow">▶</span>
          </div>
        </Link>
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
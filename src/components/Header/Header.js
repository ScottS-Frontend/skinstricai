import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <div className="top-nav">
      <Link to="/" className="logo">
        <span className="logo-skinstric">SKINSTRIC</span>
        <span className="bracket">[ INTRO ]</span>
      </Link>
      <button className="enter-code-btn">
        ENTER CODE
      </button>
    </div>
  );
}
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();
  
  // Check if current page is Select or Summary
  const isAnalysisPage = location.pathname === '/select' || location.pathname === '/summary';
  
  // Set bracket text based on current page
  const bracketText = isAnalysisPage ? '[ ANALYSIS ]' : '[ INTRO ]';

  return (
    <div className="top-nav">
      <Link to="/" className="logo">
        <span className="logo-skinstric">SKINSTRIC</span>
        <span className="bracket">{bracketText}</span>
      </Link>
      <button className="enter-code-btn">
        ENTER CODE
      </button>
    </div>
  );
}
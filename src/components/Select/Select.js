import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Select.css';
import Header from '../Header/Header';
import diamondSmall from '../../assets/images/diamond-small.png';
import diamondMedium from '../../assets/images/diamond-medium.png';
import diamondLarge from '../../assets/images/diamond-large.png';

export default function Select() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredSize, setHoveredSize] = useState(null);

  const { image, demographics, actualDemographics } = location.state || {};

  const handleDemographicsClick = () => {
    navigate('/summary', { state: { image, demographics, actualDemographics } });
  };

  return (
    <div className="select-page">
      <Header />

      <div className="analysis-text">
        <h2 className="analysis-title">A.I. ANALYSIS</h2>
        <p className="analysis-subtitle">A.I. HAS ESTIMATED THE FOLLOWING.</p>
        <p className="analysis-instruction">FIX ESTIMATED INFORMATION IF NEEDED.</p>
      </div>

      <div className="diamond-navigation">
        <img 
          src={diamondSmall} 
          alt="" 
          className={`hover-diamond-img small ${hoveredSize === 'small' ? 'visible' : ''}`}
        />
        <img 
          src={diamondMedium} 
          alt="" 
          className={`hover-diamond-img medium ${hoveredSize === 'medium' ? 'visible' : ''}`}
        />
        <img 
          src={diamondLarge} 
          alt="" 
          className={`hover-diamond-img large ${hoveredSize === 'large' ? 'visible' : ''}`}
        />

        <div 
          className="diamond-item top-diamond active"
          onMouseEnter={() => setHoveredSize('small')}
          onMouseLeave={() => setHoveredSize(null)}
          onClick={handleDemographicsClick}
        >
          <div className="diamond-shape">
            <div className="diamond-label-container">
              <span className="diamond-label">DEMOGRAPHICS</span>
            </div>
          </div>
        </div>

        <div className="diamond-row">
          <div 
            className="diamond-item left-diamond disabled"
            onMouseEnter={() => setHoveredSize('medium')}
            onMouseLeave={() => setHoveredSize(null)}
          >
            <div className="diamond-shape">
              <div className="diamond-label-container">
                <span className="diamond-label">COSMETIC</span>
                <span className="diamond-label">CONCERNS</span>
              </div>
            </div>
          </div>

          <div 
            className="diamond-item right-diamond disabled"
            onMouseEnter={() => setHoveredSize('medium')}
            onMouseLeave={() => setHoveredSize(null)}
          >
            <div className="diamond-shape">
              <div className="diamond-label-container">
                <span className="diamond-label">SKIN TYPE DETAILS</span>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="diamond-item bottom-diamond disabled"
          onMouseEnter={() => setHoveredSize('large')}
          onMouseLeave={() => setHoveredSize(null)}
        >
          <div className="diamond-shape">
            <div className="diamond-label-container">
              <span className="diamond-label">WEATHER</span>
            </div>
          </div>
        </div>
      </div>

      <div className="select-back-button">
        <Link to="/result" className="back-link-custom">
          <div className="button-diamond">
            <span className="button-arrow">◀</span>
          </div>
          <span className="button-text">BACK</span>
        </Link>
      </div>

      <button 
        className="select-proceed-button"
        onClick={() => navigate('/analysis-summary')}
      >
        <span className="button-text">PROCEED</span>
        <div className="button-diamond">
          <span className="button-arrow">▶</span>
        </div>
      </button>
    </div>
  );
}
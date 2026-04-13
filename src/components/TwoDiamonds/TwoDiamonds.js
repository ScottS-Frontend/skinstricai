import React from 'react';
import './TwoDiamonds.css';
import diamondLarge from '../../assets/images/diamond-large.png';
import diamondMedium from '../../assets/images/diamond-medium.png';

export default function TwoDiamonds() {
  return (
    <div className="two-diamonds-container">
      <img 
        src={diamondLarge} 
        alt="Large diamond" 
        className="spinning-diamond diamond-large"
      />
      <img 
        src={diamondMedium} 
        alt="Medium diamond" 
        className="spinning-diamond diamond-medium"
      />
    </div>
  );
}
import React from 'react';
import './ThreeDiamonds.css';
import diamondLarge from '../../assets/images/diamond-large.png';
import diamondMedium from '../../assets/images/diamond-medium.png';
import diamondSmall from '../../assets/images/diamond-small.png';

export default function ThreeDiamonds() {
  return (
    <div className="three-diamonds">
      <img 
        src={diamondLarge} 
        alt="Diamond Large" 
        className="diamond-img large"
      />
      <img 
        src={diamondMedium} 
        alt="Diamond Medium" 
        className="diamond-img medium"
      />
      <img 
        src={diamondSmall} 
        alt="Diamond Small" 
        className="diamond-img small"
      />
    </div>
  );
}
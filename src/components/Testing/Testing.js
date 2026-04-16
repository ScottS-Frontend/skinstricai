import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Testing.css';
import ThreeDiamonds from '../ThreeDiamonds/ThreeDiamonds';
import Header from '../Header/Header';

export default function Testing() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showProceed, setShowProceed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const nameInputRef = useRef(null);
  const cityInputRef = useRef(null);

  useEffect(() => {
    if (step === 1 && !isComplete) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    } else if (step === 2 && !isComplete) {
      setTimeout(() => cityInputRef.current?.focus(), 100);
    }
  }, [step, isComplete]);

  const validateInput = (value) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(value) && value.trim().length > 0;
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateInput(name)) {
      setError('Please enter a valid name (letters only)');
      return;
    }
    
    localStorage.setItem('skinstric_name', name);
    setStep(2);
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateInput(city)) {
      setError('Please enter a valid city name (letters only)');
      return;
    }
    
    localStorage.setItem('skinstric_city', city);
    setStep(3);
    setIsProcessing(true);
    
    submitToAPI(name, city);
  };

  const submitToAPI = async (userName, userCity) => {
  try {
    const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userName.trim(),
        location: userCity.trim()
      })
    });

    if (!response.ok) {
      throw new Error('API submission failed');
    }

    // Wait for response but don't need the data
    await response.json();

    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
    
  } catch (error) {
    setError('Submission failed. Please try again.');
    setIsProcessing(false);
  }
};

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setShowProceed(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const handleProceed = () => {
    navigate('/result');
  };

  return (
    <div className="testing-page">
      <Header />
      
      <h2 className="page-subtitle">TO START ANALYSIS</h2>

      <div className="analysis-content">
        {!isComplete && step === 1 && (
          <>
            <p className="click-type">CLICK TO TYPE</p>
            <form onSubmit={handleNameSubmit} className="analysis-form">
              <input
                ref={nameInputRef}
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Introduce Yourself"
                autoComplete="off"
                className="analysis-input"
                autoFocus
              />
              <button type="submit" className="sr-only">Submit</button>
            </form>
          </>
        )}

        {!isComplete && step === 2 && (
          <>
            <p className="click-type">AND WHERE ARE YOU FROM?</p>
            <form onSubmit={handleCitySubmit} className="analysis-form">
              <input
                ref={cityInputRef}
                type="text"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Where are you from?"
                autoComplete="off"
                className="analysis-input"
                autoFocus
              />
              <button type="submit" className="sr-only">Submit</button>
            </form>
          </>
        )}

        {!isComplete && step === 3 && isProcessing && (
  <div className="processing-message">
    <p className="processing-text">Processing Submission...</p>
    <p className="processing-dots">
      <span className="dot">.</span>
      <span className="dot">.</span>
      <span className="dot">.</span>
    </p>
  </div>
)}

        {isComplete && (
          <div className="thank-you-message">
            <p>Thank You!</p>
            <p className="proceed-text">Proceed for the next step</p>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>

      <ThreeDiamonds />

      <div className="back-button">
        <Link to="/" className="back-link-custom">
          <div className="button-diamond">
            <span className="button-arrow">◀</span>
          </div>
          <span className="button-text">BACK</span>
        </Link>
      </div>

      {showProceed && (
        <button className="proceed-button" onClick={handleProceed}>
          <span className="button-text">PROCEED</span>
          <div className="button-diamond">
            <span className="button-arrow">▶</span>
          </div>
        </button>
      )}
    </div>
  );
}
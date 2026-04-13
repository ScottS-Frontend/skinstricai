import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Result.css';
import Header from '../Header/Header';
import ThreeDiamonds from '../ThreeDiamonds/ThreeDiamonds';
import cameraIcon from '../../assets/images/camera.png';
import galleryIcon from '../../assets/images/gallery-icon.png';
import scanLine from '../../assets/images/scanline.png';

export default function Result() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleCameraClick = () => {
    setSelectedOption('camera');
    setShowCameraModal(true);
  };

  const handleGalleryClick = () => {
    setSelectedOption('gallery');
    // Trigger the hidden file input click
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      console.log('Selected file:', file);
    }
  };

  const handleDeny = () => {
    setShowCameraModal(false);
    setSelectedOption(null);
  };

  const handleAllow = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setCameraStream(stream);
      setShowCameraModal(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Camera access was denied. Please allow camera access to continue.');
      setShowCameraModal(false);
      setSelectedOption(null);
    }
  };

  const handleProceed = () => {
    if (selectedOption) {
      navigate('/analysis');
    }
  };

  return (
    <div className="result-page">
      <Header />
      
      <h2 className="page-subtitle">TO START ANALYSIS</h2>

      {/* Preview Box - Top Right */}
      <div className="preview-box">
        <p className="preview-label">Preview</p>
        <div className="preview-area">
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" className="preview-image" />
          ) : cameraStream ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="camera-preview-video"
            />
          ) : null}
        </div>
      </div>

      {/* Hidden File Input for Gallery */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Camera Permission Modal */}
      {showCameraModal && (
        <div className="camera-modal-overlay">
          <div className="camera-modal">
            <h3 className="camera-modal-title">ALLOW A.I. TO ACCESS YOUR CAMERA</h3>
            <div className="camera-modal-buttons">
              <button className="modal-btn deny-btn" onClick={handleDeny}>
                DENY
              </button>
              <button className="modal-btn allow-btn" onClick={handleAllow}>
                ALLOW
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="options-container">
        {/* Camera Option - Left */}
        <div 
          className={`option-item camera-item ${selectedOption === 'camera' ? 'selected' : ''}`}
          onClick={handleCameraClick}
        >
          <div className="diamond-area">
            <ThreeDiamonds />
            <div className="center-icon-wrapper">
              <img src={cameraIcon} alt="Camera" className="center-icon" />
            </div>
          </div>
          <div className="scan-text-group camera-scan-group">
            <img src={scanLine} alt="Scan line" className="scan-line-img" />
            <div className="option-text camera-text-position">
              <p className="option-label">ALLOW A.I.</p>
              <p className="option-label">TO SCAN YOUR FACE</p>
            </div>
          </div>
        </div>

        {/* Gallery Option - Right */}
        <div 
          className={`option-item gallery-item ${selectedOption === 'gallery' ? 'selected' : ''}`}
          onClick={handleGalleryClick}
        >
          <div className="diamond-area">
            <ThreeDiamonds />
            <div className="center-icon-wrapper">
              <img src={galleryIcon} alt="Gallery" className="center-icon" />
            </div>
          </div>
          <div className="scan-text-group gallery-scan-group">
            <img src={scanLine} alt="Scan line" className="scan-line-img gallery-scan-line" />
            <div className="option-text gallery-text-position">
              <p className="option-label">ALLOW A.I.</p>
              <p className="option-label">ACCESS GALLERY</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="back-button">
        <Link to="/testing" className="back-link-custom">
          <div className="button-diamond">
            <span className="button-arrow">◀</span>
          </div>
          <span className="button-text">BACK</span>
        </Link>
      </div>

      <button 
        className={`proceed-button ${selectedOption ? 'active' : 'disabled'}`} 
        onClick={handleProceed}
        disabled={!selectedOption}
      >
        <span className="button-text">PROCEED</span>
        <div className="button-diamond">
          <span className="button-arrow">▶</span>
        </div>
      </button>
    </div>
  );
}
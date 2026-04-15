import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import "./Result.css";
import Header from "../Header/Header";
import ThreeDiamonds from "../ThreeDiamonds/ThreeDiamonds";
import cameraIcon from "../../assets/images/camera.png";
import galleryIcon from "../../assets/images/gallery-icon.png";
import scanLine from "../../assets/images/scanline.png";

export default function Result() {
  const [isSettingUpCamera, setIsSettingUpCamera] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [demographics, setDemographics] = useState(null);
  const [actualDemographics, setActualDemographics] = useState({
    race: null,
    age: null,
    gender: null,
  });
  const [loading, setLoading] = useState(false);
  const [showDemographicsPanel, setShowDemographicsPanel] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const API_ENDPOINT =
    process.env.REACT_APP_API_ENDPOINT ||
    "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

  const handleCameraClick = () => {
    setSelectedOption("camera");
    setShowCameraModal(true);
    setError(null);
  };

  const handleGalleryClick = () => {
    setSelectedOption("gallery");
    setError(null);
    fileInputRef.current?.click();
  };

  const convertToBase64 = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      return btoa(binary);
    } catch (error) {
      console.error("Base64 conversion error:", error);
      throw new Error("Failed to convert image to Base64");
    }
  };

  const convertToBase64FileReader = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        try {
          const base64String = reader.result.split(",")[1];
          if (!base64String) {
            reject(new Error("Failed to extract base64 from data URL"));
            return;
          }
          resolve(base64String);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const sendImageToAPI = async (base64String) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          image: base64String,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.data) {
        setDemographics(data.data);
        return true;
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error sending image to API:", error);
      setError(error.message);
      alert(`Failed to analyze image: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image is too large. Please select an image under 5MB.");
    return;
  }

  const imageUrl = URL.createObjectURL(file);
  setSelectedImage(imageUrl);

  try {
    let base64String;
    try {
      base64String = await convertToBase64(file);
    } catch (err) {
      base64String = await convertToBase64FileReader(file);
    }

    const success = await sendImageToAPI(base64String);
    
    // Add delay and show success modal for gallery too
    if (success) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowSuccessModal(true);
    }
  } catch (error) {
    console.error("Error processing image:", error);
    setError(error.message);
    alert(`Error processing image: ${error.message}`);
  }
};

  const handleDeny = () => {
    setShowCameraModal(false);
    setSelectedOption(null);
  };

  const handleAllow = async () => {
    setShowCameraModal(false);
    setIsSettingUpCamera(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setCameraStream(stream);
      setIsSettingUpCamera(false);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setIsSettingUpCamera(false);
      alert(
        "Camera access was denied. Please allow camera access to continue.",
      );
      setSelectedOption(null);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/jpeg");
    const base64String = imageUrl.split(",")[1];

    stopCameraStream();

    setCapturedImage({
      url: imageUrl,
      base64: base64String,
    });
    setSelectedImage(imageUrl);
    setShowPhotoPreview(true);
    setIsCameraActive(false);
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const handleCancelCamera = () => {
    stopCameraStream();
    setSelectedOption(null);
    setSelectedImage(null);
  };

  const handleRetake = () => {
    setShowPhotoPreview(false);
    setCapturedImage(null);
    setSelectedImage(null);
    handleAllow();
  };

 const handleUseThisPhoto = async () => {
  if (!capturedImage) return;

  setShowPhotoPreview(false);
  setIsAnalyzing(true);

  const success = await sendImageToAPI(capturedImage.base64);

  await new Promise(resolve => setTimeout(resolve, 4000));

  setIsAnalyzing(false);

  if (success) {
    // Show success modal instead of navigating immediately
    setShowSuccessModal(true);
  }
};

const handleSuccessOk = () => {
  setShowSuccessModal(false);
  navigate("/select", {
    state: {
      image: capturedImage?.url || selectedImage,
      demographics: demographics,
      actualDemographics: actualDemographics,
    },
  });
};

  const sortAndFormatScores = (categoryData) => {
    if (!categoryData) return [];

    return Object.entries(categoryData)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => ({
        label: key,
        score: (value * 100).toFixed(2),
      }));
  };

  const handleDemographicSelect = (category, value) => {
    setActualDemographics((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleProceed = () => {
    if (selectedOption) {
      navigate("/analysis");
    }
  };

  const renderDemographicsPanel = () => {
    if (!showDemographicsPanel || !demographics) return null;

    const raceScores = sortAndFormatScores(demographics.race);
    const ageScores = sortAndFormatScores(demographics.age);
    const genderScores = sortAndFormatScores(demographics.gender);

    return (
      <div className="demographics-panel">
        <h3 className="demographics-title">AI PREDICTIONS</h3>
        <p className="demographics-subtitle">
          Click to select your actual attributes
        </p>

        <div className="demographic-section">
          <h4 className="section-label">RACE</h4>
          <div className="scores-list">
            {raceScores.map(({ label, score }) => (
              <button
                key={label}
                className={`score-item ${actualDemographics.race === label ? "selected-actual" : ""}`}
                onClick={() => handleDemographicSelect("race", label)}
              >
                <span className="score-label">{label}</span>
                <span className="score-value">{score}%</span>
              </button>
            ))}
          </div>
          {actualDemographics.race && (
            <div className="actual-selection">
              Your selection: <strong>{actualDemographics.race}</strong>
            </div>
          )}
        </div>

        <div className="demographic-section">
          <h4 className="section-label">AGE</h4>
          <div className="scores-list">
            {ageScores.map(({ label, score }) => (
              <button
                key={label}
                className={`score-item ${actualDemographics.age === label ? "selected-actual" : ""}`}
                onClick={() => handleDemographicSelect("age", label)}
              >
                <span className="score-label">{label}</span>
                <span className="score-value">{score}%</span>
              </button>
            ))}
          </div>
          {actualDemographics.age && (
            <div className="actual-selection">
              Your selection: <strong>{actualDemographics.age}</strong>
            </div>
          )}
        </div>

        <div className="demographic-section">
          <h4 className="section-label">GENDER</h4>
          <div className="scores-list">
            {genderScores.map(({ label, score }) => (
              <button
                key={label}
                className={`score-item ${actualDemographics.gender === label ? "selected-actual" : ""}`}
                onClick={() => handleDemographicSelect("gender", label)}
              >
                <span className="score-label">{label}</span>
                <span className="score-value">{score}%</span>
              </button>
            ))}
          </div>
          {actualDemographics.gender && (
            <div className="actual-selection">
              Your selection: <strong>{actualDemographics.gender}</strong>
            </div>
          )}
        </div>

        <button
          className="confirm-demographics-btn"
          onClick={() => setShowDemographicsPanel(false)}
        >
          CONFIRM SELECTIONS
        </button>
      </div>
    );
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
          ) : null}
        </div>
      </div>

      {/* Hidden Canvas for capturing photo */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Hidden File Input for Gallery */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Camera Permission Modal */}
      {showCameraModal && (
        <div className="camera-modal-overlay">
          <div className="camera-modal">
            <h3 className="camera-modal-title">
              ALLOW A.I. TO ACCESS YOUR CAMERA
            </h3>
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

      {/* Camera Setup Loading State */}
      {isSettingUpCamera && (
        <div className="camera-setup-loading">
          <div className="diamond-spinner">
            <ThreeDiamonds />
            <div className="camera-icon-spinning">
              <img
                src={cameraIcon}
                alt="Camera"
                className="spinning-camera-icon"
              />
            </div>
          </div>
          <p className="camera-setup-text">Setting Up Camera...</p>
        </div>
      )}

      {/* Camera Capture Interface */}
      {isCameraActive && (
        <div className="camera-capture-overlay">
          {/* Back Button - Bottom Left */}
          <div className="camera-back-button">
            <button onClick={handleCancelCamera} className="back-link-custom">
              <div className="button-diamond">
                <span className="button-arrow">◀</span>
              </div>
              <span className="button-text">BACK</span>
            </button>
          </div>

          {/* Center Instructions */}
          <div className="camera-instructions">
            <p className="instructions-title">TO GET BETTER RESULTS MAKE SURE TO HAVE</p>
            <div className="instructions-list">
              <span className="instruction-item">
                <span className="diamond-bullet">◇</span> NEUTRAL EXPRESSION
              </span>
              <span className="instruction-item">
                <span className="diamond-bullet">◇</span> FRONTAL POSE
              </span>
              <span className="instruction-item">
                <span className="diamond-bullet">◇</span> ADEQUATE LIGHTING
              </span>
            </div>
          </div>

          {/* Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          />

          {/* Right Side Controls */}
          <div className="camera-right-controls">
            <span className="take-picture-text">TAKE PICTURE</span>
            <button className="capture-btn" onClick={handleCapturePhoto}>
              <FontAwesomeIcon icon={faCamera} className="capture-btn-fa-icon" />
            </button>
          </div>
        </div>
      )}

      {/* Photo Preview Screen */}
      {showPhotoPreview && capturedImage && (
        <div className="photo-preview-overlay">
          <div className="photo-preview-container">
            <img
              src={capturedImage.url}
              alt="Captured"
              className="photo-preview-image"
            />
            <div className="photo-preview-text">
              <h2 className="great-shot-text">GREAT SHOT!</h2>
              <p className="preview-label-text">Preview</p>
            </div>
            <div className="photo-preview-buttons">
              <button className="retake-btn" onClick={handleRetake}>
                Retake
              </button>
              <button className="use-photo-btn" onClick={handleUseThisPhoto}>
                Use This Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analyzing Overlay */}
      {isAnalyzing && (
        <div className="analyzing-overlay">
          <div className="analyzing-box">
            <p className="analyzing-text">PREPARING YOUR ANALYSIS</p>
            <div className="bouncing-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">PREPARING YOUR ANALYSIS</div>
        </div>
      )}

      {/* Success Modal */}
{showSuccessModal && (
  <div className="success-modal-overlay">
    <div className="success-modal">
      <h3 className="success-modal-title">SKINSTRIC</h3>
      <p className="success-modal-message">Image analyzed successfully!</p>
      <button className="success-modal-btn" onClick={handleSuccessOk}>
        OK
      </button>
    </div>
  </div>
)}

      <div className="options-container">
        {/* Camera Option - Left */}
        <div
          className={`option-item camera-item ${selectedOption === "camera" ? "selected" : ""}`}
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
          className={`option-item gallery-item ${selectedOption === "gallery" ? "selected" : ""}`}
          onClick={handleGalleryClick}
        >
          <div className="diamond-area">
            <ThreeDiamonds />
            <div className="center-icon-wrapper">
              <img src={galleryIcon} alt="Gallery" className="center-icon" />
            </div>
          </div>
          <div className="scan-text-group gallery-scan-group">
            <img
              src={scanLine}
              alt="Scan line"
              className="scan-line-img gallery-scan-line"
            />
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
        className={`proceed-button ${selectedOption ? "active" : "disabled"}`}
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
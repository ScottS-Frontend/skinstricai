import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Summary.css";
import Header from "../Header/Header";

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from navigation state (passed from Result/Select page)
  const { demographics, actualDemographics, image } = location.state || {};

  // State for selected values (start with AI predictions or user corrections)
  const [selectedRace, setSelectedRace] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  // State for current view (race, age, or gender)
  const [currentView, setCurrentView] = useState("race");

  // Initialize with data when component mounts
  useEffect(() => {
    if (demographics) {
      // Find highest confidence race
      const sortedRace = sortAndFormatScores(demographics.race);
      setSelectedRace(actualDemographics?.race || sortedRace[0]?.label || "");

      // Find highest confidence age
      const sortedAge = sortAndFormatScores(demographics.age);
      setSelectedAge(actualDemographics?.age || sortedAge[0]?.label || "");

      // Find highest confidence gender
      const sortedGender = sortAndFormatScores(demographics.gender);
      setSelectedGender(
        actualDemographics?.gender || sortedGender[0]?.label || "",
      );
    }
  }, [demographics, actualDemographics]);

  // Helper function to sort and format scores
  const sortAndFormatScores = (categoryData) => {
    if (!categoryData) return [];

    return Object.entries(categoryData)
      .sort(([, a], [, b]) => b - a)
      .map(([key, value]) => ({
        label: key,
        score: (value * 100).toFixed(2),
        rawValue: value,
      }));
  };

  // Get current data based on view
  const getCurrentData = () => {
    switch (currentView) {
      case "race":
        return {
          title:
            sortAndFormatScores(demographics?.race).find(
              (r) => r.label === selectedRace,
            )?.label || selectedRace,
          score:
            sortAndFormatScores(demographics?.race).find(
              (r) => r.label === selectedRace,
            )?.score || "0",
          data: sortAndFormatScores(demographics?.race),
        };
      case "age":
        return {
          title:
            sortAndFormatScores(demographics?.age).find(
              (a) => a.label === selectedAge,
            )?.label || selectedAge,
          score:
            sortAndFormatScores(demographics?.age).find(
              (a) => a.label === selectedAge,
            )?.score || "0",
          data: sortAndFormatScores(demographics?.age),
        };
      case "gender":
        return {
          title:
            sortAndFormatScores(demographics?.gender).find(
              (g) => g.label === selectedGender,
            )?.label || selectedGender,
          score:
            sortAndFormatScores(demographics?.gender).find(
              (g) => g.label === selectedGender,
            )?.score || "0",
          data: sortAndFormatScores(demographics?.gender),
        };
      default:
        return { title: "", score: "0", data: [] };
    }
  };

  const currentData = getCurrentData();

  // Calculate circumference for progress ring
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - (parseFloat(currentData.score) / 100) * circumference;

  // Handle selection clicks
  const handleRaceClick = (race) => {
    setSelectedRace(race);
    setCurrentView("race");
  };

  const handleAgeClick = (age) => {
    setSelectedAge(age);
    setCurrentView("age");
  };

  const handleGenderClick = (gender) => {
    setSelectedGender(gender);
    setCurrentView("gender");
  };

  // Navigate back to select page
  const handleBack = () => {
    navigate("/select", {
      state: {
        image,
        demographics,
        actualDemographics: {
          race: selectedRace,
          age: selectedAge,
          gender: selectedGender,
        },
      },
    });
  };

  if (!demographics) {
    return (
      <div className="summary-page">
        <Header />
        <div className="no-data-message">
          <p>No analysis data available. Please return to the analysis page.</p>
          <Link to="/result" className="back-link">
            Go to Analysis
          </Link>
        </div>
      </div>
    );
  }

  const handleReset = () => {
  navigate("/");
};

  const raceData = sortAndFormatScores(demographics.race);
  const ageData = sortAndFormatScores(demographics.age);
  const genderData = sortAndFormatScores(demographics.gender);

  return (
    <div className="summary-page">
      <Header />

      {/* Page Title */}
      <div className="summary-header">
        <p className="summary-label">A.I. ANALYSIS</p>
        <h1 className="summary-title">DEMOGRAPHICS</h1>
        <p className="summary-subtitle">PREDICTED RACE & AGE</p>
      </div>

      {/* Main Content Area */}
      <div className="summary-content">
        {/* Left Sidebar - Selected Values */}
        <div className="summary-sidebar">
          {/* Race Block */}
          <div
            className={`sidebar-block ${currentView === "race" ? "active" : ""}`}
            onClick={() => setCurrentView("race")}
          >
            <p className="sidebar-value">{selectedRace}</p>
            <p className="sidebar-label">RACE</p>
          </div>

          {/* Age Block */}
          <div
            className={`sidebar-block ${currentView === "age" ? "active" : ""}`}
            onClick={() => setCurrentView("age")}
          >
            <p className="sidebar-value">{selectedAge}</p>
            <p className="sidebar-label">AGE</p>
          </div>

          {/* Gender/Sex Block */}
          <div
            className={`sidebar-block ${currentView === "gender" ? "active" : ""}`}
            onClick={() => setCurrentView("gender")}
          >
            <p className="sidebar-value">{selectedGender}</p>
            <p className="sidebar-label">SEX</p>
          </div>
        </div>

        {/* Center - Large Display with User Image and Progress Ring */}
<div className="summary-center">
  <h2 className="center-title">
    {currentData.title}
    {currentView === "age" && <span className="age-suffix"> y.o.</span>}
  </h2>

  <div className="center-content-row">
    {/* User's captured/uploaded image on the left */}
    {image && (
      <div className="user-image-container">
        <img src={image} alt="Analyzed face" className="user-image" />
      </div>
    )}

    {/* Progress ring on the right */}
    <div className="progress-ring-container">
      <svg
        className="progress-ring"
        width="280"
        height="280"
        viewBox="0 0 280 280"
      >
        {/* Background circle */}
        <circle
          className="progress-ring-bg"
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          className="progress-ring-fg"
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="#1a1b1c"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          transform="rotate(-90 140 140)"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="progress-text">
        <span className="progress-percentage">{currentData.score}%</span>
      </div>
    </div>
  </div>
</div>
        

        {/* Right Panel - All Options List */}
        <div className="summary-options">
          <div className="options-header">
            <span className="options-title">
              {currentView === "race" && "RACE"}
              {currentView === "age" && "AGE"}
              {currentView === "gender" && "SEX"}
            </span>
            <span className="options-confidence">A.I. CONFIDENCE</span>
          </div>

          <div className="options-list">
            {currentView === "race" &&
              raceData.map((item) => (
                <button
                  key={item.label}
                  className={`option-row ${selectedRace === item.label ? "selected" : ""}`}
                  onClick={() => handleRaceClick(item.label)}
                >
                  <span className="option-bullet">◇</span>
                  <span className="option-name">{item.label}</span>
                  <span className="option-score">{item.score}%</span>
                </button>
              ))}

            {currentView === "age" &&
              ageData.map((item) => (
                <button
                  key={item.label}
                  className={`option-row ${selectedAge === item.label ? "selected" : ""}`}
                  onClick={() => handleAgeClick(item.label)}
                >
                  <span className="option-bullet">◇</span>
                  <span className="option-name">{item.label}</span>
                  <span className="option-score">{item.score}%</span>
                </button>
              ))}

            {currentView === "gender" &&
              genderData.map((item) => (
                <button
                  key={item.label}
                  className={`option-row ${selectedGender === item.label ? "selected" : ""}`}
                  onClick={() => handleGenderClick(item.label)}
                >
                  <span className="option-bullet">◇</span>
                  <span className="option-name">{item.label}</span>
                  <span className="option-score">{item.score}%</span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Container */}
      <div className="summary-bottom-nav">
        <button onClick={handleBack} className="back-link-custom">
          <div className="button-diamond">
            <span className="button-arrow">◀</span>
          </div>
          <span className="button-text">BACK</span>
        </button>

        <p className="summary-hint">
          If A.I. estimate is wrong, select the correct one.
        </p>

        <div className="summary-action-buttons">
  <button className="reset-button" onClick={handleReset}>
    RESET
  </button>
  <button className="confirm-button">
    CONFIRM
  </button>
</div>



      </div>
    </div>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Hero from './components/Hero/Hero';
import Testing from './components/Testing/Testing';
import Result from './components/Result/Result'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="result" element={<Result />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
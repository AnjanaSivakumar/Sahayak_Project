import React, { useState } from 'react';
import '../App.css';

function VisualAidCreator() {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    alert('Image generation based on: ' + prompt);
  };

  return (
    <div className="container">
      <h1>Visual Aid Creator</h1>
      <div className="visual-aid-wrapper">
        <div className="left-panel">
          <h2>Image Description</h2>
          <p>Describe the visual you want to create.</p>
          <label>Prompt</label>
          <textarea
            placeholder="e.g., 'A colorful diagram of the water cycle for 5th graders'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button onClick={handleSubmit}>Generate Visual Aid</button>
        </div>
        <div className="right-panel">
          <h2>Generated Visual</h2>
          <p>Your visual aid is waiting to be created.</p>
        </div>
      </div>
    </div>
  );
}

export default VisualAidCreator;

import React, { useState } from 'react';
import '../App.css';

function WorksheetGenerator() {
  const [lessonContent, setLessonContent] = useState('');
  const [topic, setTopic] = useState('');
  const [worksheetType, setWorksheetType] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [generatedWorksheet, setGeneratedWorksheet] = useState('');

  const handleGenerate = () => {
    setGeneratedWorksheet('Your worksheet is being generated...');
    // Later integrate API call here
  };

  return (
    <div className="container">
      <h1 className="main-title">Worksheet Generator</h1>
      <p className="subtitle">Create custom worksheets from your lesson materials in seconds.</p>

      <div className="card-wrapper">
        {/* Left: Form */}
        <div className="card left">
          <h2>Worksheet Details</h2>
          <p className="card-desc">Provide the content and parameters for your new worksheet.</p>

          <label>Lesson Content</label>
          <textarea
            placeholder="Paste the full text from your lesson plan or reading material here..."
            value={lessonContent}
            onChange={(e) => setLessonContent(e.target.value)}
          ></textarea>
          <small>Provide the source text for generating the worksheet questions.</small>

          <label>Topic</label>
          <input
            type="text"
            placeholder="e.g., The American Revolution"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="dropdown-row">
            <div className="dropdown">
              <label>Worksheet Type</label>
              <select value={worksheetType} onChange={(e) => setWorksheetType(e.target.value)}>
                <option value="">Select a type</option>
                <option value="mcq">Multiple Choice</option>
                <option value="fill">Fill in the Blanks</option>
              </select>
            </div>

            <div className="dropdown">
              <label>Grade Level</label>
              <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}>
                <option value="">Select a level</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="2">Grade 3</option>
                <option value="2">Grade 4</option>
              </select>
            </div>
          </div>

          <button onClick={handleGenerate}>Generate Worksheet</button>
        </div>

        {/* Right: Result */}
        <div className="card right">
          <h2>Generated Worksheet</h2>
          <p className="card-desc">Your AI-generated worksheet will appear here.</p>
          <div className="result-box">
            {generatedWorksheet || 'Your worksheet is waiting to be created.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorksheetGenerator;

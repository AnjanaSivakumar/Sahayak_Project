import React, { useState } from 'react';
import '../App.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
 
function WorksheetGenerator() {
  const [lessonContent, setLessonContent] = useState('');
  const [topic, setTopic] = useState('');
  const [worksheetType, setWorksheetType] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [generatedWorksheet, setGeneratedWorksheet] = useState('');
  const [loading, setLoading] = useState(false);
 
  const genAI = new GoogleGenerativeAI("AIzaSyChSs9_0X5QQsLe6vm8h3EGuO_vL-pGG24");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 
  const handleGenerate = async () => {
    if (!lessonContent || !topic || !worksheetType || !gradeLevel) {
      setGeneratedWorksheet("Please fill in all fields.");
      return;
    }
 
    setLoading(true);
    setGeneratedWorksheet('Generating your worksheet...');
 
    const prompt = `Generate a ${worksheetType} worksheet for Grade ${gradeLevel} on the topic "${topic}". Use the following content: ${lessonContent}`;
 
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setGeneratedWorksheet(response.text());
    } catch (error) {
      setGeneratedWorksheet('An error occurred while generating the worksheet.');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
                <option value="Multiple Choice">Multiple Choice</option>
                <option value="Fill in the Blanks">Fill in the Blanks</option>
              </select>
            </div>
 
            <div className="dropdown">
              <label>Grade Level</label>
              <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}>
                <option value="">Select a level</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
              </select>
            </div>
          </div>
 
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Worksheet'}
          </button>
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
 
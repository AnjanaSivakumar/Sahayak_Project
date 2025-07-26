import React, { useState } from 'react';
import '../App.css'; // Make sure your CSS is correctly linked
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown'; // ✅ Markdown parser

function WorksheetGenerator() {
  const [lessonContent, setLessonContent] = useState('');
  const [topic, setTopic] = useState('');
  const [worksheetType, setWorksheetType] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [generatedWorksheet, setGeneratedWorksheet] = useState('');
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GENAI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleGenerate = async () => {
    if (!lessonContent || !topic || !worksheetType || !gradeLevel) {
      setGeneratedWorksheet("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setGeneratedWorksheet('Checking database...');

    const normalizedLessonContent = lessonContent.trim().toLowerCase();
    const normalizedTopic = topic.trim().toLowerCase();
    const normalizedWorksheetType = worksheetType.trim().toLowerCase();
    const normalizedGradeLevel = gradeLevel.trim().toLowerCase();

    const prompt = `Generate a ${worksheetType} worksheet for Grade ${gradeLevel} on the topic "${topic}". Use the following content: ${lessonContent}.If possible generate diagram,images to describe`;

    try {
      const q = query(
        collection(db, 'worksheets'),
        where('lessonContent_lower', '==', normalizedLessonContent),
        where('topic_lower', '==', normalizedTopic),
        where('worksheetType_lower', '==', normalizedWorksheetType),
        where('gradeLevel_lower', '==', normalizedGradeLevel)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0].data();
        setGeneratedWorksheet(doc.generatedWorksheet);
        console.log('Loaded from Firestore');
      } else {
        setGeneratedWorksheet('Generating your worksheet...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const worksheetText = response.text();
        setGeneratedWorksheet(worksheetText);

        await addDoc(collection(db, 'worksheets'), {
          lessonContent,
          topic,
          worksheetType,
          gradeLevel,
          generatedWorksheet: worksheetText,
          timestamp: new Date(),
          lessonContent_lower: normalizedLessonContent,
          topic_lower: normalizedTopic,
          worksheetType_lower: normalizedWorksheetType,
          gradeLevel_lower: normalizedGradeLevel
        });

        console.log('Saved new worksheet to Firestore');
      }
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
                <option value="4">Grade 5</option>
                <option value="4">Grade 6</option>
                <option value="4">Grade 7</option>
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
            {generatedWorksheet ? (
              <ReactMarkdown>{generatedWorksheet}</ReactMarkdown>
            ) : (
              'Your worksheet is waiting to be created.'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorksheetGenerator;

import React, { useState } from 'react';
import { marked } from 'marked';
import '../App.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

const LessonPlanner = () => {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [objectives, setObjectives] = useState('');
  const [duration, setDuration] = useState('');
  const [days, setDays] = useState('');
  const [otherSubject, setOtherSubject] = useState('');
  const [outputFormat, setOutputFormat] = useState({
    outline: true,
    activities: true,
    assessment: false,
    homework: false,
  });
  const [errors, setErrors] = useState({});
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [activeTab, setActiveTab] = useState('input');

  const handleCheckboxChange = (e) => {
    setOutputFormat({
      ...outputFormat,
      [e.target.name]: e.target.checked,
    });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!topic.trim()) newErrors.topic = 'Topic is required';
    if (!grade.trim()) newErrors.grade = 'Grade level is required';
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGeneratePlan = async () => {
    if (!validateFields()) return;

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyChSs9_0X5QQsLe6vm8h3EGuO_vL-pGG24");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Generate a detailed lesson plan on the topic '${topic}' for grade ${grade}.
        Subject: ${subject === 'Other' ? otherSubject : subject}
        Objectives: ${objectives}
        Duration: ${duration}
        Days: ${days}
        Include: ${Object.keys(outputFormat).filter(key => outputFormat[key]).join(', ')}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setGeneratedOutput(response.text());
      setActiveTab('genai');
    } catch (error) {
      setGeneratedOutput('An error occurred while generating the lesson plan.');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <p>Enter a topic and details to generate a custom lesson plan.</p>

      <label>Topic:</label>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g., Introduction to Photosynthesis"
        style={{ width: '100%', marginBottom: '5px' }}
      />
      {errors.topic && <div style={{ color: 'red' }}>{errors.topic}</div>}

      <label>Grade Level:</label>
      <select value={grade} onChange={(e) => setGrade(e.target.value)} style={{ width: '100%', marginBottom: '5px' }}>
        <option value="">Select Grade</option>
        {[...Array(12)].map((_, i) => (
          <option key={i} value={`Grade ${i + 1}`}>{`Grade ${i + 1}`}</option>
        ))}
      </select>
      {errors.grade && <div style={{ color: 'red' }}>{errors.grade}</div>}

      <label>Subject:</label>
      <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', marginBottom: '5px' }}>
        <option value="">Select Subject</option>
        {['Math', 'Science', 'English', 'History', 'Art', 'Other'].map((subj) => (
          <option key={subj} value={subj}>{subj}</option>
        ))}
      </select>
      {errors.subject && <div style={{ color: 'red' }}>{errors.subject}</div>}

      {subject === 'Other' && (
        <>
          <label>Other Subject:</label>
          <input
            type="text"
            value={otherSubject}
            onChange={(e) => setOtherSubject(e.target.value)}
            placeholder="e.g., Environmental Studies"
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </>
      )}

      <label>Learning Objectives:</label>
      <textarea
        value={objectives}
        onChange={(e) => setObjectives(e.target.value)}
        placeholder="e.g., Understand the process of photosynthesis"
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <label>Duration:</label>
      <select value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
        <option value="">Select Duration</option>
        {['30 mins', '45 mins', '1 hour'].map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>

      <label>Days:</label>
      <input
        type="number"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        placeholder="e.g., 5"
        style={{ width: '100%', marginBottom: '10px' }}
      />

<label>Output Format:</label>
<div className="output-format-grid">
  {['outline', 'activities', 'assessment', 'homework'].map((format) => (
    <label key={format} className="output-format-item">
      <input
        type="checkbox"
        name={format}
        checked={outputFormat[format]}
        onChange={handleCheckboxChange}
      />
      {format.charAt(0).toUpperCase() + format.slice(1)}
    </label>
  ))}
</div>


      <button onClick={handleGeneratePlan} style={{ marginTop: '20px' }}>
        Generate Plan
      </button>

      {generatedOutput && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button onClick={() => setActiveTab('input')} style={{ background: activeTab === 'input' ? '#ccc' : '#eee' }}>
              Input Summary
            </button>
            <button onClick={() => setActiveTab('genai')} style={{ background: activeTab === 'genai' ? '#ccc' : '#eee' }}>
              GenAI Response
            </button>
          </div>

          {activeTab === 'input' && (
            <div style={{ padding: '15px', border: '1px solid #ccc', background: '#f9f9f9' }}>
               <pre>
{`
Topic: ${topic}
Grade: ${grade}
Subject: ${subject === 'Other' ? otherSubject : subject}
Objectives: ${objectives}
Duration: ${duration}
Days: ${days}
Output Format: ${Object.keys(outputFormat).filter(key => outputFormat[key]).join(', ')}
`}
              </pre>
            </div>
          )}

         {activeTab === 'genai' && (
  <div className="genai-response-container">
    <div
      className="genai-markdown"
      dangerouslySetInnerHTML={{ __html: marked.parse(generatedOutput) }}
    />
  </div>
)}

        </div>
      )}
    </div>
  );
};

export default LessonPlanner;

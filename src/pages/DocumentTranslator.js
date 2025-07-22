// src/components/DocumentTranslator.js
import React from 'react';
import '../App.css';

const DocumentTranslator = () => {
  return (
    <div className="translator-container">
      <h1>Document Translator</h1>
      <p className="subtitle">Upload a document to translate it into multiple languages.</p>
      <div className="translator-content">
        <div className="left-panel">
          <h2>Translation Setup</h2>
          <p>Upload your document and choose the languages.</p>

          <label>Document</label>
          <div className="upload-box">
            <p>📤 Click to upload or drag and drop</p>
            <p className="upload-hint">PDF, DOCX, TXT, PNG, JPG (max 5MB)</p>
          </div>

          <div className="languages">
            <label>Target Languages</label>
            <p>Select one or more languages to translate to.</p>
            <div className="checkbox-grid">
              {['Spanish', 'French', 'German', 'Japanese', 'Hindi', 'Chinese (Simplified)', 'Arabic'].map(lang => (
                <label key={lang}><input type="checkbox" /> {lang}</label>
              ))}
            </div>
          </div>

          <button className="translate-btn">🌐 Translate Document</button>
        </div>

        <div className="right-panel">
          <h2>Translations</h2>
          <p>The translated content will appear here.</p>
          <div className="placeholder">
            <p>Your translated documents are waiting.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTranslator;

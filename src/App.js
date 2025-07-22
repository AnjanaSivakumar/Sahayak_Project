import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WorkSheetGenerator from './pages/WorkSheetGenerator';
import VisualAidCreator from './pages/VisualAidCreator';
import DocumentTranslator from './pages/DocumentTranslator';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <Link to="/">Worksheet Generator</Link>
          <Link to="/visual-aid">Visual Aid Creator</Link>
          <Link to="/translator">DocumentTranslator</Link>
        </nav>
        <Routes>
          <Route path="/" element={<WorkSheetGenerator />} />
          <Route path="/visual-aid" element={<VisualAidCreator />} />
          <Route path="/translator" element={<DocumentTranslator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WorkSheetGenerator from './pages/WorkSheetGenerator';
import VisualAidCreator from './pages/VisualAidCreator';
import DocumentTranslator from './pages/DocumentTranslator';
import LessonPlanner from './pages/LessonPlanner';
import './App.css';
 
function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <Link to="/">Worksheet Generator</Link>
          <Link to="/visual-aid">Visual Aid Creator</Link>
          <Link to="/translator">DocumentTranslator</Link>
          <Link to="/LessonPlanner">Lesson Planner</Link>
        </nav>
        <Routes>
          <Route path="/" element={<WorkSheetGenerator />} />
          <Route path="/visual-aid" element={<VisualAidCreator />} />
          <Route path="/translator" element={<DocumentTranslator />} />
          <Route path="/LessonPlanner"element={<LessonPlanner/>}/>
        </Routes>
      </div>
    </Router>
  );
}
 
export default App;
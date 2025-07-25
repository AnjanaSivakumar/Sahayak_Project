import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function LessonPlanGenerator () {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [weekNumber, setWeekNumber] = useState("");
  const [agenda, setAgenda] = useState("");
  const [lessonPlan, setLessonPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyBXlWWEhU5SrfSBrUhMwLlu-9Shm8rUcCs");
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  const generateLessonPlan = async () => {
    if (!grade || !subject || !weekNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    const prompt = `
You are a curriculum expert. Generate a weekly lesson plan for:

Grade: ${grade}
Subject: ${subject}
Week Number: ${weekNumber}
${agenda ? `Agenda/Focus: ${agenda}` : ""}

Include:
- Learning objectives (3-4)
- Suggested daily activities (Monday to Friday)
- Any materials/resources required
Keep the output structured and concise.`;

    setLoading(true);
    setLessonPlan("");

    try {
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      setLessonPlan(text);
    } catch (err) {
      console.error("Lesson plan generation error:", err);
      setLessonPlan("Failed to generate lesson plan.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.box}>
      <h2>📘 Weekly Lesson Plan Generator</h2>

      <div style={styles.field}>
        <label>Grade:</label>
        <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} />
      </div>

      <div style={styles.field}>
        <label>Subject:</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <div style={styles.field}>
        <label>Week Number:</label>
        <input type="number" value={weekNumber} onChange={(e) => setWeekNumber(e.target.value)} />
      </div>

      <div style={styles.field}>
        <label>Agenda / Key Focus (optional):</label>
        <textarea value={agenda} onChange={(e) => setAgenda(e.target.value)} />
      </div>

      <button onClick={generateLessonPlan} disabled={loading}>
        {loading ? "Generating..." : "Generate Lesson Plan"}
      </button>

      {lessonPlan && (
        <>
          <h3>📋 Generated Lesson Plan</h3>
          <pre style={styles.output}>{lessonPlan}</pre>
        </>
      )}
    </div>
  );
};

const styles = {
  box: {
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 10,
    background: "#fff",
    maxWidth: 800,
    margin: "0 auto",
  },
  field: {
    marginBottom: 15,
  },
  output: {
    background: "#f9f9f9",
    padding: 15,
    whiteSpace: "pre-wrap",
    borderRadius: 8,
    marginTop: 15,
  },
};

export default LessonPlanGenerator;

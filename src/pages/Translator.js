import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const LANGUAGES = ["Hindi", "Tamil", "Telugu", "Spanish", "French", "German", "Japanese", "Arabic"];

function SummaryTranslator({ summary }) {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translatedSummary, setTranslatedSummary] = useState("");

  const genAI = new GoogleGenerativeAI("AIzaSyBXlWWEhU5SrfSBrUhMwLlu-9Shm8rUcCs");
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  useEffect(() => {
    const translate = async () => {
      if (!summary || !selectedLanguage) return;

      try {
        const prompt = `Translate the following summary into ${selectedLanguage}. Return plain text only.\n\n${summary}`;
        const result = await model.generateContent(prompt);
        const translated = await result.response.text();
        setTranslatedSummary(translated);
      } catch (err) {
        console.error("Translation error:", err);
        setTranslatedSummary("Translation failed.");
      }
    };

    translate();
  }, [selectedLanguage]);

  return (
    <div style={styles.box}>
      <h2>🌐 Translate Summary</h2>
      <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
        <option value="">-- Select Language --</option>
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      {selectedLanguage && (
        <>
          <h3>Translated Summary ({selectedLanguage}):</h3>
          <p>{translatedSummary || "Translating..."}</p>
        </>
      )}
    </div>
  );
}

const styles = {
  box: {
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 10,
    background: "#fff",
  },
};

export default SummaryTranslator;

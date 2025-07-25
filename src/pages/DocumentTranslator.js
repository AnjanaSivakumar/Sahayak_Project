// src/components/DocumentTranslator.js
import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth"; // For DOCX parsing
import { Buffer } from "buffer";
 
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
 
const LANGUAGES = ["Hindi", "Tamil", "Telugu", "Spanish", "French", "German", "Japanese", "Arabic"];
 
function SummaryTranslator() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [loading, setLoading] = useState(false);
 
  const genAI = new GoogleGenerativeAI("AIzaSyB-4CjYbrKU6Oup90MW2LlAT62dYACVO2E");
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
 
  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
 
    setTranslatedSummary("");
    setSelectedLanguage("");
 
    const fileReader = new FileReader();
 
    if (file.type === "application/pdf") {
      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";
 
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          fullText += pageText + "\n";
        }
 
        setDocumentText(fullText.trim());
      };
      fileReader.readAsArrayBuffer(file);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      fileReader.onload = async function () {
        const result = await mammoth.extractRawText({ arrayBuffer: this.result });
        setDocumentText(result.value.trim());
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file type. Upload PDF or DOCX only.");
    }
  };
 
  // Translation effect
  useEffect(() => {
    const translate = async () => {
      if (!documentText || !LANGUAGES.includes(selectedLanguage)) return;
 
      setLoading(true);
      try {
        const prompt = `Translate the following content into ${selectedLanguage}.  Summarize the document
        in one short paragraph (less than 100 words).
        Use just plain text with no markdowns or HTML tags.
        .\n\n${documentText}`;
        const result = await model.generateContent(prompt);
        const translated = await result.response.text();
        setTranslatedSummary(translated);
      } catch (err) {
        console.error("Translation error:", err);
        setTranslatedSummary("Translation failed.");
      }
      setLoading(false);
    };
 
    translate();
  }, [selectedLanguage]);
 
  return (
    <div style={styles.box}>
      <h2>📄 Upload Document & Translate</h2>
     
      <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} />
     
      {documentText && (
        <>
          <h3>Extracted Text:</h3>
          <textarea style={styles.textArea} rows={6} value={documentText} readOnly />
        </>
      )}
 
      <div>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          disabled={!documentText}
        >
          <option value="">-- Select Language --</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
 
      {selectedLanguage && (
        <>
          <h3>Translated Summary ({selectedLanguage}):</h3>
          <p>{loading ? "Translating..." : translatedSummary}</p>
        </>
      )}
 
      {!documentText && <p style={{ color: "red" }}>⚠️ Upload a document to enable translation.</p>}
    </div>
  );
}
 
const styles = {
  box: {
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 10,
    background: "#fff",
    maxWidth: 800,
    margin: "0 auto",
  },
  textArea: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
};
 
export default SummaryTranslator;
 
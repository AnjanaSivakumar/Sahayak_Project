import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada",
  "Spanish", "French", "German", "Japanese", "Arabic"
];

const languageMap = {
  English: "en-US",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Kannada: "kn-IN",
  Spanish: "es-ES",
  French: "fr-FR",
  German: "de-DE",
  Japanese: "ja-JP",
  Arabic: "ar-SA"
};

const LanguageChatBot = () => {
  const [language, setLanguage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);

  const genAI = new GoogleGenerativeAI("AIzaSyA9GDhxgPOCOqJAES9uMDOkQuFvPtQsDNY");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const speak = (text, lang = "en-US") => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = languageMap[language] || "en-US";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setUserInput(speechResult);
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const handlePredefined = async (type) => {
    setIsLoading(true);
    let prompt = "";

    switch (type) {
      case "story":
        prompt = `Tell a short story suitable for children only in ${language}.`;
        break;
      case "poem":
        prompt = `Recite a fun and simple poem for kids only in ${language}.`;
        break;
      case "fact":
        prompt = `Share a fun fact that kids will enjoy only in ${language}.`;
        break;
      default:
        return;
    }

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      setChatHistory((prev) => [...prev, { type: "bot", message: response }]);
      speak(response, languageMap[language]);
    } catch (err) {
      console.error("Error:", err);
      setChatHistory((prev) => [...prev, { type: "bot", message: "⚠️ Error responding." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const prompt = `Explain this to a child only in ${language}: ${userInput}`;
    setChatHistory((prev) => [...prev, { type: "user", message: userInput }]);
    setUserInput("");
    setIsLoading(true);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      setChatHistory((prev) => [...prev, { type: "bot", message: response }]);
      speak(response, languageMap[language]);
    } catch (err) {
      console.error("Error:", err);
      setChatHistory((prev) => [...prev, { type: "bot", message: "⚠️ Sorry, I couldn't answer." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageSelect = (e) => {
    const selected = e.target.value;
    setLanguage(selected);
    setChatHistory([
      { type: "bot", message: `Hi! I'm LingoPal, your multilingual buddy. I can tell you stories, poems, and fun facts. Please pick a language to begin!` }
    ]);
    speak(`Hi! I'm LingoPal, your multilingual buddy. I can tell you stories, poems, and fun facts. Please pick a language to begin!`, languageMap[selected]);
  };

  return (
    <div>
      <div style={styles.floatingButton} onClick={() => setIsOpen(!isOpen)}>
        💬
      </div>

      {isOpen && (
        <div style={styles.chatWindow}>
          {!language ? (
            <div>
              <h3>Hi! I’m <b>LingoPal 🤖</b></h3>
              <p>Which language would you like to chat in?</p>
              <select onChange={handleLanguageSelect} style={styles.select}>
                <option value="">-- Choose Language --</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <h3>LingoPal 🗣️ in {language}</h3>

              <div style={styles.buttonGroup}>
                <button onClick={() => handlePredefined("story")}>📚 Story</button>
                <button onClick={() => handlePredefined("poem")}>🎶 Poem</button>
                <button onClick={() => handlePredefined("fact")}>💡 Fun Fact</button>
                <button onClick={stopSpeaking}>🛑 Stop Voice</button>
              </div>

              <div style={styles.chatBox}>
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    style={msg.type === "user" ? styles.userMsg : styles.botMsg}
                  >
                    {msg.message}
                  </div>
                ))}
                {isLoading && <div style={styles.botMsg}>🤖 Thinking...</div>}
              </div>

              <div style={styles.inputGroup}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your doubt here..."
                  style={styles.input}
                />
                <button onClick={handleSend} style={styles.sendButton}>Send</button>
                <button onClick={startListening} style={styles.micButton}>
                  🎤 {isListening ? "Listening..." : ""}
                </button>
              </div>

              <button onClick={() => setLanguage("")} style={styles.clearButton}>
                🔄 Change Language
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  floatingButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#ff69b4",
    color: "white",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    fontSize: "30px",
    textAlign: "center",
    lineHeight: "60px",
    cursor: "pointer",
    zIndex: 9999,
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
  },
  chatWindow: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "360px",
    backgroundColor: "#fffbea",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
    zIndex: 9998,
    fontFamily: "Comic Sans MS, cursive"
  },
  select: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  chatBox: {
    border: "1px dashed #f39c12",
    padding: "10px",
    height: "200px",
    overflowY: "auto",
    backgroundColor: "#fff",
    marginTop: "15px",
    borderRadius: "8px"
  },
  userMsg: {
    textAlign: "right",
    backgroundColor: "#daf7dc",
    padding: "8px",
    borderRadius: "8px",
    margin: "6px 0"
  },
  botMsg: {
    textAlign: "left",
    backgroundColor: "#dff9fb",
    padding: "8px",
    borderRadius: "8px",
    margin: "6px 0"
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "15px"
  },
  inputGroup: {
    display: "flex",
    gap: "8px",
    marginTop: "12px"
  },
  input: {
    flexGrow: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },
  sendButton: {
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer"
  },
  micButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px",
    cursor: "pointer"
  },
  clearButton: {
    background: "none",
    border: "none",
    color: "#2980b9",
    marginTop: "15px",
    cursor: "pointer",
    fontSize: "14px"
  }
};

export default LanguageChatBot;

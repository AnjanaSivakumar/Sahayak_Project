import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import db from '../firebase';

function SchedulePlanner() {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [testType, setTestType] = useState("Weekly Test");
  const [testDate, setTestDate] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [status, setStatus] = useState("");
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    /* Load Gmail API */
    const initializeGapi = () => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: 'AIzaSyCRxB6F8x5b-PaZ0SBe4E92cy3k1Q7tCq4',
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
        });
      });
    };

    const loadGapiScript = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = initializeGapi;
      document.body.appendChild(script);
    };

    loadGapiScript();
  }, []);

  const handleGoogleLogin = () => {
    /* Google Identity Services login */
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: '892717963035-340askhescn9nlfcja2aglmieshkk5iq.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/gmail.send',
      callback: (response) => {
        if (response.access_token) {
          setAccessToken(response.access_token);
          setStatus("✅ Signed in successfully");
        } else {
          setStatus("❌ Failed to sign in.");
        }
      }
    });
    client.requestAccessToken();
  };

  const sendEmail = async (toEmail, subject, body) => {
    if (!window.gapi.client.gmail) {
      setStatus("❌ Gmail API is not initialized.");
      return;
    }

    const email = [
      "From: me",
      `To: ${toEmail}`,
      `Subject: ${subject}`,
      "",
      body
    ].join("\n");

    const base64EncodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    try {
      const request = window.gapi.client.gmail.users.messages.send({
        userId: 'me',
        resource: {
          raw: base64EncodedEmail
        }
      });
      await request.execute();
      setStatus("✅ Email reminder sent!");
    } catch (err) {
      console.error("❌ Email send error:", err);
      setStatus("❌ Failed to send email.");
    }
  };

  const handleCreateSchedule = async () => {
    if (!grade || !subject || !testDate || !testType) {
      alert("Please fill in all required fields.");
      return;
    }

    setStatus("Creating...");

    try {
      await addDoc(collection(db, "test_schedules"), {
        grade,
        subject,
        testType,
        testDate,
        specialNote,
        createdAt: new Date(),
      });

      setStatus("✅ Test schedule created successfully!");
      setGrade("");
      setSubject("");
      setTestType("Weekly Test");
      setTestDate("");
      setSpecialNote("");

      // Send email if token is available
      if (accessToken) {
        const toEmail = "subasriads@gmail.com";
        const emailSubject = `Reminder: ${testType} for ${subject}`;
        const body = `This is a reminder that your ${testType} for ${subject} is scheduled on ${testDate}.`;
        await sendEmail(toEmail, emailSubject, body);
      } else {
        setStatus("⚠️ Schedule saved, but email not sent. Please sign in.");
      }

    } catch (error) {
      console.error("❌ Firestore error:", error);
      setStatus("❌ Failed to save schedule.");
    }
  };

  return (
    <div style={styles.box}>
      <h2>🗓️ Test Schedule Creator</h2>

      <div style={styles.field}>
        <label>Grade:</label>
        <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} />
      </div>

      <div style={styles.field}>
        <label>Subject:</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <div style={styles.field}>
        <label>Test Type:</label>
        <select value={testType} onChange={(e) => setTestType(e.target.value)}>
          <option value="Assessment">Assessment</option>
          <option value="Weekly Test">Weekly Test</option>
          <option value="Monthly Test">Monthly Test</option>
          <option value="Exam">Exam</option>
        </select>
      </div>

      <div style={styles.field}>
        <label>Test Date:</label>
        <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} />
      </div>

      <div style={styles.field}>
        <label>Special Note (optional):</label>
        <textarea value={specialNote} onChange={(e) => setSpecialNote(e.target.value)} />
      </div>

      <button onClick={handleCreateSchedule}>Create Test Schedule</button>

      <p style={{ marginTop: 15 }}>{status}</p>

      {!accessToken && <button onClick={handleGoogleLogin}>🔐 Sign In with Google</button>}
    </div>
  );
}

const styles = {
  box: {
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 10,
    background: "#fff",
    maxWidth: 600,
    margin: "0 auto",
  },
  field: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "column",
  },
};

export default SchedulePlanner;

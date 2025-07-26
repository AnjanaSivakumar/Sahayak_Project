import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import db from '../firebase';  // Ensure the path is correct
import emailjs from 'emailjs-com';  // Import EmailJS SDK

function SchedulePlanner() {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [testType, setTestType] = useState("Weekly Test");
  const [testDate, setTestDate] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [status, setStatus] = useState("");
  
  // Dummy list of student emails (replace this with dynamic data)
  const studentEmails = [
    'reshmisara2001@gmail.com',
    'sbeaula3@gmail.com',

    // Add more emails as needed
  ];

  // Handle the form submission and email sending
  const handleCreateSchedule = async () => {
    if (!grade || !subject || !testDate || !testType) {
      alert("Please fill in all required fields.");
      return;
    }

    setStatus("Creating...");

    try {
      // Step 1: Add the test schedule to Firestore
      await addDoc(collection(db, "test_schedules"), {
        grade,
        subject,
        testType,
        testDate,
        specialNote,
        createdAt: new Date(),
      });

      // Step 2: Send the email to students using EmailJS
      sendEmailToStudents();

      // Update status after successfully creating the schedule
      setStatus("✅ Test schedule created successfully!");
      
      // Clear the form inputs
      setGrade("");
      setSubject("");
      setTestType("Weekly Test");
      setTestDate("");
      setSpecialNote("");
    } catch (error) {
      console.error("Error creating schedule:", error.message);
      setStatus("❌ Failed to create schedule. Check console.");
    }
  };

  // Function to send email to multiple students using EmailJS
  const sendEmailToStudents = () => {
    // Define the template parameters (data to include in the email)
    const templateParams = {
      grade, 
      subject, 
      testType, 
      testDate, 
      specialNote,
    };

    // Loop through the list of student emails and send an email to each
    studentEmails.forEach((email) => {
      emailjs.send(
        'service_f747ddh',    // Replace with your actual Service ID
        'your_template_id',   // Replace with your actual Template ID
        { ...templateParams, to_email: email },  // Add the email to the template params
        'g2H0WtATjWx2Iua9f'        // Replace with your actual User ID (from EmailJS)
      )
      .then((response) => {
        console.log(`Email sent successfully to ${email}`, response);
      })
      .catch((err) => {
        console.error(`Error sending email to ${email}:`, err);
      });
    });
  };

  return (
    <div style={styles.box}>
      <h2>🗓️ Test Schedule Creator</h2>

      <div style={styles.field}>
        <label>Grade:</label>
        <input 
          type="text" 
          value={grade} 
          onChange={(e) => setGrade(e.target.value)} 
        />
      </div>

      <div style={styles.field}>
        <label>Subject:</label>
        <input 
          type="text" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
        />
      </div>

      <div style={styles.field}>
        <label>Test Type:</label>
        <select 
          value={testType} 
          onChange={(e) => setTestType(e.target.value)} 
        >
          <option value="Assessment">Assessment</option>
          <option value="Weekly Test">Weekly Test</option>
          <option value="Monthly Test">Monthly Test</option>
          <option value="Exam">Exam</option>
        </select>
      </div>

      <div style={styles.field}>
        <label>Test Date:</label>
        <input 
          type="date" 
          value={testDate} 
          onChange={(e) => setTestDate(e.target.value)} 
        />
      </div>

      <div style={styles.field}>
        <label>Special Note (optional):</label>
        <textarea 
          value={specialNote} 
          onChange={(e) => setSpecialNote(e.target.value)} 
        />
      </div>

      <button onClick={handleCreateSchedule}>Create Test Schedule</button>

      {status && <p style={{ marginTop: 20 }}>{status}</p>}
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

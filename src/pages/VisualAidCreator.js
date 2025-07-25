import React, { useState } from 'react';
import { GoogleGenerativeAI, GenerativeModel, Part } from '@google/generative-ai'; // Removed Modality import
import '../App.css'; // Assuming you have your CSS file

function VisualAidCreator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [textOutput, setTextOutput] = useState('');

  // !!! SECURITY WARNING: NEVER EXPOSE YOUR API KEY IN PRODUCTION FRONTEND CODE !!!
  // This is for local testing ONLY. Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual key.
  const API_KEY = 'AIzaSyAkg62gekSSzBFDTcVfAgxkoKn8fdgNAd8'; // <--- Replace with your actual API Key

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      alert('Please enter a description for your visual aid.');
      return;
    }

    setLoading(true);
    setError('');
    setImageUrl(''); // Clear previous image
    setTextOutput(''); // Clear previous text

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      // Use the specific model for image generation
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        // Corrected: Use string literals for responseModalities, not the Modality enum
        config: {
          responseModalities: ["TEXT", "IMAGE"], // Use string literals "TEXT" and "IMAGE"
        },
      });

      const response = result.response;
      let generatedImageUrl = '';
      let generatedText = '';

      // Iterate through the parts of the response to find image and text
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          // Assuming the image is returned as base64 inline data
          generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          generatedText = part.text;
        }
      }

      if (generatedImageUrl) {
        setImageUrl(generatedImageUrl);
        setTextOutput(generatedText);
      } else {
        if (generatedText) {
          setTextOutput(generatedText);
          setError('Model returned text, but no image was generated based on your prompt.');
        } else {
          setError('No image or text generated from the API response. The prompt might have been blocked or no suitable content was found.');
        }
      }

    } catch (err) {
      console.error('Error generating image:', err);
      if (err.message && err.message.includes('API key not valid')) {
          setError('Invalid API Key. Please check your Gemini API key.');
      } else if (err.message && err.message.includes('400')) {
          // This specific 400 error about "responseMimeTypes" should now be gone.
          // Other 400 errors might still occur for invalid prompts etc.
          setError('API request error (400 Bad Request). This might be due to an invalid prompt or model limitations. Details: ' + err.message);
      }
      else {
          setError('Failed to generate image. Please check your prompt and API key. Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Visual Aid Creator 🖼️</h1>
      <div className="visual-aid-wrapper">
        <div className="left-panel">
          <h2>Image Description</h2>
          <p>Describe the visual you want to create. Be specific! ✨</p>
          <label htmlFor="prompt-textarea">Prompt</label>
          <textarea
            id="prompt-textarea"
            placeholder="e.g., 'A colorful diagram of the water cycle for 5th graders' or 'A 3d rendered image of a pig with wings and a top hat flying over a happy futuristic scifi city with lots of greenery'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Visual Aid'}
          </button>
          {error && <p className="error-message">Error: {error}</p>}
        </div>
        <div className="right-panel">
          <h2>Generated Visual</h2>
          {loading && <p>Your visual aid is being created... ⏳</p>}
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="Generated Visual Aid" className="generated-image" />
              {textOutput && <p className="model-text-output">Model says: {textOutput}</p>}
            </>
          ) : (
            !loading && <p>Your visual aid is waiting to be created. Try describing something!</p>
          )}
           {!imageUrl && textOutput && !loading && !error && (
            <p className="model-text-output">Model output: {textOutput}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualAidCreator;

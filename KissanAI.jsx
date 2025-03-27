import React, { useState } from 'react';
import './KissanAI.css'; // Create this CSS file

const KissanAI = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState('english');

  const handleQuery = async () => {
    // Implement your query logic here
    console.log('Querying:', query, 'in', language);
  };

  return (
    <div className="kissan-ai-container">
      <div className="app-header">
        <h1>Kissan.AI 🌾</h1>
        <p>Your Agricultural Assistant</p>
      </div>

      <div className="chatbot-section">
        <div className="language-selector">
          <label>Select Language:</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-dropdown"
          >
            <option value="english">English</option>
            <option value="hindi">हिन्दी</option>
          </select>
        </div>

        <div className="query-input-container">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a farming question..."
            className="query-input"
          />
          <button 
            onClick={handleQuery}
            className="query-button"
          >
            Get Advice
          </button>
        </div>

        {response && (
          <div className="response-container">
            <h3>AI Response:</h3>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KissanAI;
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send } from 'lucide-react';

const KissanAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('english');
  const [isListening, setIsListening] = useState(false);
  const websocketRef = useRef(null);

  useEffect(() => {
    // WebSocket Connection
    websocketRef.current = new WebSocket('ws://localhost:8000/ws');
    
    websocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, { 
        text: data.response, 
        sender: 'ai' 
      }]);
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          query: input,
          language: language
        }));
      }
      
      setInput('');
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.start();
      setIsListening(true);
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-green-600 text-white p-4 text-center">
        <h1 className="text-xl font-bold">Kissan.AI</h1>
      </div>
      
      <div className="p-4 space-y-2">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>
      </div>
      
      <div className="h-96 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet. Start a conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-2 p-2 rounded ${
                msg.sender === 'user' 
                  ? 'bg-blue-100 text-right' 
                  : 'bg-green-100 text-left'
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>
      
      <div className="flex p-4">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a farming question..."
          className="flex-grow p-2 border rounded-l"
        />
        <button 
          onClick={handleVoiceInput}
          className={`p-2 ${
            isListening ? 'bg-red-500' : 'bg-green-500'
          } text-white`}
        >
          <Mic />
        </button>
        <button 
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-r"
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default KissanAI;

import React, { useState } from 'react';
import axios from 'axios';
import './QNAComponent.css';  
import botI from "../assests/bot.png" ;

const QNAComponent = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Add user message to chat
    setMessages([...messages, { text: question, sender: 'user' }]);
    
    try {
      const response = await axios.post('http://localhost:5000/ask', { question });
      setAnswer(response.data.answer);
      // Add bot response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.answer, sender: 'bot' },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "An error occurred while fetching the answer.", sender: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
    setQuestion('');
  };

  return (
    <div className="chat-container">
      {/* left box */}
      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Type your question here"
            required
            className="chat-input"
          />
          <button type="submit" disabled={loading} className="chat-submit-btn">
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>

      {/* right box */}
      <div className='rightImg'>
        <img
        src={botI}
        />
      </div>
    </div>
  );
};

export default QNAComponent;

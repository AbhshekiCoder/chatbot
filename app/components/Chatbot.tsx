"use client"
import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: userInput, bot: '' },
    ]);
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyCpgaSyevRj5gq5Cz4rsN_4ro2OFOrArQk");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
   
    console.log(userInput)
      const data = await model.generateContent(userInput);
      
    

    

      // Add bot response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: '', bot: data.response.text() || 'No response received from the model.' },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: '', bot: `${error}`},
      ]);
    } finally {
      setUserInput('');
      setLoading(false);
    }
  };

  return (
    <> 
    <div style={{ width: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Chatbot</h2>
      <div style={{ height: '300px', overflowY: 'auto', marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        {messages?messages.map((message, index) => (
          <div key={index}>
            {message.user && <div className=' ' style={{backgroundColor: "azure",  padding: "5px"}}><strong>You:</strong> {message.user}</div>}
            {message.bot && <div style={{backgroundColor: "orange", color: "white", padding: "5px", marginTop:"10px"}}><strong>Bot:</strong> {message.bot}</div>}
          </div>
        )):"Loading..."}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          style={{ width: '100%', padding: '8px', border: 'solid 2px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px', marginTop: '10px', border: "solid 2px" }}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
    </>
  );
};

export default Chatbot;

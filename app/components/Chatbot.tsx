import React, { useState } from 'react';

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
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();

      // Add bot response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: '', bot: data.response || 'No response received from the model.' },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: '', bot: 'Error occurred, please try again!' },
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
        {messages.map((message, index) => (
          <div key={index}>
            {message.user && <div><strong>You:</strong> {message.user}</div>}
            {message.bot && <div><strong>Bot:</strong> {message.bot}</div>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          style={{ width: '100%', padding: '8px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px', marginTop: '10px' }}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
    </>
  );
};

export default Chatbot;

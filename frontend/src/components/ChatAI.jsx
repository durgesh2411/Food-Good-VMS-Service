import React, { useState } from 'react';
import axios from 'axios';

const ChatAI = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/chat', { message: input });
      setResponse(res.data.reply);
    } catch (error) {
      setResponse('Error: ' + error.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">AI Customer Support</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows="4"
        className="w-full border p-2 rounded mb-2"
        placeholder="Ask your question..."
      />
      <button
        onClick={askAI}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Thinking...' : 'Ask AI'}
      </button>
      {response && (
        <div className="mt-4 p-3 bg-gray-100 border rounded">
          <strong>AI:</strong> {response}
        </div>
      )}
    </div>
  );
};

export default ChatAI;
// Test file to verify login functionality
import React, { useState } from 'react';
import api from './utils/api';

function LoginTest() {
  const [email, setEmail] = useState('test@ciphervault.com');
  const [password, setPassword] = useState('Test@1234!');
  const [result, setResult] = useState('');

  const testLogin = async () => {
    try {
      setResult('Testing login...');
      const response = await api.post('/auth/login', { email, password });
      setResult(`Success: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setResult(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black' }}>
      <h2>Login Test</h2>
      <div>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ marginBottom: '10px', padding: '5px' }}
        />
      </div>
      <div>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ marginBottom: '10px', padding: '5px' }}
        />
      </div>
      <button onClick={testLogin} style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>
        Test Login
      </button>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        {result}
      </div>
    </div>
  );
}

export default LoginTest;

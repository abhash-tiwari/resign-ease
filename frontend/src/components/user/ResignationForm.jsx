import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ResignationForm = () => {
  const [lwd, setLwd] = useState('');
  const [status, setStatus] = useState({ message: '', error: false });
 const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/resign', { lwd });
      setStatus({ message: 'Resignation submitted successfully', error: false });
      setLwd('');
    } catch (error) {
      setStatus({ 
        message: error.response?.data?.message || 'Failed to submit resignation', 
        error: true 
      });
    }
    setTimeout(() => {
      
      navigate('/dashboard')
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Submit Resignation</h2>
      {status.message && (
        <div className={`mb-4 p-3 rounded ${
          status.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {status.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Last Working Day</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={lwd}
            onChange={(e) => setLwd(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit Resignation
        </button>
      </form>
    </div>
  );
};

export default ResignationForm;
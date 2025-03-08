import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const DEFAULT_QUESTIONS = [
  "How would you describe your relationship with your manager?",
  "What did you like most about working here?",
  "What did you like least about working here?",
  "How would you describe the company culture?",
];

const ExitQuestionnaire = () => {
  const [responses, setResponses] = useState(
    DEFAULT_QUESTIONS.map(q => ({ questionText: q, response: '' }))
  );
  const [status, setStatus] = useState({ message: '', error: false });
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubmissionStatus = async () => {
      try {
        const response = await api.get('/user/responses/status');
        if (response.data.submitted) {
          setAlreadySubmitted(true);
          setStatus({ 
            message: 'You have already submitted an exit questionnaire. Multiple submissions are not allowed.', 
            error: true 
          });
        }
      } catch (error) {
        console.error('Error checking submission status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubmissionStatus();
  }, []);

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index].response = value;
    setResponses(newResponses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (alreadySubmitted) {
      setStatus({ 
        message: 'You have already submitted an exit questionnaire. Multiple submissions are not allowed.', 
        error: true 
      });
      return;
    }

    try {
      const response = await api.post('/user/responses', { responses });
      setStatus({ message: 'Exit questionnaire submitted successfully', error: false });
      
      if (response.data.submitted) {
        setAlreadySubmitted(true);
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      if (error.response?.status === 409) {
        setAlreadySubmitted(true);
        setStatus({ 
          message: error.response?.data?.message || 'You have already submitted the questionnaire.', 
          error: true 
        });
      } else {
        setStatus({ 
          message: error.response?.data?.message || 'Failed to submit questionnaire', 
          error: true 
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Exit Interview Questionnaire</h2>
      {status.message && (
        <div className={`mb-4 p-3 rounded ${
          status.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {status.message}
        </div>
      )}
      
      {alreadySubmitted ? (
        <div className="text-center">
          <p className="mb-4">Thank you for your previous submission.</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {responses.map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="block font-medium">{item.questionText}</label>
              <textarea
                className="w-full p-2 border rounded min-h-[30px]"
                value={item.response}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                required
              />
            </div>
          ))}
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={alreadySubmitted}
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default ExitQuestionnaire;
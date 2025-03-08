import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [submissionPage, setSubmissionPage] = useState(false);
  const [resignationStatus, setResignationStatus] = useState(null);
  const [userName, setUserName] = useState('Abhash');
  const [resignationData, setResignationData] = useState({
    reason: '',
    lastWorkingDay: ''
  });
  const [status, setStatus] = useState({ 
    message: '', 
    error: false,
    visible: false 
  });

  const getUserStorageKey = (key) => {
    return `user_${userName}_${key}`;
  };

  useEffect(() => {
    fetchResignationStatus();
    
    const savedReason = localStorage.getItem(getUserStorageKey('resignationReason'));
    if (savedReason) {
      setResignationData(prev => ({
        ...prev,
        reason: savedReason
      }));
    }
  }, []);

  const fetchResignationStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/resignation_status');
      setResignationStatus(response.data.resignation);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resignation status:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResignationData({
      ...resignationData,
      [name]: value
    });
  };

  const navigateToSubmitPage = () => {
    setSubmissionPage(true);
  };

  const handleCancel = () => {
    setSubmissionPage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      localStorage.setItem(getUserStorageKey('resignationReason'), resignationData.reason);
      
      await api.post('/user/resign', { 
        lwd: resignationData.lastWorkingDay
      });
      
      setStatus({ 
        message: 'Resignation submitted successfully', 
        error: false,
        visible: true 
      });
      
      await fetchResignationStatus();
      setSubmissionPage(false);
      
    } catch (error) {
      console.error('Submission error details:', error.response?.data, error.response?.status);
      setStatus({ 
        message: error.response?.data?.message || 'Failed to submit resignation', 
        error: true,
        visible: true
      });
    }
    
    setTimeout(() => {
      setStatus(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (submissionPage) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6">Submit Resignation</h2>
          
          {status.visible && (
            <div className={`mb-4 p-3 rounded ${status.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {status.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="reason">
                Reason for Resignation
              </label>
              <textarea
                id="reason"
                name="reason"
                value={resignationData.reason}
                onChange={handleInputChange}
                placeholder="Please provide the reason for your resignation"
                className="w-full border border-gray-300 p-3 rounded min-h-32"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="lastWorkingDay">
                Intended Last Working Day
              </label>
              <p className="text-gray-600 text-sm mb-2">Note: The date cannot be a weekend or a holiday.</p>
              <input
                id="lastWorkingDay"
                name="lastWorkingDay"
                type="date"
                value={resignationData.lastWorkingDay}
                onChange={handleInputChange}
                placeholder="dd-mm-yyyy"
                className="w-full border border-gray-300 p-3 rounded"
                required
              />
            </div>
            
            <div className="flex justify-between">
              <button 
                type="button" 
                onClick={handleCancel} 
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit Resignation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-8">Welcome</h2>
        
        {status.visible && (
          <div className={`mb-4 p-3 rounded ${status.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status.message}
          </div>
        )}
        
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-xl font-semibold mb-3">Resignation Status</h3>
          
          {resignationStatus ? (
            <div className="space-y-3">
              <p>
                Latest Status: 
                <span className={`ml-2 font-medium ${
                  resignationStatus.status === 'pending' ? 'text-yellow-600' :
                  resignationStatus.status === 'approved' ? 'text-green-600' :
                  resignationStatus.status === 'rejected' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {resignationStatus.status.charAt(0).toUpperCase() + resignationStatus.status.slice(1)}
                </span>
              </p>
              
              {resignationStatus.status === 'approved' && (
                <>
                  <p>Exit Date: {new Date(resignationStatus.approvedLwd || resignationStatus.lwd).toLocaleDateString()}</p>
                  <p>Please complete your exit interview before your last day.</p>
                  
                </>
              )}
              
              {resignationStatus.status === 'pending' && (
                <>
                  <p>Requested Last Working Day: {new Date(resignationStatus.lwd).toLocaleDateString()}</p>
                  {localStorage.getItem(getUserStorageKey('resignationReason')) && (
                    <p>Reason: {localStorage.getItem(getUserStorageKey('resignationReason'))}</p>
                  )}
                </>
              )}
              
              {resignationStatus.status === 'rejected' && (
                <>
                  <p>Requested Last Working Day: {new Date(resignationStatus.lwd).toLocaleDateString()}</p>
                  <p className="text-red-600">Reason for rejection: {resignationStatus.rejectionReason || 'No reason provided'}</p>
                  <button
                    onClick={navigateToSubmitPage}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit New Request
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p>You haven't submitted any resignation requests yet.</p>
              <button 
                onClick={navigateToSubmitPage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit Resignation
              </button>
            </div>
          )}
        </div>
        
        {resignationStatus && resignationStatus.status === 'approved' && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Exit Interview</h3>
            <Link 
                    to="/exit-interview"
                    className="inline-block mt-2 text-blue-500 hover:text-blue-700 underline"
                  >
                    Exit Interview
                  </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
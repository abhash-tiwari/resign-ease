import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../services/api";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    pendingResignations: 0,
    approvedResignations: 0,
    rejectedResignations: 0,
    pendingExitInterviews: 0,
    completedExitInterviews: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const resignationsResponse = await api.get('/admin/resignations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const exitResponsesResponse = await api.get('/admin/exit_responses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const resignationsData = resignationsResponse.data?.data || [];
      const exitResponsesData = exitResponsesResponse.data?.data || [];
      
      const pending = resignationsData.filter(r => r.status === 'pending').length;
      const approved = resignationsData.filter(r => r.status === 'approved').length;
      const rejected = resignationsData.filter(r => r.status === 'rejected').length;
      
      const completedInterviews = exitResponsesData.filter(e => e.submittedAt).length;
      
      const pendingInterviews = Math.max(0, approved - completedInterviews);
      
      setDashboardData({
        pendingResignations: pending,
        approvedResignations: approved,
        rejectedResignations: rejected,
        pendingExitInterviews: pendingInterviews,
        completedExitInterviews: completedInterviews
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">HR Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Pending Resignations</h2>
          <div className="flex items-center mb-2">
            <span className="text-3xl font-bold text-gray-900">{dashboardData.pendingResignations}</span>
            {dashboardData.pendingResignations > 0 && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Needs Review</span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-3">Resignation requests waiting for your review.</p>
          <button 
            onClick={() => handleCardClick('/admin/resignations')}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            View All Resignations
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Approved Resignations</h2>
          <div className="flex items-center mb-2">
            <span className="text-3xl font-bold text-gray-900">{dashboardData.approvedResignations}</span>
          </div>
          <p className="text-gray-600 text-sm">Resignations that have been approved and are in progress.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Rejected Resignations</h2>
          <div className="flex items-center mb-2">
            <span className="text-3xl font-bold text-gray-900">{dashboardData.rejectedResignations}</span>
          </div>
          <p className="text-gray-600 text-sm">Resignations that have been rejected.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Pending Exit Interviews</h2>
          <div className="flex items-center mb-2">
            <span className="text-3xl font-bold text-gray-900">{dashboardData.pendingExitInterviews}</span>
            {dashboardData.pendingExitInterviews > 0 && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Needs Follow-up</span>
            )}
          </div>
          <p className="text-gray-600 text-sm">Exit interviews yet to be completed by employees.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Completed Exit Interviews</h2>
          <div className="flex items-center mb-2">
            <span className="text-3xl font-bold text-gray-900">{dashboardData.completedExitInterviews}</span>
          </div>
          <p className="text-gray-600 text-sm mb-3">Exit interviews completed by employees.</p>
          <button 
            onClick={() => handleCardClick('/admin/exit-responses')}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            View Exit Interviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import ResignationModal from "./ResignationModal";

const ResignationList = () => {
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newLWD, setNewLWD] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResignation, setSelectedResignation] = useState(null);

  useEffect(() => {
    fetchResignations();
  }, []);

  const fetchResignations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      const response = await api.get("/admin/resignations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error("Invalid API response");
      }

      const enhancedResignations = response.data.data.map(resignation => {
        if ((!resignation.reason || resignation.reason.trim() === '') && resignation.employeeId?._id) {
          const storedReason = localStorage.getItem(`resignationReason_${resignation.employeeId._id}`);
          if (storedReason) {
            return { ...resignation, reason: storedReason };
          }
        }
        return resignation;
      });

      setResignations(enhancedResignations);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching resignations:", error.response || error);
      setError(error.response?.data?.message || "Failed to fetch resignations");
      setLoading(false);
    }
  };

  const handleConclude = async (resignationId, approved, lwd, comments = "") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }

      const reviewDate = new Date().toISOString().split('T')[0];

      await api.put(
        "/admin/conclude_resignation",
        { 
          resignationId, 
          approved, 
          lwd, 
          comments,
          reviewDate
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const concludedResignation = resignations.find(r => r._id === resignationId);
      
      if (approved && concludedResignation?.employeeId?._id) {
        localStorage.removeItem(`resignationReason_${concludedResignation.employeeId._id}`);
      }

      fetchResignations();
    } catch (error) {
      setError("Failed to update resignation");
      console.error("Error updating resignation:", error.response || error);
    }
  };

  const openApprovalModal = (resignation) => {
    setSelectedResignation(resignation);
    setModalOpen(true);
  };

  const getResignationReason = (resignation) => {
    if (resignation.reason && resignation.reason.trim() !== '') {
      return resignation.reason;
    }
    
    if (resignation.employeeId?._id) {
      const storedReason = localStorage.getItem(`resignationReason_${resignation.employeeId._id}`);
      if (storedReason) {
        return storedReason;
      }
    }
    
    return "-";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Resignation Requests
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-sm font-semibold text-gray-900 py-3 px-6">
                    Employee
                  </th>
                  <th className="text-left text-sm font-semibold text-gray-900 py-3 px-6">
                    Applied Date
                  </th>
                  <th className="text-left text-sm font-semibold text-gray-900 py-3 px-6">
                    -
                  </th>
                  <th className="text-left text-sm font-semibold text-gray-900 py-3 px-6">
                    -
                  </th>
                  <th className="text-left text-sm font-semibold text-gray-900 py-3 px-6">
                    Status
                  </th>
                  <th className="text-left text-sm font-semibold text-gray-900 py-3 px-6">
                    Requested Date
                  </th>
                  <th className="text-left text-sm font-semibold text-gray-900 py-3 px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resignations.map((resignation) => (
                  <tr key={resignation._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium">
                            {resignation.employeeId?.username || "Unknown"}
                          </div>
                          <div className="text-gray-500">
                            {resignation.employeeId?.email || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {resignation.createdAt
                        ? new Date(resignation.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {getResignationReason(resignation)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {resignation.reviewDate
                        ? new Date(resignation.reviewDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          resignation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : resignation.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {resignation.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {resignation.lwd
                        ? new Date(resignation.lwd).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {resignation.status === "pending" ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openApprovalModal(resignation)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleConclude(resignation._id, false, resignation.lwd)
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-500"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ResignationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        resignation={selectedResignation}
        onApprove={handleConclude}
      />
    </div>
  );
};

export default ResignationList;
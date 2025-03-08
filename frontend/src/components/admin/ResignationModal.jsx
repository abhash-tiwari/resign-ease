import React, { useState } from "react";

const ResignationModal = ({ isOpen, onClose, resignation, onApprove }) => {
  const [exitDate, setExitDate] = useState(
    resignation?.lwd ? new Date(resignation.lwd).toISOString().split("T")[0] : ""
  );
  const [comments, setComments] = useState("");
  
  const today = new Date().toISOString().split("T")[0];

  if (!isOpen) return null;

  const handleApprove = () => {
    if (!exitDate) {
        alert("Please select an exit date before confirming.");
        return;
      }
    onApprove(resignation._id, true, exitDate, comments);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Approve Resignation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="mb-2">
              <span className="font-semibold">Employee:</span>{" "}
              {resignation?.employeeId?.username || "Unknown"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Intended Last Day:</span>{" "}
              {resignation?.lwd
                ? new Date(resignation.lwd).toLocaleDateString()
                : "N/A"}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Review Date:</span>{" "}
              {today ? new Date(today).toLocaleDateString() : "Today"}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="exitDate" className="block text-sm font-medium text-gray-700 mb-1">
              Set Exit Date
            </label>
            <input
              type="date"
              id="exitDate"
              value={exitDate}
              onChange={(e) => setExitDate(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments (Optional)
            </label>
            <textarea
              id="comments"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResignationModal;
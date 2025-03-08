import React, { useState, useEffect } from "react";
import api from "../../services/api";

const ExitResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      const response = await api.get("/admin/exit_responses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data); 

      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error("Invalid API response format");
      }

      setResponses(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching responses:", error.response || error);
      setError(error.response?.data?.message || "Failed to fetch exit responses");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Exit Interview Responses</h2>
      <div className="space-y-8">
        {responses.map((response) => (
          <div key={response._id || Math.random()} className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">
              Employee: {response.employeeId?.username || "Unknown"}
            </h3>
            <div className="space-y-4">
              {Array.isArray(response.responses) &&
                response.responses.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded">
                    <p className="font-medium mb-2">{item?.questionText || "No question"}</p>
                    <p className="text-gray-700">{item?.response || "No response provided"}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExitResponses;

import React, { useState, useEffect } from "react";
import axios from "axios";
import PDFGenerator from "../components/pdfGenerator"; // Import the PDFGenerator component

// Define the interface for the call data
interface CallData {
  _id: string;
  subject: string;
  callType: string;
  callStartTime: string;
  callDuration: number;
  relatedTo: string;
  contactName: string;
  callOwner: string;
}

export const CallData: React.FC = () => {
  const [calls, setCalls] = useState<CallData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const callsPerPage = 10;

  // Fetch call data when the component is mounted
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await axios.get("https://crm-deployment-five.vercel.app/api/calls");
        const sortedCalls = response.data.sort(
          (a: CallData, b: CallData) =>
            new Date(b.callStartTime).getTime() - new Date(a.callStartTime).getTime()
        ); // Sort by most recent
        setCalls(sortedCalls); // Set the retrieved call data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching call data:", err);
        setError("Failed to fetch call data.");
        setLoading(false);
      }
    };

    fetchCalls(); // Call the fetch function
  }, []); // The empty array ensures this runs only once when the component mounts

  // Pagination logic
  const indexOfLastCall = currentPage * callsPerPage;
  const indexOfFirstCall = indexOfLastCall - callsPerPage;
  const currentCalls = calls.slice(indexOfFirstCall, indexOfLastCall);

  const totalPages = Math.ceil(calls.length / callsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Prepare the table data for PDFGenerator
  const columns = [
    "Subject",
    "Call Type",
    "Call Start Time",
    "Duration (mins)",
    "Related To",
    "Contact Name",
    "Call Owner",
  ];

  const data = calls.map((call) => [
    call.subject,
    call.callType,
    new Date(call.callStartTime).toLocaleString(),
    call.callDuration,
    call.relatedTo,
    call.contactName,
    call.callOwner,
  ]);

  // Display a loading message while fetching data
  if (loading) {
    return <div className="text-center text-lg">Loading call data...</div>;
  }

  // Display an error message if data fetching fails
  if (error) {
    return <div className="text-center text-red-500 text-lg">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">CALL LIST</h2>

      <div className="overflow-x-auto mb-6">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Subject</th>
              <th className="border px-2 py-1">Call Type</th>
              <th className="border px-2 py-1">Call Start Time</th>
              <th className="border px-2 py-1">Duration (mins)</th>
              <th className="border px-2 py-1">Related To</th>
              <th className="border px-2 py-1">Contact Name</th>
              <th className="border px-2 py-1">Call Owner</th>
            </tr>
          </thead>
          <tbody>
            {currentCalls.map((call) => (
              <tr key={call._id} className="hover:bg-gray-50">
                <td className="py-3 px-6 text-left">{call.subject}</td>
                <td className="border px-2 py-1">{call.callType}</td>
                <td className="border px-2 py-1">
                  {new Date(call.callStartTime).toLocaleString()}
                </td>
                <td className="border px-2 py-1">{call.callDuration}</td>
                <td className="border px-2 py-1">{call.relatedTo}</td>
                <td className="border px-2 py-1">{call.contactName}</td>
                <td className="border px-2 py-1">{call.callOwner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-2 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Next
        </button>
      </div>

      {/* PDF Generator Button */}
      <PDFGenerator
        columns={columns}
        data={data}
        fileName="calls_report.pdf"
        buttonLabel="Download Call Report"
      />
    </div>
  );
};

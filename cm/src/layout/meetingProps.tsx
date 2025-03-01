import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PDFGenerator from "../components/pdfGenerator"; // Import the PDFGenerator component

// Define the TypeScript interface for a meeting
interface Meeting {
  _id: string;
  title: string;
  from: Date;
  to: Date;
  relatedTo: string;
  contactName: string;
  host: string;
}

const MeetingsList: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]); // State with typed array of meetings
  const [loading, setLoading] = useState<boolean>(true);   // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Items per page state

  // Fetch meetings when the component mounts
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get<Meeting[]>('https://crm-deployment-five.vercel.app/api/meetings'); // Typed axios call
        setMeetings(response.data);
        setLoading(false);
      } catch (err: any) { // Handling potential errors
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading) {
    return <p className="text-center text-lg">Loading meetings...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">Error loading meetings: {error}</p>;
  }

  // Pagination logic
  const indexOfLastMeeting = currentPage * itemsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - itemsPerPage;
  const currentMeetings = meetings.slice(indexOfFirstMeeting, indexOfLastMeeting);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(meetings.length / itemsPerPage);

  // Columns for the PDF report
  const columns = [
    'Title',
    'From',
    'To',
    'Related To',
    'Contact Name',
    'Host',
  ];

  // Data for the PDF report - now formatted as an array of arrays
  const data = currentMeetings.map((meeting) => [
    meeting.title,
    new Date(meeting.from).toLocaleDateString(),
    new Date(meeting.to).toLocaleDateString(),
    meeting.relatedTo,
    meeting.contactName,
    meeting.host,
  ]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">MEETING LIST</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">From</th>
              <th className="py-3 px-6 text-left">To</th>
              <th className="py-3 px-6 text-left">Related To</th>
              <th className="py-3 px-6 text-left">Contact Name</th>
              <th className="py-3 px-6 text-left">Host</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {currentMeetings.map((meeting) => (
              <tr key={meeting._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{meeting.title}</td>
                <td className="py-3 px-6 text-left">{new Date(meeting.from).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{new Date(meeting.to).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{meeting.relatedTo}</td>
                <td className="py-3 px-6 text-left">{meeting.contactName}</td>
                <td className="py-3 px-6 text-left">{meeting.host}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded"
        >
          Next
        </button>
      </div>

      {/* PDF Generator Button */}
      <PDFGenerator
        columns={columns}
        data={data}
        fileName="meetings_report.pdf"
        buttonLabel="Download Meetings Report"
      />
    </div>
  );
};

export default MeetingsList;

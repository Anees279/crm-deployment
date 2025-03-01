import React, { useState, useEffect } from 'react';
import PDFGenerator from "../components/pdfGenerator"; // Import the PDFGenerator component
import axios from 'axios';

interface ILead {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  owner: string;
}

const LeadComponent: React.FC = () => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10; // Number of leads per page

  useEffect(() => {
    // Fetch leads from the backend API
    const fetchLeads = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/leads'); // Adjust URL if needed
        setLeads(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching leads');
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Pagination logic
  const indexOfLastLead = currentPage * rowsPerPage;
  const indexOfFirstLead = indexOfLastLead - rowsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);

  const totalPages = Math.ceil(leads.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Define columns as a simple array of strings for PDFGenerator
  const columns = ['Lead Name', 'Company', 'Email', 'Phone', 'Lead Source', 'Lead Owner'];

  // Prepare data for the PDF (converting the leads into an array of values)
  const data = currentLeads.map(lead => [
    lead.name,
    lead.company,
    lead.email,
    lead.phone,
    lead.source,
    lead.owner,
  ]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">LEADS</h2>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border text-sm sm:text-base">Lead Name</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Company</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Email</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Phone</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Lead Source</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Lead Owner</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead) => (
              <tr key={lead._id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 border text-sm sm:text-base">{lead.name}</td>
                <td className="px-4 py-2 border text-sm sm:text-base">{lead.company}</td>
                <td className="px-4 py-2 border text-sm sm:text-base">{lead.email}</td>
                <td className="px-4 py-2 border text-sm sm:text-base">{lead.phone}</td>
                <td className="px-4 py-2 border text-sm sm:text-base">{lead.source}</td>
                <td className="px-4 py-2 border text-sm sm:text-base">{lead.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 flex-wrap gap-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Next
        </button>
      </div>

      {/* PDF Generation Button */}
      <PDFGenerator
        columns={columns}
        data={data}
        fileName="leads_report.pdf"
        buttonLabel="Download Leads Report"
      />
    </div>
  );
};

export default LeadComponent;

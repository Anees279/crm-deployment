import React, { useState, useEffect } from 'react';
import PDFGenerator from "../components/pdfGenerator"; // Import the PDFGenerator component
import axios from 'axios';

// Define the structure of a single client
interface Client {
  _id: string;
  accountName: string;
  phone: string;
  website: string;
  accountOwner: string;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  // Fetch client data from API on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/clients');
        setClients(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching clients');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Pagination logic
  const indexOfLastClient = currentPage * rowsPerPage;
  const indexOfFirstClient = indexOfLastClient - rowsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const totalPages = Math.ceil(clients.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Define columns (header names for the PDF)
  const columns = [
    'Account Name',
    'Phone',
    'Website',
    'Account Owner'
  ];

  // Prepare data for the PDF (converting the clients into an array of values)
  const data = currentClients.map(client => [
    client.accountName,
    client.phone,
    client.website,
    client.accountOwner
  ]);

  // Render loading, error, or client data
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full p-4">
           <h2 className="text-2xl font-bold mb-4 text-center">ACCOUNTS</h2>


      {/* Display client data */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300 bg-gray-100">Account Name</th>
              <th className="px-4 py-2 border border-gray-300 bg-gray-100">Phone</th>
              <th className="px-4 py-2 border border-gray-300 bg-gray-100">Website</th>
              <th className="px-4 py-2 border border-gray-300 bg-gray-100">Account Owner</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map((client) => (
              <tr key={client._id} className="text-center hover:bg-gray-100">
                <td className="px-4 py-2 border border-gray-300">{client.accountName}</td>
                <td className="px-4 py-2 border border-gray-300">{client.phone}</td>
                <td className="px-4 py-2 border border-gray-300">{client.website}</td>
                <td className="px-4 py-2 border border-gray-300">{client.accountOwner}</td>
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
          className={`px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-2 rounded ${
              currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </div>

      {/* PDF Generation Button */}
      <PDFGenerator
        columns={columns}
        data={data}
        fileName="clients_report.pdf"
        buttonLabel="Download Clients Report"
      />
    </div>
  );
};

export default ClientList;

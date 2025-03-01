import React, { useState, useEffect } from 'react';
import PDFGenerator from "../components/pdfGenerator"; // Import the PDFGenerator component
import axios from 'axios';

interface Contact {
  _id: string;
  contactName: string;
  accountName: string;
  email: string;
  phone: string;
  owner: string;
}

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10; // Define the number of rows per page

  useEffect(() => {
    // Fetch contacts from the backend
    const fetchContacts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/contacts');
        setContacts(response.data); // Set the contacts in state
      } catch (err) {
        setError('Error fetching contacts');
        console.error(err);
      }
    };

    fetchContacts();
  }, []);

  // Pagination logic
  const indexOfLastContact = currentPage * rowsPerPage;
  const indexOfFirstContact = indexOfLastContact - rowsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  const totalPages = Math.ceil(contacts.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Define columns (header names for the PDF)
  const columns = [
    'Contact Name', 
    'Account Name', 
    'Email', 
    'Phone', 
    'Contact Owner'
  ];

  // Prepare data for the PDF (converting the contacts into an array of values)
  const data = currentContacts.map(contact => [
    contact.contactName,
    contact.accountName,
    contact.email,
    contact.phone,
    contact.owner
  ]);

  return (
    <div className="overflow-x-auto p-4 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">CONTACT LIST</h2>
      {error && <div className="text-red-500">{error}</div>}

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border text-left">Contact Name</th>
              <th className="px-4 py-2 border text-left">Account Name</th>
              <th className="px-4 py-2 border text-left">Email</th>
              <th className="px-4 py-2 border text-left">Phone</th>
              <th className="px-4 py-2 border text-left">Contact Owner</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.map((contact) => (
              <tr key={contact._id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 border">{contact.contactName}</td>
                <td className="px-4 py-2 border">{contact.accountName}</td>
                <td className="px-4 py-2 border">{contact.email}</td>
                <td className="px-4 py-2 border">{contact.phone}</td>
                <td className="px-4 py-2 border">{contact.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
        fileName="contacts_report.pdf"
        buttonLabel="Download Contacts Report"
      />
    </div>
  );
};

export default ContactList;

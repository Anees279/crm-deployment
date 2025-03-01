
import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { NavBar } from "../components/nav";
import { FaPhoneAlt } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register chart components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the structure of a single table row
interface TableRow {
  accountName: string;
  phone: string;
  website: string;
  accountOwner: string;
  _id: string; // MongoDB ID for deleting clients
}

// Define the props for the ClientData component
interface ClientDataProps {
  editable: boolean;
}

const ClientData: React.FC<ClientDataProps> = ({ editable }) => {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [newRow, setNewRow] = useState<TableRow>({
    accountName: "",
    phone: "",
    website: "",
    accountOwner: "",
    _id: "",
  });
  
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const rowsPerPage = 10; // Number of rows per page

  // Fetch data from the backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('https://crm-deployment-five.vercel.app/api/clients');
        const sortedData = response.data.sort((a: TableRow, b: TableRow) => new Date(b._id).getTime() - new Date(a._id).getTime()); // Sort by recent
        setTableData(sortedData);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    fetchClients();
  }, []);

  // Handle input changes in the form to add a new row
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRow({ ...newRow, [name]: value });
  };

  // Add a new row to the table
  const addRow = async () => {
    if (newRow.accountName && newRow.phone && newRow.website && newRow.accountOwner) {
      try {
        const response = await axios.post('https://crm-deployment-five.vercel.app/api/clients', newRow);
        setTableData((prevTableData) => [response.data, ...prevTableData]); // Add the new row to the top
        setNewRow({ accountName: "", phone: "", website: "", accountOwner: "", _id: "" });
      } catch (err) {
        console.error('Error adding client:', err);
      }
    }
  };

  // Delete a row from the table by ID
  const deleteRow = async (id: string) => {
    try {
      await axios.delete(`https://crm-deployment-five.vercel.app/api/clients/${id}`);
      setTableData((prevTableData) => prevTableData.filter((row) => row._id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(tableData.length / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Calculate the count of accounts per owner
  const accountOwnerCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    tableData.forEach((row) => {
      counts[row.accountOwner] = (counts[row.accountOwner] || 0) + 1;
    });
    return Object.entries(counts).map(([owner, count]) => ({ owner, count }));
  }, [tableData]);

  // Data for the chart
  const chartData = {
    labels: accountOwnerCounts.map((item) => item.owner),
    datasets: [
      {
        label: "Number of Accounts",
        data: accountOwnerCounts.map((item) => item.count),
        backgroundColor: "#42A5F5",
      },
    ],
  };

  return (
    <>
    {/* <NavBar/> */}
    <div className="w-full p-4 mt-[70px]">
      <h2 className="text-2xl font-bold mb-4">Client Data</h2>

      {/* Display a message if there's no data */}
      {tableData.length === 0 ? (
        <p>No client data available.</p>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border border-gray-300 bg-gray-100">Account Name</th>
                  <th className="px-4 py-2 border border-gray-300 bg-gray-100">Phone</th>
                  <th className="px-4 py-2 border border-gray-300 bg-gray-100">Website</th>
                  <th className="px-4 py-2 border border-gray-300 bg-gray-100">Account Owner</th>
                  {editable && <th className="px-4 py-2 border border-gray-300 bg-gray-100">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="text-center hover:bg-gray-100">
                    <td className="px-4 py-2 border border-gray-300">{row.accountName}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      {row.phone && <FaPhoneAlt className="inline-block text-blue-500 mr-2" />}
                      {row.phone}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">{row.website}</td>
                    <td className="px-4 py-2 border border-gray-300">{row.accountOwner}</td>
                    {editable && (
                      <td className="px-4 py-2 border border-gray-300">
                        <button onClick={() => deleteRow(row._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`mx-1 px-2 py-1 ${currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {number}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Form to add a new client */}
      {editable && (
        <div className="mb-4">
          <h3 className="font-bold">Add New Client</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              name="accountName"
              value={newRow.accountName}
              onChange={handleInputChange}
              placeholder="Account Name"
              className="border px-2 py-1 w-full sm:w-auto"
            />
            <input
              type="text"
              name="phone"
              value={newRow.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="border px-2 py-1 w-full sm:w-auto"
            />
            <input
              type="url"
              name="website"
              value={newRow.website}
              onChange={handleInputChange}
              placeholder="Website"
              className="border px-2 py-1 w-full sm:w-auto"
            />
            <input
              type="text"
              name="accountOwner"
              value={newRow.accountOwner}
              onChange={handleInputChange}
              placeholder="Account Owner"
              className="border px-2 py-1 w-full sm:w-auto"
            />
            <button onClick={addRow} className="bg-blue-500 text-white px-4 py-2 sm:mt-0 mt-2">
              Add Client
            </button>
          </div>
        </div>
      )}

      {/* Chart displaying accounts by owner */}
     {/* Chart displaying accounts by owner */}
     <div className="w-full mt-8 max-w-full overflow-hidden">
       <h3 className="font-bold mb-4">Accounts by Owner</h3>
         <div className="relative h-64 sm:h-96">
           <Bar
            data={chartData}
           options={{
             responsive: true,
             maintainAspectRatio: false,
              scales: {
                 x: {
                  beginAtZero: true,
                },
              },
             }}
          />
        </div>
     </div>
     </div>
    </>

  );
};
export { ClientData };

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
// import { NavBar } from "../components/nav";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface TableRow {
  _id: string;
  title: string;
  from: string;
  to: string;
  relatedTo: string;
  contactName: string;
  host: string;
}

export const Meeting: React.FC = () => {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [newRow, setNewRow] = useState<TableRow>({
    _id: "",
    title: "",
    from: "",
    to: "",
    relatedTo: "",
    contactName: "",
    host: ""
  });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of rows per page

  // Fetch data from the backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/meetings")
      .then((response) => {
        // Sort the data by 'from' date in descending order
        const sortedData = response.data.sort((a: TableRow, b: TableRow) => new Date(b.from).getTime() - new Date(a.from).getTime());
        setTableData(sortedData);
      })
      .catch((error) => {
        console.error("There was an error fetching the data:", error);
      });
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRow({ ...newRow, [name]: value });
  };

  // Add a new row
  const addRow = () => {
    axios.post("http://localhost:5000/api/meetings", newRow)
      .then((response) => {
        setTableData([response.data, ...tableData]); // Add the new row at the top
        setNewRow({
          _id: "",
          title: "",
          from: "",
          to: "",
          relatedTo: "",
          contactName: "",
          host: ""
        });
      })
      .catch((error) => {
        console.error("Error adding row:", error);
      });
  };

  // Delete a row
  const deleteRow = (id: string) => {
    axios.delete(`http://localhost:5000/api/meetings/${id}`)
      .then(() => {
        setTableData(tableData.filter(row => row._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting row:", error);
      });
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = tableData.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  // Chart data (example for meetings by host)
  const barChartData = {
    labels: Array.from(new Set(tableData.map(row => row.host))),
    datasets: [
      {
        label: "Meetings by Host",
        data: Array.from(
          new Set(tableData.map(row => row.host))
        ).map(host => tableData.filter(row => row.host === host).length),
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1
      }
    ]
  };

  // Line chart data (example for meetings over time)
  const lineChartData = {
    labels: tableData.map(row => row.from),
    datasets: [
      {
        label: "Meetings Over Time",
        data: tableData.map((_, index) => index + 1),
        fill: false,
        borderColor: "rgba(153,102,255,1)",
        tension: 0.4
      }
    ]
  };

  return (
    <>
    {/* <NavBar/> */}
    
    <div className="w-full p-4 mt-[70px]">
      <h2 className="text-2xl font-bold mb-4">Meeting Data</h2>

      {/* Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              {["Title", "From", "To", "Related To", "Contact Name", "Host"].map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border border-gray-300 bg-gray-100 cursor-pointer"
                >
                  {header}
                </th>
              ))}
              <th className="px-4 py-2 border border-gray-300 bg-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center hover:bg-gray-100">
                <td className="px-4 py-2 border border-gray-300">{row.title}</td>
                <td className="px-4 py-2 border border-gray-300">{row.from}</td>
                <td className="px-4 py-2 border border-gray-300">{row.to}</td>
                <td className="px-4 py-2 border border-gray-300">{row.relatedTo}</td>
                <td className="px-4 py-2 border border-gray-300">{row.contactName}</td>
                <td className="px-4 py-2 border border-gray-300">{row.host}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    onClick={() => deleteRow(row._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-500 text-white px-4 py-2 rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="bg-gray-500 text-white px-4 py-2 rounded"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Add New Row */}
      <div className="mb-4">
        <h3 className="font-bold">Add New Row</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            name="title"
            value={newRow.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="border px-2 py-1 w-full sm:w-auto"
          />
          <input
            type="date"
            name="from"
            value={newRow.from}
            onChange={handleInputChange}
            className="border px-2 py-1 w-full sm:w-auto"
          />
          <input
            type="date"
            name="to"
            value={newRow.to}
            onChange={handleInputChange}
            className="border px-2 py-1 w-full sm:w-auto"
          />
          <input
            type="text"
            name="relatedTo"
            value={newRow.relatedTo}
            onChange={handleInputChange}
            placeholder="Related To"
            className="border px-2 py-1 w-full sm:w-auto"
          />
          <input
            type="text"
            name="contactName"
            value={newRow.contactName}
            onChange={handleInputChange}
            placeholder="Contact Name"
            className="border px-2 py-1 w-full sm:w-auto"
          />
          <input
            type="text"
            name="host"
            value={newRow.host}
            onChange={handleInputChange}
            placeholder="Host"
            className="border px-2 py-1 w-full sm:w-auto"
          />
          <button onClick={addRow} className="bg-blue-500 text-white px-4 py-2 sm:mt-0 mt-2">
            Add Row
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="w-full">
          <h3 className="text-xl font-bold mb-2">Meetings by Host (Bar Chart)</h3>
          <div className="w-full h-64 sm:h-80">
            <Bar data={barChartData} options={{ responsive: true }} />
          </div>
        </div>
        <div className="w-full">
          <h3 className="text-xl font-bold mb-2">Meetings Over Time (Line Chart)</h3>
          <div className="w-full h-64 sm:h-80">
            <Line data={lineChartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

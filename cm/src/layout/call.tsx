import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { NavBar } from "../components/nav";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { format } from "date-fns"; // Import format from date-fns

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface TableRow {
  subject: string;
  callType: string;
  callStartTime: string;
  callDuration: number;
  relatedTo: string;
  contactName: string;
  callOwner: string;
  _id: string;
}

interface FormattedTableRow extends TableRow {
  formattedCallStartTime: string;
}

export const Call: React.FC = () => {
  const [tableData, setTableData] = useState<FormattedTableRow[]>([]); // Use FormattedTableRow type
  const [newRow, setNewRow] = useState<TableRow>({
    subject: "",
    callType: "",
    callStartTime: "",
    callDuration: 0,
    relatedTo: "",
    contactName: "",
    callOwner: "",
    _id: ""
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  useEffect(() => {
    console.log("Fetching call data...");
    axios
      .get("http://localhost:5000/api/calls")
      .then((response) => {
        console.log("Fetched data successfully", response.data);

        // Sort the data by callStartTime (or any other field that indicates the order)
        const sortedData = response.data.sort((a: TableRow, b: TableRow) => {
          return new Date(b.callStartTime).getTime() - new Date(a.callStartTime).getTime();
        });

        // Format the callStartTime for each call record
        const formattedData: FormattedTableRow[] = sortedData.map((call: TableRow) => ({
          ...call,
          formattedCallStartTime: format(new Date(call.callStartTime), 'EEE MMM dd yyyy HH:mm:ss OOOO (zzzz)'),
        }));

        setTableData(formattedData); // Set the sorted and formatted data
      })
      .catch((error) => {
        console.error("There was an error fetching the calls:", error);
        alert("Error fetching call data");
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRow({ ...newRow, [name]: value });
  };

  const addRow = () => {
    axios
      .post("http://localhost:5000/api/calls", newRow)
      .then((response) => {
        console.log("Added new row successfully", response.data);
        setTableData([response.data, ...tableData]); // Add new row at the start
        setNewRow({
          subject: "",
          callType: "",
          callStartTime: "",
          callDuration: 0,
          relatedTo: "",
          contactName: "",
          callOwner: "",
          _id: ""
        });
      })
      .catch((error) => {
        console.error("There was an error adding the call:", error);
        alert("Error adding call");
      });
  };

  const deleteRow = (id: string) => {
    axios
      .delete(`http://localhost:5000/api/calls/${id}`)
      .then(() => {
        console.log(`Deleted row with id: ${id}`);
        setTableData(tableData.filter((row) => row._id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the call:", error);
        alert("Error deleting call");
      });
  };

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Chart.js data
  const chartData = {
    labels: tableData.map((row) => row.subject),
    datasets: [
      {
        label: "Call Duration",
        data: tableData.map((row) => row.callDuration),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: tableData.map((row) => row.callType),
    datasets: [
      {
        label: "Calls by Type",
        data: tableData.map(() => 1),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {/* <NavBar /> */}
      <div className="p-4 mt-[70px]">
        <h2 className="text-2xl font-bold mb-4">Call Dashboard</h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Subject</th>
                <th className="border px-2 py-1">Call Type</th>
                <th className="border px-2 py-1">Call Start Time</th>
                <th className="border px-2 py-1">Call Duration (mins)</th>
                <th className="border px-2 py-1">Related To</th>
                <th className="border px-2 py-1">Contact Name</th>
                <th className="border px-2 py-1">Call Owner</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">{row.subject}</td>
                  <td className="border px-2 py-1">{row.callType}</td>
                  <td className="border px-2 py-1">{row.formattedCallStartTime}</td>
                  <td className="border px-2 py-1">{row.callDuration}</td>
                  <td className="border px-2 py-1">{row.relatedTo}</td>
                  <td className="border px-2 py-1">{row.contactName}</td>
                  <td className="border px-2 py-1">{row.callOwner}</td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => deleteRow(row._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center space-x-2 mb-4">
          <button
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-500"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-500"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(tableData.length / rowsPerPage)}
          >
            Next
          </button>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={newRow.subject}
              onChange={handleInputChange}
              className="border p-2 w-full sm:w-1/3"
            />
            <input
              type="text"
              name="callType"
              placeholder="Call Type"
              value={newRow.callType}
              onChange={handleInputChange}
              className="border p-2 w-full sm:w-1/3"
            />
            <input
              type="datetime-local"
              name="callStartTime"
              value={newRow.callStartTime}
              onChange={handleInputChange}
              className="border p-2 w-full sm:w-1/3"
            />
            <input
              type="number"
              name="callDuration"
              placeholder="Duration"
              value={newRow.callDuration}
              onChange={handleInputChange}
              className="border p-2 w-full sm:w-1/3"
            />
            <input
              type="text"
              name="relatedTo"
              placeholder="Related To"
              value={newRow.relatedTo}
              onChange={handleInputChange}
              className="border p-2 w-full sm:w-1/3"
            />
            <input
              type="text"
              name="contactName"
              placeholder="Contact Name"
              value={newRow.contactName}
              onChange={handleInputChange}
              className="border p-2 w-full sm:w-1/3"
            />
            <input
              type="text"
              name="callOwner"
              placeholder="Call Owner"
              value={newRow.callOwner}
              onChange={handleInputChange}
              className="border p-2 w-full sm:w-1/3"
            />
            <button
              onClick={addRow}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
            >
              Add Call
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center">
          <div className="w-full h-64 sm:h-72 md:h-80 lg:h-80">
            <Line data={chartData} />
          </div>
          <div className="w-full h-64 sm:h-72 md:h-80 lg:h-80 mt-6">
            <Bar data={barChartData} />
          </div>
        </div>
      </div>
    </>
  );
};

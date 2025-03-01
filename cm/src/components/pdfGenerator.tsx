

// export default PDFGenerator;
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface PDFGeneratorProps {
  columns: string[]; // Array of column headers
  data: any[][]; // Array of row data (each row is an array of cell data)
  fileName?: string; // Optional: name of the PDF file
  buttonLabel?: string; // Optional: label for the download button
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  columns,
  data,
  fileName = "table_data.pdf",
  buttonLabel = "Download PDF",
}) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Use autoTable to generate the table in the PDF
    (doc as any).autoTable({
      head: [columns],
      body: data,
    });

    // Save the generated PDF
    doc.save(fileName);
  };

  return (
    <div className="flex justify-end mt-4">
      <button
        className="px-4 py-2 bg-gray-500 text-black rounded"
        onClick={generatePDF}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default PDFGenerator;

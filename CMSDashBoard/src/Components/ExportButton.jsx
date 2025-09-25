// components/ExportButton.js
import React from "react";

const ExportButton = ({ data, filename, type = "csv" }) => {
  const exportData = () => {
    if (type === "csv") {
      exportToCSV(data, filename);
    } else if (type === "pdf") {
      exportToPDF(data, filename);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvData = [
      headers,
      ...data.map((row) => headers.map((header) => row[header])),
    ];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = (data, filename) => {
    // Simple PDF export simulation
    alert(
      `PDF export for ${filename} would be implemented with a PDF library like jsPDF`
    );
    // In a real implementation, you would use a library like jsPDF
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => exportData("csv")}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
      >
        <i className="fas fa-file-csv mr-2"></i>
        Export CSV
      </button>
      <button
        onClick={() => exportData("pdf")}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
      >
        <i className="fas fa-file-pdf mr-2"></i>
        Export PDF
      </button>
    </div>
  );
};

export default ExportButton;

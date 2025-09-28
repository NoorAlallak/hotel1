const ExportButton = ({ data, filename, type = "csv" }) => {
  const exportData = () => {
    if (type === "csv") {
      exportToCSV(data, filename);
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

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => exportData("csv")}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
      >
        <i className="fas fa-file-csv mr-2"></i>
        Export CSV
      </button>
    </div>
  );
};

export default ExportButton;

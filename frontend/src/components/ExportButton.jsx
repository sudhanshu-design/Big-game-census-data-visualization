import { Download } from 'lucide-react';

export default function ExportButton({ data, filename = "census_report.csv", label = "Export Report" }) {
  const handleExport = () => {
    if (!data) return;

    // Convert data to array if it's a single object
    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0) return;

    // Extract headers
    const headers = Object.keys(dataArray[0]);
    
    // Create CSV rows
    const csvRows = [];
    csvRows.push(headers.join(',')); // Add Header row

    for (const row of dataArray) {
      const values = headers.map(header => {
        const val = row[header];
        // Escape quotes and wrap in quotes if there's a comma
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    // Create Blob and trigger download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm tracking-wide hover:border-[#8B4513] hover:text-[#8B4513] transition-all shadow-sm"
    >
      <Download size={16} />
      {label}
    </button>
  );
}

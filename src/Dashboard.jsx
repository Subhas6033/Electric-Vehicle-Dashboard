import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [evByMake, setEvByMake] = useState([]);
  const [evByYear, setEvByYear] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("/ev_data.csv")
      .then((res) => res.text())
      .then((csv) => {
        console.log("CSV Loaded ✅"); // check if this logs
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log("Parsed Data ✅", results.data); // log parsed data
            setRawData(results.data);
          },
        });
      })
      .catch((err) => console.error("Error loading CSV ❌", err));
  }, []);


  useEffect(() => {
    if (!rawData.length) return;

    const cleaned = rawData.filter((row) => row["Model Year"] && row["Make"]);
    const normalized = cleaned.map((row) => ({
      ...row,
      modelYear: parseInt(row["Model Year"]),
      make: row["Make"].trim(),
      model: row["Model"]?.trim(),
      range: parseInt(row["Electric Range"]) || 0,
    }));

    setProcessedData(normalized);

    const makeCounts = {};
    const yearCounts = {};

    normalized.forEach((row) => {
      makeCounts[row.make] = (makeCounts[row.make] || 0) + 1;
      yearCounts[row.modelYear] = (yearCounts[row.modelYear] || 0) + 1;
    });

    setEvByMake(
      Object.entries(makeCounts)
        .map(([make, count]) => ({ name: make, value: count }))
        .sort((a, b) => b.value - a.value)
    );

    setEvByYear(
      Object.entries(yearCounts)
        .map(([year, count]) => ({ name: year, value: count }))
        .sort((a, b) => a.name - b.name)
    );
  }, [rawData]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTableData = processedData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">EV Dashboard</h1>

      {/* Metric Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold">Total EVs</h2>
          <p className="text-xl font-bold">{processedData.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold">Top Make</h2>
          <p className="text-xl font-bold">
            {evByMake.length ? `${evByMake[0].name} (${evByMake[0].value})` : "Loading..."}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold">Top Model Year</h2>
          <p className="text-xl font-bold">
            {evByYear.length ? `${evByYear[0].name} (${evByYear[0].value})` : "Loading..."}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">EVs by Make</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={evByMake.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">EVs by Model Year</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={evByYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-2">EV Records</h3>
        <div className="overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">#</th>
                <th className="p-2">Make</th>
                <th className="p-2">Model</th>
                <th className="p-2">Year</th>
                <th className="p-2">Range</th>
              </tr>
            </thead>
            <tbody>
              {currentTableData.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{startIndex + index + 1}</td>
                  <td className="p-2">{row.make}</td>
                  <td className="p-2">{row.model}</td>
                  <td className="p-2">{row.modelYear}</td>
                  <td className="p-2">{row.range}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-end items-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  p < Math.ceil(processedData.length / itemsPerPage) ? p + 1 : p
                )
              }
              disabled={currentPage === Math.ceil(processedData.length / itemsPerPage)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
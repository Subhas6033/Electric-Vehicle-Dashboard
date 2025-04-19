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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Data_Table from "./Data_Table";
import CountUp from "react-countup";

const AnimatedNumber = ({ value }) => (
  <CountUp end={value} duration={2} separator="," start={1} /> )

export default function Dashboard() {
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [evByMake, setEvByMake] = useState([]);
  const [evByYear, setEvByYear] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    city: "",
    country: "",
    company: "",
    model: "",
    year: "",
  });
  const [resetToggle, setResetToggle] = useState(false);

  const itemsPerPage = 10;

  const MODERN_COLORS = [
    "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6F91",
    "#845EC2", "#FFC75F", "#F9F871", "#00C9A7", "#0081CF"
  ];

  const uniqueOptions = (key) => {
    const filtered = processedData.filter((d) => {
      return (
        (!search.city || d.city === search.city) &&
        (!search.country || d.county === search.country) &&
        (!search.company || d.make === search.company) &&
        (!search.model || d.model === search.model) &&
        (!search.year || d.modelYear === parseInt(search.year))
      );
    });

    return Array.from(
      new Set(
        filtered.map((d) => {
          if (key === "company") return d.make;
          if (key === "year") return d.modelYear;
          if (key === "country") return d.county;
          if (key === "city") return d.city;
          return d[key];
        }).filter(Boolean)
      )
    ).sort();
  };

  const getModelOptions = () => {
    if (!search.company) return uniqueOptions("model");
    return Array.from(
      new Set(
        processedData
          .filter((d) => d.make === search.company)
          .map((d) => d.model)
      )
    ).sort();
  };

  useEffect(() => {
    fetch("/ev_data.csv")
      .then((res) => res.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setRawData(results.data);
            setLoading(false);
            setProcessedData(results.data);
          },
        });
      })
      .catch((err) => {
        console.error("Error fetching CSV:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!rawData.length) return;

    const cleaned = rawData.filter((row) => row["Model Year"] && row["Make"]);
    const normalized = cleaned.map((row) => ({
      ...row,
      modelYear: parseInt(row["Model Year"]),
      make: row["Make"]?.trim(),
      model: row["Model"]?.trim(),
      range: parseInt(row["Electric Range"]) || 0,
      city: row["City"]?.trim(),
      county: row["County"]?.trim(),
    }));

    setProcessedData(normalized);
  }, [rawData]);

  useEffect(() => {
    const filtered = processedData.filter((row) => {
      return (
        (!search.city || row.city === search.city) &&
        (!search.country || row.county === search.country) &&
        (!search.company || row.make === search.company) &&
        (!search.model || row.model === search.model) &&
        (!search.year || row.modelYear === parseInt(search.year))
      );
    });

    setFilteredData(filtered);

    const makeCounts = {};
    const yearCounts = {};

    filtered.forEach((row) => {
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

    setCurrentPage(1);
  }, [search, processedData]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTableData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleReset = () => {
    setSearch({ city: "", country: "", company: "", model: "", year: "" });
    setResetToggle(!resetToggle);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#ebedee]">
        <div className="relative w-20 h-20">
          <div className="absolute w-full h-full border-[6px] border-t-transparent border-b-transparent border-l-purple-500 border-r-pink-500 rounded-full animate-spin blur-[1px]"></div>

          {/* Centered Bouncing Dot */}
          <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-bounce shadow-md"></div>
        </div>

        <p className="mt-6 text-xl font-semibold text-purple-700 tracking-wide animate-pulse">
          Loading...
        </p>
      </div>
    );
  }


  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 via-green-100 to-green-200 min-h-screen text-green-900">
      <h1 className="text-3xl font-extrabold text-blue-900">EV Dashboard</h1>

      {/* Search Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-green-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-green-600">Search Filters</h2>
          <button
            onClick={handleReset}
            className="btn btn-neutral btn-outline border-1"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {["country", "city", "company", "model", "year"].map((key) => (
            <select
              key={key}
              value={search[key]}
              onChange={(e) => setSearch({
                ...search,
                [key]: e.target.value,
                ...(key === "company" && { model: "" })
              })}
              className="border border-gray-300 bg-white text-gray-700 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-400"
            >
              <option value="">{key.charAt(0).toUpperCase() + key.slice(1)}</option>
              {(key === "model" ? getModelOptions() : uniqueOptions(key)).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Metric Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-green-100">
          <h2 className="text-lg font-semibold text-gray-700">Total EVs</h2>
          <p className="text-2xl font-bold text-green-700">
            <AnimatedNumber value={filteredData.length} />
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-green-100">
          <h2 className="text-lg font-semibold text-gray-700">Top Make</h2>
          <p className="text-2xl font-bold text-green-700">
            {evByMake.length ? `${evByMake[0].name} (${evByMake[0].value})` : "No Data Found..."}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-green-100">
          <h2 className="text-lg font-semibold text-gray-700">Top Model Year</h2>
          <p className="text-2xl font-bold text-green-700">
            {evByYear.length ? `${evByYear[0].name} (${evByYear[0].value})` : "No Data Found..."}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Bar chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2 text-green-700">EVs by Make</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={evByMake.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>


          {/* Graph */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2 text-green-700">EVs by Model Year</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={evByYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4ADE80" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

          {/* Pie chart */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full max-w-full">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-green-700 text-center sm:text-left">
            Top 10 Makes - Pie Chart
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={evByMake.slice(0, 10)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={window.innerWidth < 640 ? 80 : 100}
                label
              >
                {evByMake.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={MODERN_COLORS[index % MODERN_COLORS.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <Data_Table
        currentTableData={currentTableData}
        processedData={filteredData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        startIndex={startIndex}
      />
    </div>
  );
}

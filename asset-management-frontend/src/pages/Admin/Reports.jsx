import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaClipboardList, FaUsers, FaBoxes, FaHourglassHalf } from "react-icons/fa";
import "./Reports.css";
import auditService from "../../services/auditService";
import allocationService from "../../services/allocationService";
import employeeService from "../../services/EmployeeService";
import assetService from "../../services/assetService";

export default function Reports() {
  const [summary, setSummary] = useState({
    assets: 0,
    employees: 0,
    allocations: 0,
    pendingRequests: 0,
  });
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [assets, employees, allocations, audits] = await Promise.all([
        assetService.getAllAssets(),
        employeeService.getAllEmployees(),
        allocationService.getAllAllocations(),
        auditService.getAllAuditRequests(),
      ]);

      setSummary({
        assets: assets.length,
        employees: employees.length,
        allocations: allocations.length,
        pendingRequests: audits.filter((r) => (r.status || "").toUpperCase() === "PENDING").length,
      });

      const statusCounts = [
        { name: "Verified", value: audits.filter((r) => r.status === "VERIFIED").length },
        { name: "Pending", value: audits.filter((r) => r.status === "PENDING").length },
        { name: "Rejected", value: audits.filter((r) => r.status === "REJECTED").length },
      ];

      setStatusData(statusCounts);
    } catch (error) {
      console.error("Failed to load reports", error);
    }
  };

  const COLORS = ["#28a745", "#ffc107", "#dc3545"];

  const summaryCards = [
    { title: "Total Assets", value: summary.assets, icon: <FaBoxes /> },
    { title: "Total Employees", value: summary.employees, icon: <FaUsers /> },
    { title: "Allocations", value: summary.allocations, icon: <FaClipboardList /> },
    { title: "Pending Requests", value: summary.pendingRequests, icon: <FaHourglassHalf /> },
  ];

  return (
    <div className="reports-container container mt-5">
      <h2>Admin Reports & Analytics</h2>

      {/* Summary Cards */}
      <div className="row mb-5">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="col-md-3 mb-3">
            <div className="card summary-card shadow-sm text-center p-3">
              <div className="summary-icon">{card.icon}</div>
              <h5 className="mt-2">{card.title}</h5>
              <h3>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="reports-grid">
        <div className="reports-chart">
          <h3>Audit Requests by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="reports-chart">
          <h3>Audit Requests Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend verticalAlign="bottom" />
              <Bar dataKey="value" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

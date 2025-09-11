import { useEffect, useState } from "react";
import assetService from "../../services/assetService";
import employeeService from "../../services/EmployeeService";
import auditService from "../../services/auditService";
import allocationService from "../../services/allocationService";


export default function DashboardHome() {
  const [stats, setStats] = useState({
    assets: 0,
    employees: 0,
    audits: 0,
    allocations: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [assets, employees, audits, allocations] = await Promise.all([
        assetService.getAllAssets(),
        employeeService.getAllEmployees(),
        auditService.getAllAuditRequests(),
        allocationService.getAllAllocations(),
      ]);

      setStats({
        assets: assets.length,
        employees: employees.length,
        audits: audits.filter((a) => (a.status || "").toUpperCase() === "PENDING").length,
        allocations: allocations.length,
      });
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading dashboard metrics...</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-blue-100 p-6 rounded shadow">
        <h3 className="text-lg font-bold">Total Assets</h3>
        <p className="text-2xl">{stats.assets}</p>
      </div>
      <div className="bg-green-100 p-6 rounded shadow">
        <h3 className="text-lg font-bold">Employees</h3>
        <p className="text-2xl">{stats.employees}</p>
      </div>
      <div className="bg-yellow-100 p-6 rounded shadow">
        <h3 className="text-lg font-bold">Pending Audits</h3>
        <p className="text-2xl">{stats.audits}</p>
      </div>
      <div className="bg-purple-100 p-6 rounded shadow">
        <h3 className="text-lg font-bold">Allocations</h3>
        <p className="text-2xl">{stats.allocations}</p>
      </div>
    </div>
  );
}

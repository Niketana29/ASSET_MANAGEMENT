import { useEffect, useState } from "react";
import AssetService from "../../services/AssetService";
import EmployeeService from "../../services/EmployeeService";
import AuditRequestService from "../../services/AuditRequestService";
import AllocationService from "../../services/AllocationService";
import { apiErrorHandler } from "../../utils/apiErrorHandler";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    assets: 0,
    employees: 0,
    audits: 0,
    allocations: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [assetRes, empRes, auditRes, allocRes] = await Promise.all([
        AssetService.getAllAssets(),
        EmployeeService.getAllEmployees(),
        AuditRequestService.getAllAuditRequests(),
        AllocationService.getAllAllocations(),
      ]);
      setStats({
        assets: assetRes.data.length,
        employees: empRes.data.length,
        audits: auditRes.data.filter((a) => a.status === "PENDING").length,
        allocations: allocRes.data.length,
      });
    } catch (err) {
      apiErrorHandler(err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
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

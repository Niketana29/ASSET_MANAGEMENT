import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AssetService from '../../services/AssetService';
import AssetAllocationService from '../../services/AssetAllocationService';
import ServiceRequestService from '../../services/ServiceRequestService';
import AuditRequestService from '../../services/AuditRequestService';
import EmployeeService from '../../services/EmployeeService';
import { getStatusBadgeClass, formatDate } from '../../utils/constants';

const DashboardHome = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    allocatedAssets: 0,
    totalEmployees: 0,
    pendingRequests: 0,
    completedAllocations: 0,
    pendingServiceRequests: 0,
    completedServiceRequests: 0,
    pendingAudits: 0,
    completedAudits: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [quickStats, setQuickStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [
        assets,
        employees,
        allAllocations,
        serviceRequests,
        auditRequests
      ] = await Promise.all([
        AssetService.getAllAssets(),
        EmployeeService.getAllEmployees(),
        AssetAllocationService.getAllAllocations(),
        ServiceRequestService.getAllServiceRequests(),
        AuditRequestService.getAllAuditRequests()
      ]);

      // Calculate statistics
      const stats = {
        totalAssets: assets.length,
        availableAssets: assets.filter(a => a.status === 'AVAILABLE').length,
        allocatedAssets: assets.filter(a => a.status === 'ALLOCATED').length,
        totalEmployees: employees.length,
        pendingRequests: allAllocations.filter(a => a.status === 'REQUESTED').length,
        completedAllocations: allAllocations.filter(a => a.status === 'APPROVED').length,
        pendingServiceRequests: serviceRequests.filter(r => r.status === 'PENDING').length,
        completedServiceRequests: serviceRequests.filter(r => r.status === 'COMPLETED').length,
        pendingAudits: auditRequests.filter(a => a.status === 'PENDING').length,
        completedAudits: auditRequests.filter(a => a.status === 'VERIFIED').length
      };

      setDashboardStats(stats);

      // Prepare recent activity
      const activities = [
        ...allAllocations.slice(0, 3).map(allocation => ({
          id: allocation.allocationId,
          type: 'allocation',
          title: `Asset Request: ${allocation.assetName}`,
          employee: allocation.employeeName,
          status: allocation.status,
          time: allocation.createdAt,
          isAutoApproved: allocation.isAutoApproved
        })),
        ...serviceRequests.slice(0, 2).map(request => ({
          id: request.requestId,
          type: 'service',
          title: `Service Request: ${request.assetName}`,
          employee: request.employeeName,
          status: request.status,
          time: request.createdAt,
          issueType: request.issueType
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time));

      setRecentActivity(activities);

      // Quick stats for charts
      setQuickStats([
        { label: 'Asset Utilization', value: Math.round((stats.allocatedAssets / stats.totalAssets) * 100) },
        { label: 'Request Approval Rate', value: Math.round((stats.completedAllocations / (stats.completedAllocations + stats.pendingRequests)) * 100) },
        { label: 'Service Completion', value: Math.round((stats.completedServiceRequests / (stats.completedServiceRequests + stats.pendingServiceRequests)) * 100) }
      ]);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your asset management system</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={loadDashboardData}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Assets</p>
              <p className="text-3xl font-bold">{dashboardStats.totalAssets}</p>
            </div>
            <div className="text-3xl opacity-80">📦</div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-100">{dashboardStats.availableAssets} Available</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Allocations</p>
              <p className="text-3xl font-bold">{dashboardStats.completedAllocations}</p>
            </div>
            <div className="text-3xl opacity-80">✅</div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-100">{dashboardStats.pendingRequests} Pending</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Service Requests</p>
              <p className="text-3xl font-bold">{dashboardStats.pendingServiceRequests}</p>
            </div>
            <div className="text-3xl opacity-80">🔧</div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-purple-100">{dashboardStats.completedServiceRequests} Completed</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Pending Audits</p>
              <p className="text-3xl font-bold">{dashboardStats.pendingAudits}</p>
            </div>
            <div className="text-3xl opacity-80">📋</div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-orange-100">{dashboardStats.completedAudits} Completed</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#6366f1"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${stat.value * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{stat.value}%</span>
                </div>
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-3">📋</div>
                <p className="text-gray-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={`${activity.type}-${activity.id}`} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">
                      {activity.type === 'allocation' ? '📦' : '🔧'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        By {activity.employee}
                      </p>
                      {activity.isAutoApproved && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ⚡ Auto-approved
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={getStatusBadgeClass(activity.status)}>
                        {activity.status}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        {formatDate(activity.time, 'MMM DD')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/assets"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
              >
                <div className="text-2xl mb-2">📦</div>
                <div className="font-semibold">Manage Assets</div>
                <div className="text-sm opacity-90">Add, edit, remove</div>
              </Link>

              <Link
                to="/admin/audit-requests"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors"
              >
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold">Review Requests</div>
                <div className="text-sm opacity-90">{dashboardStats.pendingRequests} pending</div>
              </Link>

              <Link
                to="/admin/service-requests"
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors"
              >
                <div className="text-2xl mb-2">🔧</div>
                <div className="font-semibold">Service Requests</div>
                <div className="text-sm opacity-90">{dashboardStats.pendingServiceRequests} pending</div>
              </Link>

              <Link
                to="/admin/reports"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold">Reports</div>
                <div className="text-sm opacity-90">Analytics & insights</div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-2xl">✅</span>
            </div>
            <h3 className="font-semibold text-gray-900">Database</h3>
            <p className="text-green-600 text-sm">Healthy</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold text-gray-900">API</h3>
            <p className="text-green-600 text-sm">Operational</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-2xl">👥</span>
            </div>
            <h3 className="font-semibold text-gray-900">Active Users</h3>
            <p className="text-blue-600 text-sm">{dashboardStats.totalEmployees} Registered</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900">Auto-Approval</h3>
            <p className="text-purple-600 text-sm">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

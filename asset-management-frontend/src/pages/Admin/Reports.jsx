import React, { useState, useEffect } from 'react';
import AssetService from '../../services/AssetService';
import AssetAllocationService from '../../services/AssetAllocationService';
import EmployeeService from '../../services/EmployeeService';
import ServiceRequestService from '../../services/ServiceRequestService';
import { formatDate } from '../../utils/constants';

const Reports = () => {
  const [reportData, setReportData] = useState({
    assets: [],
    allocations: [],
    employees: [],
    serviceRequests: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [assets, allocations, employees, serviceRequests] = await Promise.all([
        AssetService.getAllAssets(),
        AssetAllocationService.getAllAllocations(),
        EmployeeService.getAllEmployees(),
        ServiceRequestService.getAllServiceRequests()
      ]);

      setReportData({
        assets,
        allocations,
        employees,
        serviceRequests
      });
    } catch (err) {
      setError('Failed to load report data');
      console.error('Error loading report data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Analytics calculations
  const getOverviewStats = () => {
    const { assets, allocations, employees, serviceRequests } = reportData;
    
    return {
      totalAssets: assets.length,
      totalEmployees: employees.length,
      totalAllocations: allocations.length,
      totalServiceRequests: serviceRequests.length,
      assetsAllocated: assets.filter(asset => asset.status === 'ALLOCATED').length,
      assetsAvailable: assets.filter(asset => asset.status === 'AVAILABLE').length,
      assetsMaintenance: assets.filter(asset => asset.status === 'MAINTENANCE').length,
      pendingAllocations: allocations.filter(allocation => allocation.status === 'REQUESTED').length,
      approvedAllocations: allocations.filter(allocation => allocation.status === 'APPROVED').length,
      pendingServiceRequests: serviceRequests.filter(req => req.status === 'PENDING').length,
      completedServiceRequests: serviceRequests.filter(req => req.status === 'COMPLETED').length
    };
  };

  const getAssetsByCategory = () => {
    const categoryMap = {};
    reportData.assets.forEach(asset => {
      const category = asset.assetCategory || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([category, count]) => ({ category, count }));
  };

  const getTopEmployeesByAssets = () => {
    const employeeMap = {};
    reportData.allocations.forEach(allocation => {
      if (allocation.status === 'APPROVED') {
        const empName = allocation.employeeName;
        employeeMap[empName] = (employeeMap[empName] || 0) + 1;
      }
    });
    return Object.entries(employeeMap)
      .map(([employee, count]) => ({ employee, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const getRecentAllocations = () => {
    return reportData.allocations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
  };

  const getAssetStatusDistribution = () => {
    const statusMap = {
      AVAILABLE: 0,
      ALLOCATED: 0,
      MAINTENANCE: 0,
      RETIRED: 0
    };
    
    reportData.assets.forEach(asset => {
      statusMap[asset.status] = (statusMap[asset.status] || 0) + 1;
    });
    
    return Object.entries(statusMap).map(([status, count]) => ({ status, count }));
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  const stats = getOverviewStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-2 text-gray-600">Comprehensive insights into asset management and usage</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({...prev, startDate: e.target.value}))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({...prev, endDate: e.target.value}))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={loadAllData}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={() => exportToCSV(reportData.allocations, 'allocations_report')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'assets', 'allocations', 'employees', 'services'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📦</span>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalAssets}</div>
                  <div className="text-sm text-gray-600">Total Assets</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">👥</span>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</div>
                  <div className="text-sm text-gray-600">Employees</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">🔄</span>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalAllocations}</div>
                  <div className="text-sm text-gray-600">Allocations</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-xl">🛠️</span>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalServiceRequests}</div>
                  <div className="text-sm text-gray-600">Service Requests</div>
                </div>
              </div>
            </div>
          </div>

          {/* Asset Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">Asset Status Distribution</h3>
              <div className="space-y-3">
                {getAssetStatusDistribution().map(({ status, count }) => {
                  const percentage = stats.totalAssets ? Math.round((count / stats.totalAssets) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{status}</span>
                        <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            status === 'AVAILABLE' ? 'bg-green-500' :
                            status === 'ALLOCATED' ? 'bg-blue-500' :
                            status === 'MAINTENANCE' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">Assets by Category</h3>
              <div className="space-y-2">
                {getAssetsByCategory().map(({ category, count }) => (
                  <div key={category} className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-700">{category}</span>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Employees & Recent Allocations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">Top Employees by Asset Count</h3>
              <div className="space-y-2">
                {getTopEmployeesByAssets().map(({ employee, count }, index) => (
                  <div key={employee} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                      <span className="text-sm text-gray-700">{employee}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count} assets</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">Recent Allocations</h3>
              <div className="space-y-3">
                {getRecentAllocations().map((allocation) => (
                  <div key={allocation.allocationId} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{allocation.assetName}</div>
                      <div className="text-xs text-gray-500">{allocation.employeeName}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        allocation.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        allocation.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {allocation.status}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(allocation.createdAt, 'MMM DD')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Asset Details Report</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.assets.map((asset) => (
                  <tr key={asset.assetId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{asset.assetName}</div>
                        <div className="text-sm text-gray-500">{asset.assetNo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.assetCategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        asset.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        asset.status === 'ALLOCATED' ? 'bg-blue-100 text-blue-800' :
                        asset.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${asset.assetValue || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(asset.createdAt, 'MMM DD, YYYY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'allocations' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Allocation Report</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.allocations.map((allocation) => (
                  <tr key={allocation.allocationId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{allocation.employeeName}</div>
                        <div className="text-sm text-gray-500">{allocation.employeeEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{allocation.assetName}</div>
                        <div className="text-sm text-gray-500">{allocation.assetNo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        allocation.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        allocation.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {allocation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(allocation.createdAt, 'MMM DD, YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {allocation.approvedAt ? formatDate(allocation.approvedAt, 'MMM DD, YYYY') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Employee Report</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assets Allocated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Requests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.employees.map((employee) => {
                  const allocationsCount = reportData.allocations.filter(
                    a => a.employeeId === employee.employeeId && a.status === 'APPROVED'
                  ).length;
                  const serviceRequestsCount = reportData.serviceRequests.filter(
                    sr => sr.employeeId === employee.employeeId
                  ).length;

                  return (
                    <tr key={employee.employeeId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                          <div className="text-sm text-gray-500">ID: {employee.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{employee.email}</div>
                          <div className="text-sm text-gray-500">{employee.contactNumber || 'No phone'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {allocationsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {serviceRequestsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(employee.createdAt, 'MMM DD, YYYY')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Service Request Report</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.serviceRequests.map((request) => (
                  <tr key={request.requestId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                        <div className="text-sm text-gray-500">{request.employeeEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.assetName}</div>
                        <div className="text-sm text-gray-500">{request.assetNo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.issueType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        request.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(request.createdAt, 'MMM DD, YYYY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
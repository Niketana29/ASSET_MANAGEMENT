import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AssetService from '../../services/AssetService';
import AssetAllocationService from '../../services/AssetAllocationService';
import ServiceRequestService from '../../services/ServiceRequestService';
import AuditRequestService from '../../services/AuditRequestService';
import EmployeeService from '../../services/EmployeeService';
import { getStatusBadgeClass, formatDate } from '../../utils/constants';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAssets: 0,
      totalEmployees: 0,
      pendingAllocations: 0,
      pendingServiceRequests: 0,
      pendingAudits: 0
    },
    recentActivities: [],
    pendingActions: []
  });
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
        pendingAllocations,
        pendingServiceRequests,
        pendingAudits
      ] = await Promise.all([
        AssetService.getAllAssets(),
        EmployeeService.getAllEmployees(),
        AssetAllocationService.getPendingAllocations(),
        ServiceRequestService.getPendingServiceRequests(),
        AuditRequestService.getPendingAuditRequests()
      ]);

      setDashboardData({
        stats: {
          totalAssets: assets.length,
          totalEmployees: employees.length,
          pendingAllocations: pendingAllocations.length,
          pendingServiceRequests: pendingServiceRequests.length,
          pendingAudits: pendingAudits.length
        },
        recentActivities: [
          ...pendingAllocations.slice(0, 3).map(allocation => ({
            id: allocation.allocationId,
            type: 'allocation',
            title: `Asset Request: ${allocation.assetName}`,
            subtitle: `by ${allocation.employeeName}`,
            time: allocation.createdAt,
            status: allocation.status,
            action: 'review'
          })),
          ...pendingServiceRequests.slice(0, 2).map(request => ({
            id: request.requestId,
            type: 'service',
            title: `Service Request: ${request.assetName}`,
            subtitle: `${request.issueType} - ${request.employeeName}`,
            time: request.createdAt,
            status: request.status,
            action: 'review'
          }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)),
        pendingActions: [
          ...pendingAllocations.map(allocation => ({
            id: allocation.allocationId,
            type: 'allocation',
            title: `Approve asset request for ${allocation.assetName}`,
            employee: allocation.employeeName,
            priority: allocation.isAutoApproved ? 'low' : 'medium',
            link: '/admin/audit-requests'
          })),
          ...pendingServiceRequests.map(request => ({
            id: request.requestId,
            type: 'service',
            title: `Review ${request.issueType.toLowerCase()} request`,
            employee: request.employeeName,
            priority: 'high',
            link: '/admin/service-requests'
          }))
        ].slice(0, 5)
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link }) => (
    <Link
      to={link}
      className={`stat-card ${color} group hover:scale-105 transition-all duration-200`}
    >
      <div className="stat-content">
        <div className="stat-header">
          <span className="stat-icon">{icon}</span>
          <span className="stat-value">{value}</span>
        </div>
        <h3 className="stat-title">{title}</h3>
      </div>
      <div className="stat-arrow">→</div>
    </Link>
  );

  const QuickActionCard = ({ title, description, icon, link, color }) => (
    <Link
      to={link}
      className={`quick-action-card ${color} group hover:scale-105 transition-all duration-200`}
    >
      <div className="action-icon">{icon}</div>
      <div className="action-content">
        <h3 className="action-title">{title}</h3>
        <p className="action-description">{description}</p>
      </div>
      <div className="action-arrow">→</div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Welcome back, Administrator! 👋
          </h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your asset management system today.
          </p>
        </div>
        <div className="dashboard-actions">
          <button
            onClick={loadDashboardData}
            className="refresh-button"
            title="Refresh Dashboard"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={loadDashboardData} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Assets"
          value={dashboardData.stats.totalAssets}
          icon="📦"
          color="blue"
          link="/admin/assets"
        />
        <StatCard
          title="Employees"
          value={dashboardData.stats.totalEmployees}
          icon="👥"
          color="green"
          link="/admin/employees"
        />
        <StatCard
          title="Pending Requests"
          value={dashboardData.stats.pendingAllocations}
          icon="⏳"
          color="yellow"
          link="/admin/audit-requests"
        />
        <StatCard
          title="Service Requests"
          value={dashboardData.stats.pendingServiceRequests}
          icon="🔧"
          color="purple"
          link="/admin/service-requests"
        />
      </div>

      <div className="dashboard-grid">
        {/* Recent Activities */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Recent Activities</h2>
            <Link to="/admin/reports" className="card-action">
              View All
            </Link>
          </div>
          <div className="card-content">
            {dashboardData.recentActivities.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <p>No recent activities</p>
              </div>
            ) : (
              <div className="activity-list">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={`${activity.type}-${activity.id}`} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'allocation' ? '📦' : '🔧'}
                    </div>
                    <div className="activity-content">
                      <h4 className="activity-title">{activity.title}</h4>
                      <p className="activity-subtitle">{activity.subtitle}</p>
                      <span className="activity-time">
                        {formatDate(activity.time, 'MMM DD, YYYY HH:mm')}
                      </span>
                    </div>
                    <span className={getStatusBadgeClass(activity.status)}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Pending Actions</h2>
            <span className="pending-count">
              {dashboardData.pendingActions.length}
            </span>
          </div>
          <div className="card-content">
            {dashboardData.pendingActions.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">✅</span>
                <p>All caught up!</p>
              </div>
            ) : (
              <div className="pending-list">
                {dashboardData.pendingActions.map((action) => (
                  <Link
                    key={`${action.type}-${action.id}`}
                    to={action.link}
                    className="pending-item"
                  >
                    <div className="pending-content">
                      <h4 className="pending-title">{action.title}</h4>
                      <p className="pending-subtitle">
                        Employee: {action.employee}
                      </p>
                    </div>
                    <div className="pending-meta">
                      <span className={`priority-badge ${action.priority}`}>
                        {action.priority}
                      </span>
                      <span className="pending-arrow">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <QuickActionCard
            title="Manage Assets"
            description="Add, edit, or remove assets from inventory"
            icon="📦"
            link="/admin/assets"
            color="blue"
          />
          <QuickActionCard
            title="Review Requests"
            description="Approve or reject pending asset requests"
            icon="✅"
            link="/admin/audit-requests"
            color="green"
          />
          <QuickActionCard
            title="Service Requests"
            description="Manage asset maintenance and repairs"
            icon="🔧"
            link="/admin/service-requests"
            color="purple"
          />
          <QuickActionCard
            title="Generate Reports"
            description="Create detailed analytics and reports"
            icon="📊"
            link="/admin/reports"
            color="orange"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
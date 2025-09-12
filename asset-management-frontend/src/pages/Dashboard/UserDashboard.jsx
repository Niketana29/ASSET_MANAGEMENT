import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AssetAllocationService from '../../services/AssetAllocationService';
import ServiceRequestService from '../../services/ServiceRequestService';
import AuditRequestService from '../../services/AuditRequestService';
import { getStatusBadgeClass, formatDate } from '../../utils/constants';

const UserDashboard = () => {
  const { user, getEmployeeId } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAllocations: 0,
      activeAllocations: 0,
      pendingRequests: 0,
      serviceRequests: 0,
      pendingAudits: 0
    },
    recentAllocations: [],
    recentRequests: [],
    pendingAudits: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (getEmployeeId()) {
      loadDashboardData();
    }
  }, [getEmployeeId()]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const employeeId = getEmployeeId();
      if (!employeeId) return;

      const [allocations, serviceRequests, auditRequests] = await Promise.all([
        AssetAllocationService.getMyAllocations(employeeId),
        ServiceRequestService.getMyServiceRequests(employeeId),
        AuditRequestService.getMyAuditRequests(employeeId)
      ]);

      const activeAllocations = allocations.filter(a => a.status === 'APPROVED');
      const pendingRequests = allocations.filter(a => a.status === 'REQUESTED');
      const pendingAudits = auditRequests.filter(a => a.status === 'PENDING');

      setDashboardData({
        stats: {
          totalAllocations: allocations.length,
          activeAllocations: activeAllocations.length,
          pendingRequests: pendingRequests.length,
          serviceRequests: serviceRequests.length,
          pendingAudits: pendingAudits.length
        },
        recentAllocations: allocations.slice(0, 5),
        recentRequests: serviceRequests.slice(0, 3),
        pendingAudits: pendingAudits.slice(0, 3)
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
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="dashboard-subtitle">
            Manage your assets and track your requests from your personal dashboard.
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
          title="My Assets"
          value={dashboardData.stats.activeAllocations}
          icon="📦"
          color="blue"
          link="/my-allocations"
        />
        <StatCard
          title="Pending Requests"
          value={dashboardData.stats.pendingRequests}
          icon="⏳"
          color="yellow"
          link="/my-allocations"
        />
        <StatCard
          title="Service Requests"
          value={dashboardData.stats.serviceRequests}
          icon="🔧"
          color="purple"
          link="/service-request"
        />
        <StatCard
          title="Pending Audits"
          value={dashboardData.stats.pendingAudits}
          icon="📋"
          color="orange"
          link="/request-history"
        />
      </div>

      <div className="dashboard-grid">
        {/* Recent Allocations */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">My Recent Assets</h2>
            <Link to="/my-allocations" className="card-action">
              View All
            </Link>
          </div>
          <div className="card-content">
            {dashboardData.recentAllocations.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📦</span>
                <p>No assets allocated yet</p>
                <Link to="/browse-assets" className="empty-action">
                  Browse Assets
                </Link>
              </div>
            ) : (
              <div className="allocation-list">
                {dashboardData.recentAllocations.map((allocation) => (
                  <div key={allocation.allocationId} className="allocation-item">
                    <div className="allocation-icon">📦</div>
                    <div className="allocation-content">
                      <h4 className="allocation-title">{allocation.assetName}</h4>
                      <p className="allocation-subtitle">
                        {allocation.assetNo} • {allocation.categoryName}
                      </p>
                      <span className="allocation-time">
                        {allocation.allocatedDate
                          ? `Allocated: ${formatDate(allocation.allocatedDate, 'MMM DD, YYYY')}`
                          : `Requested: ${formatDate(allocation.createdAt, 'MMM DD, YYYY')}`
                        }
                      </span>
                    </div>
                    <span className={getStatusBadgeClass(allocation.status)}>
                      {allocation.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Audits */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Pending Audits</h2>
            <span className="pending-count">
              {dashboardData.pendingAudits.length}
            </span>
          </div>
          <div className="card-content">
            {dashboardData.pendingAudits.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">✅</span>
                <p>No pending audits</p>
              </div>
            ) : (
              <div className="audit-list">
                {dashboardData.pendingAudits.map((audit) => (
                  <div key={audit.auditId} className="audit-item">
                    <div className="audit-content">
                      <h4 className="audit-title">
                        Audit: {audit.assetName}
                      </h4>
                      <p className="audit-subtitle">
                        Asset No: {audit.assetNo}
                      </p>
                      <span className="audit-time">
                        Requested: {formatDate(audit.createdAt, 'MMM DD, YYYY')}
                      </span>
                    </div>
                    <Link
                      to={`/audit-verify/${audit.auditId}`}
                      className="audit-action"
                    >
                      Verify
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Requests */}
      {dashboardData.recentRequests.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">Recent Service Requests</h2>
          <div className="service-requests-grid">
            {dashboardData.recentRequests.map((request) => (
              <div key={request.requestId} className="service-request-card">
                <div className="request-header">
                  <span className="request-icon">🔧</span>
                  <span className={getStatusBadgeClass(request.status)}>
                    {request.status}
                  </span>
                </div>
                <div className="request-content">
                  <h3 className="request-title">{request.assetName}</h3>
                  <p className="request-subtitle">
                    {request.issueType} • {request.assetNo}
                  </p>
                  <p className="request-description">
                    {request.description.substring(0, 100)}
                    {request.description.length > 100 ? '...' : ''}
                  </p>
                  <span className="request-time">
                    {formatDate(request.createdAt, 'MMM DD, YYYY')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <QuickActionCard
            title="Browse Assets"
            description="Explore available assets and make requests"
            icon="🔍"
            link="/browse-assets"
            color="blue"
          />
          <QuickActionCard
            title="Request Asset"
            description="Quickly request a new asset for your work"
            icon="➕"
            link="/raise-request"
            color="green"
          />
          <QuickActionCard
            title="Service Request"
            description="Report issues or request maintenance"
            icon="🔧"
            link="/service-request"
            color="purple"
          />
          <QuickActionCard
            title="View History"
            description="Check your request and allocation history"
            icon="📚"
            link="/request-history"
            color="orange"
          />
        </div>
      </div>

      {/* Tips Section */}
      <div className="dashboard-section">
        <div className="tips-card">
          <div className="tips-header">
            <span className="tips-icon">💡</span>
            <h3 className="tips-title">Did you know?</h3>
          </div>
          <div className="tips-content">
            <div className="tip-item">
              <span className="tip-icon">⚡</span>
              <p>Simple items like stationery and basic peripherals are auto-approved instantly!</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">📱</span>
              <p>You can access this dashboard from any device, anywhere.</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🔔</span>
              <p>Keep an eye on your pending audits to maintain compliance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

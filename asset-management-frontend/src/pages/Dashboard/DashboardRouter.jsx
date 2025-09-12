import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const DashboardRouter = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role === ROLES.ADMIN) {
    return <AdminDashboard />;
  } else if (user?.role === ROLES.USER) {
    return <UserDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Invalid User Role
        </h1>
        <p className="text-gray-600">
          Unable to determine your dashboard access level.
        </p>
      </div>
    </div>
  );
};

export default DashboardRouter;

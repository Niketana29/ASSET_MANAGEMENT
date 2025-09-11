import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NotAuthorized = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-orange-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-red-600 mb-4 animate-pulse">
            403
          </div>
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        {isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3 text-left">
                <h3 className="text-sm font-medium text-yellow-800">
                  Current Access Level
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Logged in as: <strong>{user?.username}</strong><br />
                  Role: <strong>{user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Employee'}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
              >
                <span className="mr-2">🏠</span>
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
              >
                <span className="mr-2">🔑</span>
                Login
              </Link>
            )}

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
            >
              <span className="mr-2">⬅️</span>
              Go Back
            </button>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? Contact our support team for assistance.</p>
          <p className="mt-2">
            <a href="mailto:support@company.com" className="text-indigo-600 hover:text-indigo-500">
              support@company.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;

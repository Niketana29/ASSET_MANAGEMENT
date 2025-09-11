import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ServerError = () => {
  const { isAuthenticated } = useAuth();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleReportIssue = () => {
    const subject = encodeURIComponent('Server Error Report');
    const body = encodeURIComponent(`
Hi Support Team,

I encountered a server error while using the Asset Management System.

Details:
- URL: ${window.location.href}
- Time: ${new Date().toLocaleString()}
- Browser: ${navigator.userAgent}

Please investigate this issue.

Thank you!
    `);

    window.open(`mailto:support@company.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-600 mb-4 animate-pulse">
            500
          </div>
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Server Error
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Something went wrong on our servers. We're working to fix the issue. Please try again later.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-red-400 text-xl">🚨</span>
            </div>
            <div className="ml-3 text-left">
              <h3 className="text-sm font-medium text-red-800">
                What happened?
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Our servers encountered an unexpected error while processing your request.
                This issue has been automatically logged and our technical team has been notified.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isRetrying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Retrying...
                </>
              ) : (
                <>
                  <span className="mr-2">🔄</span>
                  Try Again
                </>
              )}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
              >
                <span className="mr-2">🏠</span>
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
              >
                <span className="mr-2">🏠</span>
                Go Home
              </Link>
            )}
          </div>

          <button
            onClick={handleReportIssue}
            className="text-sm text-indigo-600 hover:text-indigo-500 underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
          >
            Report this issue
          </button>
        </div>

        <div className="mt-12 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              What can you do in the meantime?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Wait a few minutes and try again</li>
              <li>• Check if the issue persists in a different browser</li>
              <li>• Clear your browser cache and cookies</li>
              <li>• Contact our support team if the problem continues</li>
            </ul>
          </div>

          <div className="text-sm text-gray-500">
            <p>Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            <p className="mt-1">Time: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerError;

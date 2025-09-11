import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: '📦',
      title: 'Smart Asset Tracking',
      description: 'Track all your company assets in real-time with our intelligent system.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '⚡',
      title: 'Auto-Approval System',
      description: 'Simple assets get approved instantly, complex ones require admin approval.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '🔧',
      title: 'Service Management',
      description: 'Manage maintenance requests and track asset service history.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '📊',
      title: 'Analytics & Reports',
      description: 'Get insights into asset utilization and generate detailed reports.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Asset Management System?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for modern enterprises, our platform combines powerful features with intuitive design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get started with asset management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Register & Login</h3>
              <p className="text-gray-600">
                Create your account and get access to the platform. Employees can register directly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Assets</h3>
              <p className="text-gray-600">
                Browse available assets and make requests. Simple items get auto-approved!
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track & Manage</h3>
              <p className="text-gray-600">
                Monitor your allocated assets, request services, and track everything in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-Approval Feature Highlight */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6">⚡</div>
            <h2 className="text-4xl font-bold mb-4">
              Smart Auto-Approval System
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Our intelligent system automatically approves simple assets like stationery and peripherals,
              while routing complex requests like laptops and equipment to administrators for approval.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="text-lg font-semibold mb-2">Auto-Approved Items</h3>
                <ul className="text-sm opacity-90 space-y-1">
                  <li>• Stationery & Office Supplies</li>
                  <li>• Mouse & Keyboards</li>
                  <li>• Basic Peripherals</li>
                  <li>• Small Printers</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <div className="text-3xl mb-3">👤</div>
                <h3 className="text-lg font-semibold mb-2">Admin Approval Required</h3>
                <ul className="text-sm opacity-90 space-y-1">
                  <li>• Laptops & Computers</li>
                  <li>• Conference Equipment</li>
                  <li>• Office Furniture</li>
                  <li>• High-Value Assets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Asset Management?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of companies already using our platform to streamline their asset management process.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
            >
              Start Free Trial
            </button>
            <button
              onClick={handleLogin}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200 transform hover:scale-105"
            >
              Login Now
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-semibold mb-1">Secure & Reliable</h4>
              <p className="text-sm text-gray-400">Enterprise-grade security</p>
            </div>
            <div>
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold mb-1">Fast Setup</h4>
              <p className="text-sm text-gray-400">Get started in minutes</p>
            </div>
            <div>
              <div className="text-2xl mb-2">💬</div>
              <h4 className="font-semibold mb-1">24/7 Support</h4>
              <p className="text-sm text-gray-400">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AM</span>
                </div>
                <span className="text-xl font-bold">Asset Management</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 max-w-md">
                Empowering organizations with intelligent asset management solutions.
                Streamline your processes and boost productivity.
              </p>
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} Hexaware Technologies Limited. All rights reserved.
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
                <li><a href="/register" className="hover:text-white transition-colors">Register</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>support@company.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Help Center</li>
                <li>Status Page</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
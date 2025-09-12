import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: '📦',
      title: 'Smart Asset Tracking',
      description: 'Track all your company assets in real-time with our intelligent system.',
    },
    {
      icon: '⚡',
      title: 'Auto-Approval System',
      description: 'Simple assets get approved instantly, complex ones require admin approval.',
    },
    {
      icon: '🔧',
      title: 'Service Management',
      description: 'Manage maintenance requests and track asset service history.',
    },
    {
      icon: '📊',
      title: 'Analytics & Reports',
      description: 'Get insights into asset utilization and generate detailed reports.',
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
    <div className="container-fluid p-0">

      {/* Hero Section */}
      <section className="bg-primary text-white text-center d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="display-4 fw-bold mb-3">
          Asset Management Simplified
        </h1>
        <p className="lead mb-4">
          Track, manage, and optimize your company assets effortlessly.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <button className="btn btn-light btn-lg" onClick={handleGetStarted}>
            Start Free Trial
          </button>
          <button className="btn btn-outline-light btn-lg" onClick={handleLogin}>
            Login Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Why Choose Our Asset Management System?</h2>
          <p className="mb-5 text-muted">
            Built for modern enterprises, our platform combines powerful features with intuitive design.
          </p>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {features.map((feature, index) => (
              <div key={index} className="col">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body text-center">
                    <div className="display-4 mb-3">{feature.icon}</div>
                    <h5 className="card-title fw-semibold">{feature.title}</h5>
                    <p className="card-text text-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">How It Works</h2>
          <p className="mb-5 text-muted">Simple steps to get started with asset management</p>

          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card h-100 border-0 text-center">
                <div className="card-body">
                  <div className="bg-info rounded-circle w-16 h-16 d-flex align-items-center justify-content-center mx-auto mb-3 fs-2">
                    1️⃣
                  </div>
                  <h5 className="card-title fw-semibold">Register & Login</h5>
                  <p className="card-text text-muted">
                    Create your account and get access to the platform. Employees can register directly.
                  </p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card h-100 border-0 text-center">
                <div className="card-body">
                  <div className="bg-success rounded-circle w-16 h-16 d-flex align-items-center justify-content-center mx-auto mb-3 fs-2">
                    2️⃣
                  </div>
                  <h5 className="card-title fw-semibold">Request Assets</h5>
                  <p className="card-text text-muted">
                    Browse available assets and make requests. Simple items get auto-approved!
                  </p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card h-100 border-0 text-center">
                <div className="card-body">
                  <div className="bg-primary rounded-circle w-16 h-16 d-flex align-items-center justify-content-center mx-auto mb-3 fs-2">
                    3️⃣
                  </div>
                  <h5 className="card-title fw-semibold">Track & Manage</h5>
                  <p className="card-text text-muted">
                    Monitor your allocated assets, request services, and track everything in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-Approval Highlight */}
      <section className="py-5 text-white" style={{ background: 'linear-gradient(90deg, #4facfe, #00f2fe)' }}>
        <div className="container text-center">
          <div className="mb-4 fs-1">⚡</div>
          <h2 className="fw-bold mb-3">Smart Auto-Approval System</h2>
          <p className="mb-5">
            Our intelligent system automatically approves simple assets like stationery and peripherals,
            while routing complex requests to administrators for approval.
          </p>

          <div className="row row-cols-1 row-cols-md-2 g-4">
            <div className="col">
              <div className="card bg-white bg-opacity-10 border-0 rounded-3 p-4 text-start">
                <div className="fs-3 mb-2">✅</div>
                <h5 className="fw-semibold mb-2">Auto-Approved Items</h5>
                <ul className="small mb-0">
                  <li>Stationery & Office Supplies</li>
                  <li>Mouse & Keyboards</li>
                  <li>Basic Peripherals</li>
                  <li>Small Printers</li>
                </ul>
              </div>
            </div>
            <div className="col">
              <div className="card bg-white bg-opacity-10 border-0 rounded-3 p-4 text-start">
                <div className="fs-3 mb-2">👤</div>
                <h5 className="fw-semibold mb-2">Admin Approval Required</h5>
                <ul className="small mb-0">
                  <li>Laptops & Computers</li>
                  <li>Conference Equipment</li>
                  <li>Office Furniture</li>
                  <li>High-Value Assets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container">
          <h2 className="fw-bold mb-3">Ready to Transform Your Asset Management?</h2>
          <p className="mb-4 text-muted">
            Join hundreds of companies already using our platform to streamline their asset management process.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            <button className="btn btn-light btn-lg" onClick={handleGetStarted}>Start Free Trial</button>
            <button className="btn btn-outline-light btn-lg" onClick={handleLogin}>Login Now</button>
          </div>

          <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div>🔒</div>
              <h6 className="fw-semibold">Secure & Reliable</h6>
              <p className="small text-muted">Enterprise-grade security</p>
            </div>
            <div className="col">
              <div>⚡</div>
              <h6 className="fw-semibold">Fast Setup</h6>
              <p className="small text-muted">Get started in minutes</p>
            </div>
            <div className="col">
              <div>💬</div>
              <h6 className="fw-semibold">24/7 Support</h6>
              <p className="small text-muted">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-5">
        <div className="container">
          <div className="row row-cols-1 row-cols-md-4 g-4">
            <div className="col-md-2">
              <h5 className="fw-bold">Asset Management</h5>
              <p className="small text-muted">Empowering organizations with intelligent asset management solutions.</p>
              <p className="small text-muted mb-0">© {new Date().getFullYear()} Hexaware Technologies</p>
            </div>
            <div className="col">
              <h6 className="fw-semibold">Quick Links</h6>
              <ul className="list-unstyled small">
                <li><a href="/login" className="text-white text-decoration-none">Login</a></li>
                <li><a href="/register" className="text-white text-decoration-none">Register</a></li>
                <li><a href="#" className="text-white text-decoration-none">Documentation</a></li>
                <li><a href="#" className="text-white text-decoration-none">Support</a></li>
              </ul>
            </div>
            <div className="col">
              <h6 className="fw-semibold">Contact</h6>
              <ul className="list-unstyled small">
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

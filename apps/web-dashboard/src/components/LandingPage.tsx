import React from 'react';
import { Tractor, ArrowRight, Shield, Globe, Users, TrendingUp, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="logo-icon">H</div>
          <span>HarvestLink</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <button className="btn-secondary" onClick={onGetStarted}>Sign In</button>
          <button className="btn-primary" onClick={onGetStarted}>Sign Up Free</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="badge">
            <TrendingUp size={16} />
            <span>Reducing Food Waste by 40%</span>
          </div>
          <h1>Connecting <span>Fresh Harvests</span> to Global Markets</h1>
          <p>
            The world's first AI-driven marketplace that predicts spoilage and matches 
            farmers with buyers in real-time. Join 50,000+ farmers growing better.
          </p>
          <div className="hero-actions">
            <button className="btn-primary btn-lg" onClick={onGetStarted}>
              Get Started Now <ArrowRight size={20} />
            </button>
            <button className="btn-outline btn-lg">Watch Demo</button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">GH₵ 2.4M</span>
              <span className="stat-label">Farmer Revenue</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">120K+</span>
              <span className="stat-label">Tons Saved</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=1000" 
            alt="Sustainable Farming" 
            className="hero-img-main"
          />
          <div className="floating-card risk-card">
            <div className="risk-header">
              <Shield size={18} color="#22c55e" />
              <span>Spoilage Protection</span>
            </div>
            <div className="risk-progress">
              <div className="progress-bar" style={{ width: '85%' }}></div>
            </div>
            <span className="risk-status">Low Risk</span>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>Why HarvestLink?</h2>
          <p>Cutting-edge technology built for the modern agricultural ecosystem.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#f0fdf4' }}>
              <Tractor color="#22c55e" />
            </div>
            <h3>Smart Logging</h3>
            <p>Log harvests with GPS and sensor data to predict shelf-life with 95% accuracy.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#eff6ff' }}>
              <Globe color="#3b82f6" />
            </div>
            <h3>Market Matching</h3>
            <p>Our algorithm matches your harvest with buyers even before it's picked.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#fff7ed' }}>
              <Users color="#f59e0b" />
            </div>
            <h3>Direct Trade</h3>
            <p>Cut out the middleman and get fair prices directly from large scale buyers.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo-icon">H</div>
            <span>HarvestLink</span>
          </div>
          <p>© 2024 HarvestLink. All rights reserved.</p>
          <div className="social-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

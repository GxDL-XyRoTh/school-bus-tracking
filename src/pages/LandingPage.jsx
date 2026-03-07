import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, MapPin, Shield, Bell, Smartphone, Clock, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="navbar">
                <div className="container flex-between">
                    <div className="flex-center gap-2 logo-container">
                        <div className="logo-icon">
                            <Bus size={24} />
                        </div>
                        <span className="logo-text">School Bus Tracker</span>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn-primary"
                    >
                        Login <ArrowRight size={18} />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-grid">
                        <div className="hero-content">
                            <div className="badge-pulse">
                                <span className="pulse-dot"></span>
                                Live GPS Tracking System
                            </div>
                            <h1 className="hero-title">
                                Safe Journey for <br />
                                <span className="text-primary">Every Student</span>
                            </h1>
                            <p className="hero-description">
                                Real-time school bus tracking for parents, drivers, and schools.
                                Ensure your child's safety with live updates, instant alerts, and seamless communication.
                            </p>
                            <div className="hero-buttons">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="btn btn-primary btn-lg"
                                >
                                    Get Started
                                </button>
                                <button className="btn btn-outline btn-lg">
                                    Learn More
                                </button>
                            </div>
                            <div className="hero-features">
                                <div className="feature-item">
                                    <Shield size={20} />
                                    <span>Secure Platform</span>
                                </div>
                                <div className="feature-item">
                                    <Clock size={20} />
                                    <span>Real-time Updates</span>
                                </div>
                            </div>
                        </div>

                        <div className="hero-visual">
                            <div className="visual-blobs">
                                <div className="blob blob-1"></div>
                                <div className="blob blob-2"></div>
                            </div>

                            <div className="visual-grid">
                                <div className="col-left">
                                    <div className="visual-card">
                                        <div className="icon-box bg-blue">
                                            <MapPin size={24} />
                                        </div>
                                        <h3>Live Tracking</h3>
                                        <p>Monitor bus location in real-time on an interactive map.</p>
                                    </div>
                                    <div className="visual-card">
                                        <div className="icon-box bg-amber">
                                            <Bell size={24} />
                                        </div>
                                        <h3>Instant Alerts</h3>
                                        <p>Get notified when the bus is near or reaches the school.</p>
                                    </div>
                                </div>
                                <div className="col-right">
                                    <div className="visual-card">
                                        <div className="icon-box bg-green">
                                            <Smartphone size={24} />
                                        </div>
                                        <h3>Mobile App</h3>
                                        <p>Easy-to-use interface for parents and drivers on the go.</p>
                                    </div>
                                    <div className="visual-card">
                                        <div className="icon-box bg-indigo">
                                            <Shield size={24} />
                                        </div>
                                        <h3>Safety First</h3>
                                        <p>Verified drivers and secure attendance monitoring.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Everything you need to stay connected</h2>
                        <p>Complete solution for schools, parents and drivers to ensure student transportation safety.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="icon-box large bg-primary-light">
                                <MapPin size={32} />
                            </div>
                            <h3>For Parents</h3>
                            <ul>
                                <li><ArrowRight size={16} className="text-primary" /> Live Bus Tracking</li>
                                <li><ArrowRight size={16} className="text-primary" /> Arrival Notifications</li>
                                <li><ArrowRight size={16} className="text-primary" /> Attendance History</li>
                            </ul>
                        </div>

                        <div className="feature-card">
                            <div className="icon-box large bg-secondary-light">
                                <Bus size={32} />
                            </div>
                            <h3>For Drivers</h3>
                            <ul>
                                <li><ArrowRight size={16} className="text-secondary" /> Optimized Routes</li>
                                <li><ArrowRight size={16} className="text-secondary" /> Student Roster</li>
                                <li><ArrowRight size={16} className="text-secondary" /> Emergency Alerts</li>
                            </ul>
                        </div>

                        <div className="feature-card">
                            <div className="icon-box large bg-green-light">
                                <Shield size={32} />
                            </div>
                            <h3>For Schools</h3>
                            <ul>
                                <li><ArrowRight size={16} className="text-green" /> Fleet Management</li>
                                <li><ArrowRight size={16} className="text-green" /> Performance Reports</li>
                                <li><ArrowRight size={16} className="text-green" /> Complaint System</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container flex-between">
                    <div className="footer-brand">
                        <Bus size={24} />
                        <span>School Bus Tracker</span>
                    </div>
                    <p className="copyright">© 2026 School Bus Tracker. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

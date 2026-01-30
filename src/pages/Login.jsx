import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Bus, ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [activeRole, setActiveRole] = useState('parent');
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const roles = [
        { id: 'parent', label: 'Parent', icon: User, colorClass: 'color-indigo', bgClass: 'bg-indigo' },
        { id: 'driver', label: 'Driver', icon: Bus, colorClass: 'color-amber', bgClass: 'bg-amber' },
        { id: 'admin', label: 'Admin', icon: ShieldCheck, colorClass: 'color-emerald', bgClass: 'bg-emerald' }
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            login(activeRole);
            navigate(`/${activeRole}`);
            setIsLoading(false);
        }, 800);
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const activeRoleData = roles.find(r => r.id === activeRole);

    return (
        <div className="login-page">
            <div className="back-link">
                <button
                    onClick={() => navigate('/')}
                    className="btn-ghost flex-center gap-2"
                >
                    <ArrowLeft size={20} /> Back to Home
                </button>
            </div>

            <div className="login-card">

                {/* Left Side - Hero / Info */}
                <div className={`login-left ${activeRoleData.bgClass}`}>
                    <div className="login-info">
                        <div className={`role-icon-large ${activeRoleData.colorClass}`}>
                            <activeRoleData.icon size={28} />
                        </div>
                        <h2 className={`role-title ${activeRoleData.colorClass}`}>
                            {activeRoleData.label} Login
                        </h2>
                        <p className="role-description">
                            {activeRole === 'parent' && "Stay connected with your child's journey. Track the bus in real-time and receive safety alerts."}
                            {activeRole === 'driver' && "Manage your routes efficiently. Update live location and communicate with the school seamlessly."}
                            {activeRole === 'admin' && "Oversee the entire fleet operation. Manage users, buses, and ensure smooth transportation services."}
                        </p>
                    </div>
                    <div className="login-footer">
                        © 2026 School Bus Tracker
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="login-right">
                    <div className="login-header">
                        <h1>Welcome Back</h1>
                        <p>Please select your role and sign in</p>
                    </div>

                    {/* Role Selector */}
                    <div className="role-selector">
                        {roles.map((role) => (
                            <label key={role.id} className={`role-option ${activeRole === role.id ? 'active' : ''} ${role.colorClass}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    className="sr-only"
                                    checked={activeRole === role.id}
                                    onChange={() => setActiveRole(role.id)}
                                />
                                <role.icon size={24} />
                                <span>{role.label}</span>
                            </label>
                        ))}
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="forgot-password">
                                <a href="#">Forgot password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary btn-block"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="demo-notice">
                        <p>
                            <strong>Demo Credentials:</strong> Just click Sign In.
                            <br />No actual validation is implemented yet.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

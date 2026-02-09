import { useAuth } from '../context/AuthContext';
import { useBus } from '../context/BusContext';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import Card from '../components/Card';
import Button from '../components/Button';
import { Bell, CreditCard, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function ParentDashboard() {
    const { user } = useAuth();
    const { currentLocation, busStatus, alerts } = useBus();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tracking'); // tracking, payments, complaints

    // Helper for Status Color
    const getStatusColor = (status) => {
        if (status === 'Moving') return 'text-success';
        if (status === 'Stopped') return 'text-warning';
        if (status === 'SOS') return 'text-danger';
        return 'text-primary';
    };

    return (
        <div className="flex-col gap-6">
            <div className="page-header">
                <h2 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}</h2>
                <div className="btn-group w-full-mobile">
                    <Button variant={activeTab === 'tracking' ? 'primary' : 'ghost'} className="btn-sm" onClick={() => setActiveTab('tracking')}>Tracking</Button>
                    <Button variant={activeTab === 'payments' ? 'primary' : 'ghost'} className="btn-sm" onClick={() => setActiveTab('payments')}>Payments</Button>
                    <Button variant={activeTab === 'complaints' ? 'primary' : 'ghost'} className="btn-sm" onClick={() => setActiveTab('complaints')}>Complaints</Button>
                </div>
            </div>

            {activeTab === 'tracking' && (
                <div className="dashboard-grid">
                    <div className="flex-col gap-4">
                        {/* Map Section */}
                        <Card className="p-0 overflow-hidden relative map-card-container">
                            <Map position={currentLocation} />
                            <div className="map-overlay">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bus Status</div>
                                <div className={`text-lg font-bold ${getStatusColor(busStatus)}`}>{busStatus}</div>
                            </div>
                        </Card>
                    </div>

                    <div className="flex-col gap-4">
                        {/* Student Info */}
                        <Card>
                            <h3 className="font-bold mb-3 text-primary text-lg">Student Details</h3>
                            <div className="flex-col gap-3">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-slate-500 text-sm">Child Name</span>
                                    <span className="font-semibold text-slate-800">{user?.childName}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-slate-500 text-sm">Bus Number</span>
                                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{user?.busNumber}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm">Route</span>
                                    <span className="font-semibold text-slate-800">Route 4A (Morning)</span>
                                </div>
                            </div>
                        </Card>

                        {/* Alerts Feed */}
                        <Card className="flex-1 min-h-[300px]">
                            <div className="flex justify-between items-center mb-4 border-b pb-3">
                                <h3 className="font-bold flex items-center gap-2 text-lg">
                                    <Bell size={20} className="text-slate-400" /> Recent Alerts
                                </h3>
                            </div>
                            <div className="flex-col gap-3 overflow-y-auto max-h-[400px]">
                                {alerts.map(alert => (
                                    <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${alert.type === 'danger' ? 'border-red-500 bg-red-50' : alert.type === 'warning' ? 'border-amber-500 bg-amber-50' : 'border-blue-500 bg-blue-50'}`}>
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="text-sm font-medium text-slate-800 leading-snug">{alert.message}</span>
                                            <span className="text-xs text-slate-400 whitespace-nowrap">{alert.time}</span>
                                        </div>
                                    </div>
                                ))}
                                {alerts.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No recent alerts</p>}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
                <div className="responsive-container">
                    <Card>
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-xl border-b pb-4"><CreditCard className="text-primary" /> Fee Payment</h3>

                        <div className="p-6 bg-indigo-50 rounded-xl mb-6 responsive-row border border-indigo-100">
                            <div className="text-center-mobile">
                                <p className="font-bold text-primary text-lg">Monthly Transport Fee</p>
                                <p className="text-sm text-slate-600">Due: Jan 31, 2026</p>
                            </div>
                            <div className="text-center-mobile text-right-sm">
                                <p className="font-bold text-2xl mb-2 text-slate-800">$50.00</p>
                                <Button variant="primary" className="btn-sm btn-mobile-full" onClick={() => navigate('/payment')}>Pay Now</Button>
                            </div>
                        </div>

                        <h4 className="font-bold mb-4 mt-8 text-slate-600">Payment History</h4>
                        <div className="rounded-xl border overflow-hidden">
                            <div className="flex justify-between items-center p-4 bg-slate-50 border-b">
                                <span className="text-sm font-medium text-slate-700">Dec 2025</span>
                                <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">Paid</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white border-b">
                                <span className="text-sm font-medium text-slate-700">Nov 2025</span>
                                <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">Paid</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50">
                                <span className="text-sm font-medium text-slate-700">Oct 2025</span>
                                <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">Paid</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}


            {activeTab === 'complaints' && (
                <div className="responsive-container">
                    <Card>
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-xl border-b pb-4"><MessageSquare className="text-primary" /> Submit Complaint</h3>
                        <div className="complaint-form">
                            <div className="form-group">
                                <label className="text-sm font-medium text-slate-700">Category</label>
                                <div className="select-wrapper">
                                    <select>
                                        <option>Bus Delay</option>
                                        <option>Driver Behavior</option>
                                        <option>Vehicle Condition</option>
                                        <option>Other</option>
                                    </select>
                                    <span className="select-arrow">▼</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y min-h-[120px]"
                                    placeholder="Describe your issue..."
                                ></textarea>
                            </div>
                            <Button variant="primary" className="w-full py-3">Submit Complaint</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

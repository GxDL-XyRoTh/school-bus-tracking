import { useAuth } from '../context/AuthContext';
import { useBus } from '../context/BusContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Map from '../components/Map';
import { Users, Bus, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { COMPLAINTS } from '../data/mockData';

export default function AdminDashboard() {
    const { user } = useAuth();
    const { currentLocation, busStatus } = useBus();

    // Stats
    const stats = [
        { title: 'Total Buses', value: '12', icon: Bus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { title: 'Active Now', value: busStatus === 'Moving' ? '1' : '0', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Students', value: '450', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Alerts', value: busStatus === 'SOS' ? '1' : '0', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <div className="flex-col gap-8">
            <div className="page-header">
                <h2 className="text-2xl font-bold text-slate-800">School Admin Dashboard</h2>
                <Button variant="outline" className="flex items-center gap-2">
                    <Download size={18} /> Download Reports
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <Card key={i} className="stat-card flex items-center gap-4 p-4">
                        <div className={`p-4 rounded-full flex items-center justify-center shrink-0 ${stat.bg}`}>
                            <stat.icon size={24} className={stat.color} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Live Fleet Map */}
                <div className="flex-col gap-6">
                    <Card className="p-0 overflow-hidden flex-col map-card-container">
                        <div className="p-4 border-b flex-between bg-slate-50">
                            <h3 className="font-bold flex items-center gap-2 text-slate-700"><Bus size={18} /> Live Fleet Tracking</h3>
                            <span className="text-xs font-bold text-emerald-600 px-2 py-1 bg-white rounded border border-emerald-200 shadow-sm animate-pulse">Live Updates</span>
                        </div>
                        <div className="flex-1 relative z-0">
                            <Map position={currentLocation} />
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold mb-4 text-lg border-b pb-2">Recent Complaints</h3>
                        <div className="flex-col gap-3">
                            {COMPLAINTS.map(c => (
                                <div key={c.id} className="flex justify-between items-start p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div>
                                        <p className="font-bold text-sm text-slate-800 mb-1">{c.subject}</p>
                                        <p className="text-xs text-slate-500">From: {c.parent} • {c.date}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {c.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Lists */}
                <div className="flex-col gap-6">
                    <Card>
                        <h3 className="font-bold mb-4 text-lg border-b pb-2">Bus Status</h3>
                        <div className="flex-col gap-3">
                            {/* Demo Bus */}
                            <div className="flex justify-between items-center p-3 border border-indigo-100 rounded-lg bg-indigo-50/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${busStatus === 'Moving' ? 'bg-green-500' : busStatus === 'SOS' ? 'bg-red-500' : 'bg-amber-500'} animate-pulse`}></div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">Bus MH-02-1234</p>
                                        <p className="text-xs text-slate-500">Route 4A • John Doe</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold ${busStatus === 'Moving' ? 'text-green-600' : 'text-amber-600'}`}>{busStatus}</span>
                            </div>
                            {/* Mock Buses */}
                            <div className="flex justify-between items-center p-3 border border-slate-100 rounded-lg opacity-60 grayscale">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">Bus MH-04-5678</p>
                                        <p className="text-xs text-slate-500">Route 2B • Suspended</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-500">Offline</span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold mb-4 text-lg border-b pb-2">Quick Actions</h3>
                        <div className="flex-col gap-2">
                            <Button variant="ghost" className="justify-start text-sm w-full hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg p-3 text-slate-600">Manage Routes</Button>
                            <Button variant="ghost" className="justify-start text-sm w-full hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg p-3 text-slate-600">Manage Drivers</Button>
                            <Button variant="ghost" className="justify-start text-sm w-full hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg p-3 text-slate-600">View Payments</Button>
                            <Button variant="ghost" className="justify-start text-sm w-full hover:bg-red-50 text-red-600 border border-transparent hover:border-red-100 rounded-lg p-3">System Settings</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import { useAuth } from '../context/AuthContext';
import { useBus } from '../context/BusContext';
import Button from '../components/Button';
import { Play, Pause, AlertTriangle } from 'lucide-react';

export default function DriverDashboard() {
    const { user } = useAuth();
    const { isSharing, startTrip, stopTrip, toogleSOS, busStatus } = useBus();

    return (
        <div className="responsive-container flex flex-col items-center gap-8 py-4">
            <div className="text-center w-full">
                <h2 className="text-2xl font-bold mb-2 text-slate-800">Driver Console</h2>
                <p className="text-slate-600 mb-4">Bus: <strong className="text-slate-800">{user?.busNumber}</strong></p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
                    <span className="text-slate-500 font-medium text-sm">Status:</span>
                    <span className={`font-bold ${busStatus === 'Moving' ? 'text-success' : busStatus === 'SOS' ? 'text-danger' : 'text-warning'}`}>
                        {busStatus}
                    </span>
                </div>
            </div>

            <div className="w-full flex justify-center py-4">
                {/* Big Toggle Button */}
                {!isSharing ? (
                    <button
                        onClick={startTrip}
                        className="trip-btn trip-btn-start"
                        aria-label="Start Trip"
                    >
                        <Play size={48} className="text-white ml-2" />
                        <span className="text-white text-xl font-bold mt-2">START TRIP</span>
                    </button>
                ) : (
                    <button
                        onClick={stopTrip}
                        className="trip-btn trip-btn-stop"
                        aria-label="Stop Trip"
                    >
                        <Pause size={48} className="text-white" />
                        <span className="text-white text-xl font-bold mt-2">STOP TRIP</span>
                    </button>
                )}
            </div>

            <div className="w-full max-w-sm">
                <Button
                    variant="danger"
                    className="w-full py-4 text-lg font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 rounded-2xl h-16 flex items-center justify-center gap-3 transition-all transform active:scale-95"
                    onClick={toogleSOS}
                >
                    <AlertTriangle size={24} />
                    {busStatus === 'SOS' ? 'CANCEL SOS ALERT' : 'SEND EMERGENCY SOS'}
                </Button>
                <p className="text-center text-xs text-slate-400 mt-3">
                    Sends instant alert to School Admin and Parents
                </p>
            </div>
        </div>
    );
}

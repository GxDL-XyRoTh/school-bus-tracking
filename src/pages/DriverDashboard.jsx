import { useAuth } from '../context/AuthContext';
import { useBus } from '../context/BusContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { Play, Pause, AlertTriangle, Bus, MapPin, Clock, Radio, Navigation } from 'lucide-react';

export default function DriverDashboard() {
    const { user } = useAuth();
    const {
        isSharing,
        startTrip,
        stopTrip,
        toggleSOS,
        busStatus,
        currentLocation,
        locationPermission
    } = useBus();

    const getStatusConfig = () => {
        if (busStatus === 'SOS') return { color: 'danger', label: 'EMERGENCY', pulse: true };
        if (busStatus === 'Moving') return { color: 'success', label: 'EN ROUTE', pulse: true };
        if (busStatus === 'Reached School') return { color: 'primary', label: 'ARRIVED', pulse: false };
        return { color: 'warning', label: 'STANDBY', pulse: false };
    };

    const status = getStatusConfig();

    return (
        <div className="driver-dashboard">
            {/* Header Card */}
            <Card className="driver-header-card">
                <div className="driver-header-content">
                    <div className="driver-bus-icon">
                        <Bus size={32} />
                    </div>
                    <div className="driver-info">
                        <h2 className="driver-title">Driver Console</h2>
                        <p className="driver-bus-number">{user?.busNumber || 'MH-02-1234'}</p>
                    </div>
                    <div className={`driver-status-badge status-${status.color} ${status.pulse ? 'pulse' : ''}`}>
                        <Radio size={14} />
                        <span>{status.label}</span>
                    </div>
                </div>
            </Card>

            {/* Live Info Strip */}
            <div className="driver-info-strip">
                <div className="info-item">
                    <MapPin size={16} />
                    <span>{currentLocation?.label || 'Unknown'}</span>
                </div>
                <div className="info-item">
                    <Clock size={16} />
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {isSharing && (
                    <div className="info-item live-indicator">
                        <Navigation size={16} />
                        <span>LIVE</span>
                    </div>
                )}
            </div>

            {/* Main Action Button */}
            <div className="driver-action-container">
                <div className="action-ring">
                    {!isSharing ? (
                        <button
                            onClick={startTrip}
                            className="trip-btn trip-btn-start"
                            aria-label="Start Trip"
                        >
                            <div className="trip-btn-inner">
                                <Play className="trip-icon" />
                                <span className="trip-label">START TRIP</span>
                            </div>
                        </button>
                    ) : (
                        <button
                            onClick={stopTrip}
                            className="trip-btn trip-btn-stop"
                            aria-label="Stop Trip"
                        >
                            <div className="trip-btn-inner">
                                <Pause className="trip-icon" />
                                <span className="trip-label">STOP TRIP</span>
                            </div>
                        </button>
                    )}
                </div>
                <p className="action-hint">
                    {isSharing
                        ? `Sharing ${locationPermission === 'granted' ? 'live GPS' : 'simulated'} location`
                        : 'Tap to start sharing your location'}
                </p>
            </div>

            {/* SOS Button */}
            <div className="driver-sos-container">
                <Button
                    variant="danger"
                    className={`sos-button ${busStatus === 'SOS' ? 'sos-active' : ''}`}
                    onClick={toggleSOS}
                >
                    <AlertTriangle size={22} />
                    <span>{busStatus === 'SOS' ? 'CANCEL SOS' : 'EMERGENCY SOS'}</span>
                </Button>
                <p className="sos-hint">
                    Instantly alerts school admin and all parents
                </p>
            </div>
        </div>
    );
}

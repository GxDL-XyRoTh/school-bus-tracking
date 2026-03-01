import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ref, set, onValue, get } from 'firebase/database';
import { db } from '../firebase';
import { BUS_ROUTE, INITIAL_ALERTS } from '../data/mockData';

const BusContext = createContext();

const BUS_REF = 'bus/status';

export const BusProvider = ({ children }) => {
    const [isSharing, setIsSharing] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(BUS_ROUTE[0]);
    const [alerts, setAlerts] = useState(INITIAL_ALERTS);
    const [busStatus, setBusStatus] = useState("Stopped");
    const [firebaseConnected, setFirebaseConnected] = useState(false);

    const [locationPermission, setLocationPermission] = useState("pending");
    const watchIdRef = useRef(null);
    const routeIndexRef = useRef(0);
    const isDriverRef = useRef(false);

    // Test Firebase connection on mount
    useEffect(() => {
        const testRef = ref(db, 'bus/ping');
        set(testRef, { timestamp: Date.now(), test: true })
            .then(() => {
                console.log('[BusTracker] Firebase connected successfully');
                setFirebaseConnected(true);
            })
            .catch((err) => {
                console.error('[BusTracker] Firebase connection failed:', err);
                setFirebaseConnected(false);
            });
    }, []);

    // Write state to Firebase (Driver only)
    const syncToFirebase = useCallback((data) => {
        const busRef = ref(db, BUS_REF);
        set(busRef, {
            isSharing: data.isSharing,
            busStatus: data.busStatus,
            currentLocation: {
                lat: data.currentLocation.lat,
                lng: data.currentLocation.lng,
                label: data.currentLocation.label || "Live Location"
            },
            lastUpdated: Date.now()
        })
            .then(() => {
                console.log('[BusTracker] Synced to Firebase:', data.busStatus, data.currentLocation.lat, data.currentLocation.lng);
            })
            .catch((err) => {
                console.error('[BusTracker] Firebase write FAILED:', err);
            });
    }, []);

    // Write alerts separately
    const syncAlertsToFirebase = useCallback((alertsList) => {
        const alertsRef = ref(db, 'bus/alerts');
        set(alertsRef, alertsList.slice(0, 20))
            .catch((err) => console.error('[BusTracker] Alerts write failed:', err));
    }, []);

    // Listen to Firebase for real-time updates (Parent/Admin only)
    useEffect(() => {
        console.log('[BusTracker] Setting up Firebase listeners...');

        const busRef = ref(db, BUS_REF);
        const unsubStatus = onValue(busRef, (snapshot) => {
            const data = snapshot.val();
            console.log('[BusTracker] Firebase data received:', data);

            if (!data) {
                console.log('[BusTracker] No data in Firebase yet');
                return;
            }

            // Skip if this tab is the driver (driver manages own state)
            if (isDriverRef.current) {
                console.log('[BusTracker] Skipping update (this is driver tab)');
                return;
            }

            // Update state from Firebase
            setIsSharing(data.isSharing ?? false);
            setBusStatus(data.busStatus ?? "Stopped");
            if (data.currentLocation && data.currentLocation.lat && data.currentLocation.lng) {
                console.log('[BusTracker] Updating location:', data.currentLocation.lat, data.currentLocation.lng);
                setCurrentLocation({
                    lat: data.currentLocation.lat,
                    lng: data.currentLocation.lng,
                    label: data.currentLocation.label || "Live Location"
                });
            }
        }, (error) => {
            console.error('[BusTracker] Firebase listener error:', error);
        });

        const alertsRef = ref(db, 'bus/alerts');
        const unsubAlerts = onValue(alertsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            if (isDriverRef.current) return;

            const alertsArray = Array.isArray(data) ? data : Object.values(data);
            setAlerts(alertsArray);
        }, (error) => {
            console.error('[BusTracker] Alerts listener error:', error);
        });

        return () => {
            unsubStatus();
            unsubAlerts();
        };
    }, []);

    const addAlert = useCallback((message, type = "info") => {
        const newAlert = {
            id: Date.now(),
            message,
            type,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAlerts((prev) => {
            const newAlerts = [newAlert, ...prev];
            if (isDriverRef.current) {
                syncAlertsToFirebase(newAlerts);
            }
            return newAlerts;
        });
    }, [syncAlertsToFirebase]);

    // Request GPS and start trip
    const requestLocationAndStartTrip = async () => {
        isDriverRef.current = true;
        console.log('[BusTracker] Driver starting trip, isDriver=true');

        if (!navigator.geolocation) {
            setLocationPermission("denied");
            addAlert("Geolocation not supported. Using simulated route.", "warning");
            startSimulatedTrip();
            return;
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            setLocationPermission("granted");

            const initialLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                label: "Live Location"
            };
            console.log('[BusTracker] GPS position:', initialLocation.lat, initialLocation.lng);
            setCurrentLocation(initialLocation);
            setIsSharing(true);
            setBusStatus("Moving");
            syncToFirebase({ isSharing: true, busStatus: "Moving", currentLocation: initialLocation });
            addAlert("Live location sharing started", "success");

            watchIdRef.current = navigator.geolocation.watchPosition(
                (pos) => {
                    const newLocation = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        label: "Live Location",
                        accuracy: pos.coords.accuracy
                    };
                    console.log('[BusTracker] GPS update:', newLocation.lat, newLocation.lng);
                    setCurrentLocation(newLocation);
                    syncToFirebase({ isSharing: true, busStatus: "Moving", currentLocation: newLocation });
                },
                (error) => {
                    console.error("[BusTracker] GPS Error:", error);
                    addAlert("GPS signal lost", "warning");
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 1000
                }
            );

        } catch (error) {
            console.error('[BusTracker] GPS permission denied:', error);
            setLocationPermission("denied");
            addAlert("Location access denied. Using simulated route.", "warning");
            startSimulatedTrip();
        }
    };

    const startSimulatedTrip = () => {
        isDriverRef.current = true;
        routeIndexRef.current = 0;
        const initialLocation = BUS_ROUTE[0];
        setCurrentLocation(initialLocation);
        setIsSharing(true);
        setBusStatus("Moving");
        syncToFirebase({ isSharing: true, busStatus: "Moving", currentLocation: initialLocation });
        addAlert("Bus trip started (simulated route)", "info");
    };

    useEffect(() => {
        let interval;

        if (isSharing && busStatus === "Moving" && locationPermission !== "granted" && isDriverRef.current) {
            interval = setInterval(() => {
                routeIndexRef.current += 1;

                if (routeIndexRef.current >= BUS_ROUTE.length) {
                    const finalLocation = BUS_ROUTE[BUS_ROUTE.length - 1];
                    setBusStatus("Reached School");
                    setIsSharing(false);
                    syncToFirebase({ isSharing: false, busStatus: "Reached School", currentLocation: finalLocation });
                    addAlert("Bus reached destination", "success");
                    routeIndexRef.current = 0;
                    return;
                }

                const newLocation = BUS_ROUTE[routeIndexRef.current];
                setCurrentLocation(newLocation);
                syncToFirebase({ isSharing: true, busStatus: "Moving", currentLocation: newLocation });
            }, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isSharing, busStatus, locationPermission, syncToFirebase, addAlert]);

    const startTrip = async () => {
        await requestLocationAndStartTrip();
    };

    const stopTrip = () => {
        setIsSharing(false);
        setBusStatus("Stopped");

        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        syncToFirebase({ isSharing: false, busStatus: "Stopped", currentLocation });
        addAlert("Location sharing stopped", "warning");
    };

    const toggleSOS = () => {
        const isSOS = busStatus === "SOS";
        if (isSOS) {
            const newStatus = isSharing ? "Moving" : "Stopped";
            setBusStatus(newStatus);
            syncToFirebase({ isSharing, busStatus: newStatus, currentLocation });
            addAlert("SOS Cancelled", "info");
        } else {
            setBusStatus("SOS");
            syncToFirebase({ isSharing, busStatus: "SOS", currentLocation });
            addAlert("SOS Alert Triggered!", "danger");
        }
    };

    return (
        <BusContext.Provider value={{
            isSharing,
            currentLocation,
            busStatus,
            alerts,
            locationPermission,
            firebaseConnected,
            startTrip,
            stopTrip,
            toggleSOS,
            addAlert
        }}>
            {children}
        </BusContext.Provider>
    );
};

export const useBus = () => useContext(BusContext);

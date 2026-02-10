import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../firebase';
import { BUS_ROUTE, INITIAL_ALERTS } from '../data/mockData';

const BusContext = createContext();

// Firebase path
const BUS_REF = 'bus/status';

export const BusProvider = ({ children }) => {
    const [isSharing, setIsSharing] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(BUS_ROUTE[0]);
    const [alerts, setAlerts] = useState(INITIAL_ALERTS);
    const [busStatus, setBusStatus] = useState("Stopped");

    const [locationPermission, setLocationPermission] = useState("pending");
    const watchIdRef = useRef(null);
    const routeIndexRef = useRef(0);
    const isDriverRef = useRef(false);

    // Write state to Firebase (Driver only)
    const syncToFirebase = useCallback((data) => {
        try {
            const busRef = ref(db, BUS_REF);
            set(busRef, {
                isSharing: data.isSharing,
                busStatus: data.busStatus,
                currentLocation: data.currentLocation,
                lastUpdated: Date.now()
            });
        } catch (e) {
            console.error('Firebase write error:', e);
        }
    }, []);

    // Write alerts separately
    const syncAlertsToFirebase = useCallback((alertsList) => {
        try {
            const alertsRef = ref(db, 'bus/alerts');
            // Only keep last 20 alerts to avoid bloat
            set(alertsRef, alertsList.slice(0, 20));
        } catch (e) {
            console.error('Firebase alerts write error:', e);
        }
    }, []);

    // Listen to Firebase for real-time updates (Parent/Admin)
    useEffect(() => {
        // Listen for bus status changes
        const busRef = ref(db, BUS_REF);
        const unsubStatus = onValue(busRef, (snapshot) => {
            const data = snapshot.val();
            if (!data || isDriverRef.current) return;

            setIsSharing(data.isSharing ?? false);
            setBusStatus(data.busStatus ?? "Stopped");
            if (data.currentLocation) {
                setCurrentLocation(data.currentLocation);
            }
        });

        // Listen for alerts
        const alertsRef = ref(db, 'bus/alerts');
        const unsubAlerts = onValue(alertsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data || isDriverRef.current) return;
            setAlerts(data);
        });

        return () => {
            unsubStatus();
            unsubAlerts();
        };
    }, []);

    // Add alert
    const addAlert = useCallback((message, type = "info") => {
        const newAlert = {
            id: Date.now(),
            message,
            type,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAlerts((prev) => {
            const newAlerts = [newAlert, ...prev];
            syncAlertsToFirebase(newAlerts);
            return newAlerts;
        });
    }, [syncAlertsToFirebase]);

    // Request GPS and start trip
    const requestLocationAndStartTrip = async () => {
        isDriverRef.current = true;

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
            setCurrentLocation(initialLocation);
            setIsSharing(true);
            setBusStatus("Moving");
            syncToFirebase({ isSharing: true, busStatus: "Moving", currentLocation: initialLocation });
            addAlert("Live location sharing started", "success");

            // Watch position continuously
            watchIdRef.current = navigator.geolocation.watchPosition(
                (pos) => {
                    const newLocation = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        label: "Live Location",
                        accuracy: pos.coords.accuracy
                    };
                    setCurrentLocation(newLocation);
                    syncToFirebase({ isSharing: true, busStatus: "Moving", currentLocation: newLocation });
                },
                (error) => {
                    console.error("GPS Error:", error);
                    addAlert("GPS signal lost", "warning");
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 1000
                }
            );

        } catch (error) {
            setLocationPermission("denied");
            addAlert("Location access denied. Using simulated route.", "warning");
            startSimulatedTrip();
        }
    };

    // Simulated trip fallback
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

    // Simulated route interval
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

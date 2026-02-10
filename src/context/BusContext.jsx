import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { BUS_ROUTE, INITIAL_ALERTS } from '../data/mockData';

const BusContext = createContext();

// LocalStorage key for cross-tab sync
const SYNC_KEY = 'bus_tracker_sync';

export const BusProvider = ({ children }) => {
    const [isSharing, setIsSharing] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(BUS_ROUTE[0]);
    const [alerts, setAlerts] = useState(INITIAL_ALERTS);
    const [busStatus, setBusStatus] = useState("Stopped"); // Stopped, Moving, Reached, SOS

    // GPS Location Sharing
    const [locationPermission, setLocationPermission] = useState("pending");
    const watchIdRef = useRef(null);
    const routeIndexRef = useRef(0);
    const isDriverRef = useRef(false); // Track if this tab is the driver

    // Broadcast state to other tabs via localStorage
    const broadcastState = useCallback((state) => {
        try {
            localStorage.setItem(SYNC_KEY, JSON.stringify({
                ...state,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.error('Failed to broadcast state:', e);
        }
    }, []);

    // Listen for changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key !== SYNC_KEY || !e.newValue) return;

            // Only non-driver tabs should listen for updates
            if (isDriverRef.current) return;

            try {
                const syncedState = JSON.parse(e.newValue);

                // Update local state from synced data
                if (syncedState.isSharing !== undefined) {
                    setIsSharing(syncedState.isSharing);
                }
                if (syncedState.busStatus !== undefined) {
                    setBusStatus(syncedState.busStatus);
                }
                if (syncedState.currentLocation !== undefined) {
                    setCurrentLocation(syncedState.currentLocation);
                }
                if (syncedState.alerts !== undefined) {
                    setAlerts(syncedState.alerts);
                }
            } catch (e) {
                console.error('Failed to parse synced state:', e);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // On mount, load existing state from localStorage
        try {
            const existingState = localStorage.getItem(SYNC_KEY);
            if (existingState) {
                const syncedState = JSON.parse(existingState);
                // Only apply if recent (within last 5 minutes)
                if (Date.now() - syncedState.timestamp < 5 * 60 * 1000) {
                    if (syncedState.isSharing !== undefined) setIsSharing(syncedState.isSharing);
                    if (syncedState.busStatus !== undefined) setBusStatus(syncedState.busStatus);
                    if (syncedState.currentLocation !== undefined) setCurrentLocation(syncedState.currentLocation);
                }
            }
        } catch (e) {
            console.error('Failed to load initial state:', e);
        }

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Add alert function
    const addAlert = useCallback((message, type = "info") => {
        const newAlert = {
            id: Date.now(),
            message,
            type,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAlerts((prev) => {
            const newAlerts = [newAlert, ...prev];
            // Broadcast alerts to other tabs
            broadcastState({ alerts: newAlerts });
            return newAlerts;
        });
    }, [broadcastState]);

    // Sync state changes to other tabs
    const syncStateToTabs = useCallback((newIsSharing, newBusStatus, newLocation) => {
        broadcastState({
            isSharing: newIsSharing,
            busStatus: newBusStatus,
            currentLocation: newLocation
        });
    }, [broadcastState]);

    // Request location permission and start GPS tracking
    const requestLocationAndStartTrip = async () => {
        isDriverRef.current = true; // Mark this tab as driver

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

            // Sync to other tabs
            syncStateToTabs(true, "Moving", initialLocation);
            addAlert("Live location sharing started", "success");

            // Start watching position
            watchIdRef.current = navigator.geolocation.watchPosition(
                (pos) => {
                    const newLocation = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        label: "Live Location",
                        accuracy: pos.coords.accuracy
                    };
                    setCurrentLocation(newLocation);
                    // Sync location to other tabs
                    syncStateToTabs(true, "Moving", newLocation);
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

    // Start simulated trip
    const startSimulatedTrip = () => {
        isDriverRef.current = true;
        routeIndexRef.current = 0;
        const initialLocation = BUS_ROUTE[0];
        setCurrentLocation(initialLocation);
        setIsSharing(true);
        setBusStatus("Moving");
        syncStateToTabs(true, "Moving", initialLocation);
        addAlert("Bus trip started (simulated route)", "info");
    };

    // Simulated route interval
    useEffect(() => {
        let interval;

        if (isSharing && busStatus === "Moving" && locationPermission !== "granted" && isDriverRef.current) {
            interval = setInterval(() => {
                routeIndexRef.current += 1;

                if (routeIndexRef.current >= BUS_ROUTE.length) {
                    setBusStatus("Reached School");
                    setIsSharing(false);
                    syncStateToTabs(false, "Reached School", BUS_ROUTE[BUS_ROUTE.length - 1]);
                    addAlert("Bus reached destination", "success");
                    routeIndexRef.current = 0;
                    return;
                }

                const newLocation = BUS_ROUTE[routeIndexRef.current];
                setCurrentLocation(newLocation);
                syncStateToTabs(true, "Moving", newLocation);
            }, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isSharing, busStatus, locationPermission, syncStateToTabs, addAlert]);

    // Start trip
    const startTrip = async () => {
        await requestLocationAndStartTrip();
    };

    // Stop trip
    const stopTrip = () => {
        setIsSharing(false);
        setBusStatus("Stopped");

        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        syncStateToTabs(false, "Stopped", currentLocation);
        addAlert("Location sharing stopped", "warning");
    };

    const toggleSOS = () => {
        const isSOS = busStatus === "SOS";
        if (isSOS) {
            const newStatus = isSharing ? "Moving" : "Stopped";
            setBusStatus(newStatus);
            syncStateToTabs(isSharing, newStatus, currentLocation);
            addAlert("SOS Cancelled", "info");
        } else {
            setBusStatus("SOS");
            syncStateToTabs(isSharing, "SOS", currentLocation);
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

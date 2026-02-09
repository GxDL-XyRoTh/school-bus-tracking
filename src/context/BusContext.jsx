import { createContext, useContext, useState, useEffect } from 'react';
import { BUS_ROUTE, INITIAL_ALERTS } from '../data/mockData';

const BusContext = createContext();

export const BusProvider = ({ children }) => {
    const [isSharing, setIsSharing] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(BUS_ROUTE[0]);
    const [routeIndex, setRouteIndex] = useState(0);
    const [alerts, setAlerts] = useState(INITIAL_ALERTS);
    const [busStatus, setBusStatus] = useState("Stopped"); // Stopped, Moving, Reached, SOS

    useEffect(() => {
        let interval;
        if (isSharing && busStatus === "Moving") {
            interval = setInterval(() => {
                setRouteIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;

                    // Loop or Stop? Let's loop for demo fun, or stop.
                    // Let's bounce back and forth or just restart. 
                    // For a simple demo: Restart if end reached? Or just stop.
                    if (nextIndex >= BUS_ROUTE.length) {
                        // Reached destination
                        setBusStatus("Reached School");
                        setIsSharing(false);
                        addAlert("Bus reached destination", "success");
                        return prevIndex;
                    }

                    setCurrentLocation(BUS_ROUTE[nextIndex]);
                    return nextIndex;
                });
            }, 3000); // 3 seconds per hop
        }
        return () => clearInterval(interval);
    }, [isSharing, busStatus]);

    const startTrip = () => {
        setIsSharing(true);
        setBusStatus("Moving");
        addAlert("Bus started trip", "info");
    };

    const stopTrip = () => {
        setIsSharing(false);
        setBusStatus("Stopped");
        addAlert("Bus trip paused", "warning");
    };

    const toggleSOS = () => {
        const isSOS = busStatus === "SOS";
        if (isSOS) {
            setBusStatus(isSharing ? "Moving" : "Stopped");
            addAlert("SOS Cancelled", "info");
        } else {
            setBusStatus("SOS");
            addAlert("SOS Alert Triggered!", "danger");
        }
    };

    const addAlert = (message, type = "info") => {
        const newAlert = {
            id: Date.now(),
            message,
            type,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAlerts((prev) => [newAlert, ...prev]);
    };

    return (
        <BusContext.Provider value={{
            isSharing,
            currentLocation,
            busStatus,
            alerts,
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

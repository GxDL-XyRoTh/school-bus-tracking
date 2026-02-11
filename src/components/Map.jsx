import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';

// Fix for default markers in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// This component handles panning the map when the position changes
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.flyTo(center, map.getZoom(), {
                animate: true,
                duration: 1.5
            });
        }
    }, [center[0], center[1], map]);
    return null;
}

// This component handles updating the marker position reactively
function DraggableMarker({ position, label }) {
    const markerPosition = useMemo(() => {
        return [position[0], position[1]];
    }, [position[0], position[1]]);

    return (
        <Marker position={markerPosition}>
            <Popup>
                <div style={{ textAlign: 'center' }}>
                    <strong>School Bus</strong><br />
                    {label || 'Live Location'}
                </div>
            </Popup>
        </Marker>
    );
}

export default function Map({ position }) {
    const lat = position?.lat || position?.[0];
    const lng = position?.lng || position?.[1];
    const label = position?.label || 'Live Location';

    if (!lat || !lng) return <div>Loading Map...</div>;

    const center = [lat, lng];

    return (
        <div className="map-wrapper" style={{ height: '100%', width: '100%', borderRadius: '1rem', overflow: 'hidden', position: 'relative', zIndex: 0 }}>
            <MapContainer center={center} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker position={center} label={label} />
                <MapUpdater center={center} />
            </MapContainer>
        </div>
    )
}

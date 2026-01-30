import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
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

function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 16, {
            animate: true,
            duration: 1.5
        });
    }, [center, map]);
    return null;
}

export default function Map({ position }) {
    // position is { lat, lng } or [lat, lng]
    // Ensure we handle both if possible, or stick to object
    const lat = position.lat || position[0];
    const lng = position.lng || position[1];

    // Default fallback
    if (!lat || !lng) return <div>Loading Map...</div>;

    const center = [lat, lng];

    return (
        <div className="map-wrapper" style={{ height: '100%', width: '100%', borderRadius: '1rem', overflow: 'hidden', position: 'relative', zIndex: 0 }}>
            <MapContainer center={center} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>
                        <div style={{ textAlign: 'center' }}>
                            <strong>School Bus</strong><br />
                            Live Location
                        </div>
                    </Popup>
                </Marker>
                <MapUpdater center={center} />
            </MapContainer>
        </div>
    )
}

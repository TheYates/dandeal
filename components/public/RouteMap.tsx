"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface RouteMapProps {
  fromLocation: Location | null;
  toLocation: Location | null;
}

// Component to handle map bounds adjustment
function MapBounds({ fromLocation, toLocation }: RouteMapProps) {
  const map = useMap();

  useEffect(() => {
    if (fromLocation && toLocation) {
      const bounds = L.latLngBounds(
        [fromLocation.lat, fromLocation.lng],
        [toLocation.lat, toLocation.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [fromLocation, toLocation, map]);

  return null;
}

export default function RouteMap({ fromLocation, toLocation }: RouteMapProps) {
  if (!fromLocation || !toLocation) {
    return null;
  }

  const positions: [number, number][] = [
    [fromLocation.lat, fromLocation.lng],
    [toLocation.lat, toLocation.lng],
  ];

  // Calculate center point
  const centerLat = (fromLocation.lat + toLocation.lat) / 2;
  const centerLng = (fromLocation.lng + toLocation.lng) / 2;

  return (
    <div className="w-full h-[350px] rounded-lg overflow-hidden border border-gray-300 mt-4">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* From Marker */}
        <Marker position={[fromLocation.lat, fromLocation.lng]}>
        </Marker>

        {/* To Marker */}
        <Marker position={[toLocation.lat, toLocation.lng]}>
        </Marker>

        {/* Route Line */}
        <Polyline
          positions={positions}
          color="#ea580c"
          weight={3}
          opacity={0.7}
        />

        {/* Adjust bounds to fit markers */}
        <MapBounds fromLocation={fromLocation} toLocation={toLocation} />
      </MapContainer>
    </div>
  );
}


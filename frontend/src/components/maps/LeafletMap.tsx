"use client";

import React, { useEffect, useRef, useState } from "react";

interface LeafletMapProps {
  initialLat?: number;
  initialLng?: number;
  zoom?: number;
  interactive?: boolean; // Can click to select location
  onLocationSelect?: (lat: number, lng: number) => void;
  markers?: Array<{
    lat: number;
    lng: number;
    title: string;
    category?: string;
    status?: string;
  }>;
  className?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  initialLat = -5.4294,
  initialLng = 105.2625,
  zoom = 13,
  interactive = false,
  onLocationSelect,
  markers = [],
  className = "w-full h-80 rounded-xl",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);

  const [currentCoord, setCurrentCoord] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Load Leaflet CSS dynamically if not present
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Dynamic import Leaflet
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default marker icon issues in Webpack/Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add interactive click listener
        if (interactive) {
          const mainMarker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
          currentMarkerRef.current = mainMarker;

          mainMarker.on("dragend", () => {
            const pos = mainMarker.getLatLng();
            setCurrentCoord({ lat: pos.lat, lng: pos.lng });
            if (onLocationSelect) onLocationSelect(pos.lat, pos.lng);
          });

          map.on("click", (e: any) => {
            const { lat, lng } = e.latlng;
            mainMarker.setLatLng([lat, lng]);
            setCurrentCoord({ lat, lng });
            if (onLocationSelect) onLocationSelect(lat, lng);
          });
        }
      }

      // Render custom markers
      if (markers.length > 0 && mapInstanceRef.current) {
        markers.forEach((m) => {
          const marker = L.marker([m.lat, m.lng]).addTo(mapInstanceRef.current);
          const popupContent = `
            <div style="font-family: sans-serif; font-size: 13px;">
              <strong style="color: #0F294A;">${m.title}</strong><br/>
              <span style="color: #64748B;">Kategori: ${m.category || "-"}</span><br/>
              <span style="font-weight: bold; color: #2563EB;">Status: ${m.status || "-"}</span>
            </div>
          `;
          marker.bindPopup(popupContent);
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [initialLat, initialLng, zoom, interactive, markers, onLocationSelect]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage("Perangkat Anda tidak mendukung geolokasi GPS");
      return;
    }

    setGpsLoading(true);
    setGpsMessage("Mencari titik koordinat GPS presisi...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const { latitude, longitude } = pos.coords;
        setCurrentCoord({ lat: latitude, lng: longitude });
        setGpsMessage(`Titik koordinat berhasil dikunci (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 16);
          if (currentMarkerRef.current) {
            currentMarkerRef.current.setLatLng([latitude, longitude]);
          }
        }
        if (onLocationSelect) {
          onLocationSelect(latitude, longitude);
        }
      },
      (err) => {
        setGpsLoading(false);
        setGpsMessage(`Izin lokasi GPS ditolak/tidak tersedia (${err.message}). Silakan geser pin pada peta.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="flex flex-col gap-space-xs">
      {interactive && (
        <div className="flex items-center justify-between mb-1">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={gpsLoading}
            className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary hover:text-on-secondary transition-all text-xs font-semibold shadow-sm"
          >
            <span className={`material-symbols-outlined text-base ${gpsLoading ? "animate-spin" : ""}`}>
              {gpsLoading ? "progress_activity" : "my_location"}
            </span>
            <span>{gpsLoading ? "Mendeteksi Koordinat..." : "Deteksi Lokasi GPS Saya"}</span>
          </button>
          <span className="text-[11px] text-on-surface-variant font-mono">
            {currentCoord.lat.toFixed(5)}, {currentCoord.lng.toFixed(5)}
          </span>
        </div>
      )}

      {gpsMessage && (
        <div className="px-space-sm py-1 rounded bg-surface-container-low text-xs text-on-surface-variant border border-outline-variant/30">
          {gpsMessage}
        </div>
      )}

      <div ref={mapContainerRef} className={`${className} border border-outline-variant/30 shadow-sm relative z-0`} />
    </div>
  );
};


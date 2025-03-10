
import { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map as MapboxMap, Marker, Popup } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';
import { Station } from '@/types';
import { BatteryCharging, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Replace with your Mapbox access token
// In production, you should use environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbG4zczJldmgwMDRwMnFxaDdpZW41am50In0.a3JBrVeKYDgsbfSJ9ykGog';

interface MapProps {
  stations: Station[];
  center?: [number, number];
  zoom?: number;
}

const Map = ({ stations, center = [-95.7129, 37.0902], zoom = 3.5 }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigate = useNavigate();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center,
      zoom,
      pitchWithRotate: false,
      attributionControl: false
    });

    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapInstance.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    // Add animation when map loads
    mapInstance.on('load', () => {
      setMapLoaded(true);

      // Add a subtle atmosphere effect
      mapInstance.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 255)',
        'horizon-blend': 0.1,
        'space-color': 'rgb(220, 230, 255)',
        'star-intensity': 0
      });

      // Custom map interactions
      mapInstance.dragRotate.disable();
      mapInstance.touchZoomRotate.disableRotation();
    });

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, [center, zoom]);

  // Update markers when stations change
  useEffect(() => {
    if (!map.current || !mapLoaded || !stations.length) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    stations.forEach((station) => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = cn(
        'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer',
        'shadow-md hover:scale-110 border-2 border-white',
        station.status === 'available' 
          ? 'bg-station-available' 
          : station.status === 'maintenance' 
            ? 'bg-station-maintenance' 
            : 'bg-station-unavailable'
      );

      // Add icon based on station type
      const iconElement = document.createElement('div');
      iconElement.className = 'text-white';
      
      if (station.type === 'charging') {
        iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 6v14"></path><path d="m15 9-4-3-4 3"></path><path d="M9 20h6"></path></svg>`;
      } else if (station.type === 'repair') {
        iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`;
      } else {
        iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 6v14"></path><path d="m15 9-4-3-4 3"></path><path d="M9 20h6"></path></svg>`;
      }
      
      markerElement.appendChild(iconElement);

      // Create popup
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        className: 'rounded-lg shadow-lg'
      }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-medium text-base">${station.name}</h3>
          <p class="text-sm text-muted-foreground mt-1">${station.address}</p>
          <div class="flex items-center mt-2">
            <span class="inline-flex px-2 py-1 text-xs rounded-full ${
              station.status === 'available' 
                ? 'bg-green-100 text-green-800' 
                : station.status === 'maintenance' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-red-100 text-red-800'
            }">
              ${station.status.charAt(0).toUpperCase() + station.status.slice(1)}
            </span>
            ${station.chargingPoints ? `
              <span class="text-xs text-muted-foreground ml-2">
                ${station.chargingPoints.available}/${station.chargingPoints.total} available
              </span>
            ` : ''}
          </div>
          <button class="w-full mt-3 text-center py-1.5 text-sm text-white bg-primary rounded-md hover:bg-primary/90 transition-colors">
            View Details
          </button>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'center'
      })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click event to navigate to station detail
      markerElement.addEventListener('click', () => {
        navigate(`/station/${station.id}`);
      });

      markersRef.current[station.id] = marker;
    });

    // Fit map to bounds if we have stations and aren't centered on a specific point
    if (stations.length > 1 && zoom === 3.5) {
      const bounds = new mapboxgl.LngLatBounds();
      stations.forEach(station => {
        bounds.extend([station.longitude, station.latitude]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 70,
        maxZoom: 15,
        duration: 1000
      });
    }
  }, [stations, mapLoaded, navigate, zoom]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm border">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-md shadow-sm py-2 px-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-station-available"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-3 h-3 rounded-full bg-station-unavailable"></span>
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-3 h-3 rounded-full bg-station-maintenance"></span>
          <span>Maintenance</span>
        </div>
      </div>
    </div>
  );
};

export default Map;

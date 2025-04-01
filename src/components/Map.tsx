
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
      style: 'mapbox://styles/mapbox/dark-v11', // Changed to dark mode map style
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
        color: 'rgb(20, 20, 30)',  // Darker fog color for dark mode
        'high-color': 'rgb(40, 40, 80)',
        'horizon-blend': 0.1,
        'space-color': 'rgb(20, 20, 40)',
        'star-intensity': 0.15   // Slight star effect for dark mode
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
      // Create custom marker element with nature image
      const markerElement = document.createElement('div');
      markerElement.className = cn(
        'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer',
        'shadow-lg hover:scale-110',
        'overflow-hidden border-2',
        station.status === 'available' 
          ? 'border-green-400' 
          : station.status === 'maintenance' 
            ? 'border-yellow-400' 
            : 'border-red-400'
      );

      // Add nature image based on station type
      const imageUrl = station.type === 'charging' 
        ? '/lovable-uploads/3ca6e09a-4f2c-481c-bbaf-9ba7b71ebd04.png' // EV charger with nature background
        : station.type === 'repair'
          ? '/lovable-uploads/3ca6e09a-4f2c-481c-bbaf-9ba7b71ebd04.png' // Repair station with nature background
          : '/lovable-uploads/3ca6e09a-4f2c-481c-bbaf-9ba7b71ebd04.png'; // Default nature image
        
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      imgElement.className = 'w-full h-full object-cover';
      markerElement.appendChild(imgElement);

      // Add status indicator
      const statusIndicator = document.createElement('div');
      statusIndicator.className = cn(
        'absolute bottom-0 right-0 w-4 h-4 rounded-full border border-white',
        station.status === 'available' 
          ? 'bg-green-500' 
          : station.status === 'maintenance' 
            ? 'bg-yellow-500' 
            : 'bg-red-500'
      );
      markerElement.appendChild(statusIndicator);

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        className: 'rounded-lg shadow-lg dark:bg-background dark:text-foreground'
      }).setHTML(`
        <div class="p-3 min-w-[200px] bg-white dark:bg-background text-black dark:text-white">
          <h3 class="font-medium text-base text-black dark:text-white">${station.name}</h3>
          <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">${station.address}</p>
          <div class="flex items-center mt-2">
            <span class="inline-flex px-2 py-1 text-xs rounded-full ${
              station.status === 'available' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : station.status === 'maintenance' 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }">
              ${station.status.charAt(0).toUpperCase() + station.status.slice(1)}
            </span>
            ${station.chargingPoints ? `
              <span class="text-xs text-gray-600 dark:text-gray-400 ml-2">
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
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm border border-gray-700">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-background/90 backdrop-blur-sm rounded-md shadow-sm py-2 px-3 text-xs text-black dark:text-white">
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

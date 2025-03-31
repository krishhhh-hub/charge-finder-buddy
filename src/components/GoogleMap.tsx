
import { useRef, useEffect, useState } from 'react';
import { Station } from '@/types';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MapProps {
  stations: Station[];
  center?: number[];
  zoom?: number;
}

// Define Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMap = ({ 
  stations, 
  center, 
  zoom = 4 
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const navigate = useNavigate();

  // Load Google Maps API
  useEffect(() => {
    if (window.google) {
      initMap();
      return;
    }
    
    // For a real application, you should use an environment variable for the API key
    const apiKey = 'AIzaSyA-sample-key-for-demonstration-only';
    
    window.initMap = initMap;
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    return () => {
      window.initMap = () => {};
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  function initMap() {
    if (!mapRef.current) return;
    
    const defaultCenter = center ? { lat: center[1], lng: center[0] } : { lat: 37.7749, lng: -122.4194 };
    
    const mapOptions = {
      center: defaultCenter,
      zoom,
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [{"color": "#212121"}]
        },
        {
          "elementType": "labels.icon",
          "stylers": [{"visibility": "off"}]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#757575"}]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{"color": "#212121"}]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [{"color": "#757575"}]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#9e9e9e"}]
        },
        {
          "featureType": "administrative.land_parcel",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#bdbdbd"}]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#757575"}]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{"color": "#181818"}]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#616161"}]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [{"color": "#1b1b1b"}]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#2c2c2c"}]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#8a8a8a"}]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{"color": "#373737"}]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{"color": "#3c3c3c"}]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [{"color": "#4e4e4e"}]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#616161"}]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#757575"}]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{"color": "#000000"}]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#3d3d3d"}]
        }
      ]
    };
    
    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
    setMapLoaded(true);
  }

  // Add markers when stations or map changes
  useEffect(() => {
    if (!map || !mapLoaded || !stations.length) return;
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
    
    const newMarkers = [];
    const bounds = new window.google.maps.LatLngBounds();
    
    stations.forEach((station) => {
      // Define marker colors based on station status
      const markerColor = station.status === 'available' 
        ? '#34D399' 
        : station.status === 'maintenance' 
          ? '#FBBF24' 
          : '#F87171';
      
      // Create marker
      const marker = new window.google.maps.Marker({
        position: { lat: station.latitude, lng: station.longitude },
        map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#FFFFFF',
          scale: 10,
        },
        title: station.name,
        animation: window.google.maps.Animation.DROP,
      });
      
      // Add click event
      marker.addListener('click', () => {
        navigate(`/station/${station.id}`);
      });
      
      // Add to markers array
      newMarkers.push(marker);
      
      // Extend bounds
      bounds.extend({ lat: station.latitude, lng: station.longitude });
    });
    
    // Set markers
    setMarkers(newMarkers);
    
    // Fit map to bounds if there are multiple stations and no center is specified
    if (stations.length > 1 && !center) {
      map.fitBounds(bounds);
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 13) map.setZoom(13);
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [map, mapLoaded, stations, navigate, center]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;

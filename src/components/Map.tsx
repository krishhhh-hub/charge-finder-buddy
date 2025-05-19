
import { useRef, useEffect, useState } from 'react';
import { Station } from '@/types';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MapProps {
  stations: Station[];
  center?: [number, number];
  zoom?: number;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const Map = ({ 
  stations, 
  center, 
  zoom = 3.5 
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
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
    if (!mapContainer.current) return;
    
    const defaultCenter = center ? { lat: center[1], lng: center[0] } : { lat: 37.7749, lng: -122.4194 };
    
    const mapOptions = {
      center: defaultCenter,
      zoom: zoom,
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
    
    const newMap = new window.google.maps.Map(mapContainer.current, mapOptions);
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
      // Define marker icon based on station type
      let markerIcon;
      
      if (station.type === 'charging') {
        markerIcon = {
          path: "M19 7h-1V2H6v5H5a3 3 0 0 0-3 3v9c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h12v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-9a3 3 0 0 0-3-3zM7 3h10v4H7V3zm13 14H4v-7c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v7zM7 15h2v-4H7v4zm6-4h-2v4h2v-4zm4 4V11h-2v4h2z",
          fillColor: "#34D399",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#FFFFFF",
          scale: 1.2,
        };
      } else {
        markerIcon = {
          path: "M17.8 13.75a1 1 0 0 0-.859.5A7.488 7.488 0 0 1 10 18a7.488 7.488 0 0 1-6.941-3.75.998.998 0 0 0-1.719 1.004A9.491 9.491 0 0 0 10 20a9.491 9.491 0 0 0 8.659-4.746 1 1 0 0 0-.859-1.504zm4.2-1.251h-4.5v-4.5a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5zM10 4a7.488 7.488 0 0 1 6.941 3.75 1 1 0 0 0 1.719-1.004A9.491 9.491 0 0 0 10 2a9.491 9.491 0 0 0-8.659 4.746.999.999 0 0 0 .859 1.504.987.987 0 0 0 .86-.5A7.488 7.488 0 0 1 10 4z",
          fillColor: "#FBBF24",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#FFFFFF",
          scale: 1.2,
        };
      }
      
      // Create marker
      const marker = new window.google.maps.Marker({
        position: { lat: station.latitude, lng: station.longitude },
        map,
        icon: markerIcon,
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
      <div ref={mapContainer} className="absolute inset-0" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Map;

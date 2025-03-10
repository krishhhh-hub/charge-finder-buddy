
import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, doc, getDoc, CollectionReference, Query } from 'firebase/firestore';
import { ref, onValue, off } from 'firebase/database';
import { db, realtimeDb } from '../firebase/config';
import { Station } from '../types';
import { toast } from 'sonner';

// Mock data for stations
const mockStations: Station[] = [
  {
    id: '1',
    name: 'Central EV Charging Hub',
    address: '123 Main St, Anytown, USA',
    latitude: 37.7749,
    longitude: -122.4194,
    type: 'charging',
    status: 'available',
    chargingPoints: {
      total: 10,
      available: 6
    },
    powerTypes: ['Level 2', 'DC Fast Charging'],
    amenities: ['Restrooms', 'Convenience Store', 'WiFi'],
    price: '$0.30/kWh',
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1593941707882-a5bba13938c2?q=80&w=1472&auto=format&fit=crop'],
    lastUpdated: Date.now()
  },
  {
    id: '2',
    name: 'QuickFix EV Repair',
    address: '456 Oak Ave, Somewhere, USA',
    latitude: 37.7848,
    longitude: -122.4294,
    type: 'repair',
    status: 'available',
    repairBays: {
      total: 5,
      available: 2
    },
    amenities: ['Waiting Area', 'Coffee Shop', 'Loaner Vehicles'],
    rating: 4.2,
    lastUpdated: Date.now()
  },
  {
    id: '3',
    name: 'EV Complete Service Center',
    address: '789 Pine Rd, Elsewhere, USA',
    latitude: 37.7647,
    longitude: -122.4094,
    type: 'both',
    status: 'maintenance',
    chargingPoints: {
      total: 8,
      available: 0
    },
    repairBays: {
      total: 3,
      available: 1
    },
    powerTypes: ['Level 2', 'DC Fast Charging', 'Tesla Supercharger'],
    amenities: ['Restrooms', 'Convenience Store', 'Cafe', 'Lounge'],
    price: '$0.35/kWh',
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1593941707882-a5bba13938c2?q=80&w=1472&auto=format&fit=crop'],
    lastUpdated: Date.now()
  },
  {
    id: '4',
    name: 'Downtown Charging Plaza',
    address: '101 Market St, Cityville, USA',
    latitude: 37.7947,
    longitude: -122.3994,
    type: 'charging',
    status: 'unavailable',
    chargingPoints: {
      total: 12,
      available: 0
    },
    powerTypes: ['Level 2'],
    amenities: ['Parking Garage', 'Shopping'],
    price: '$0.25/kWh',
    rating: 3.9,
    lastUpdated: Date.now()
  }
];

export function useStations(type?: 'charging' | 'repair') {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      try {
        let filteredStations = [...mockStations];
        
        if (type) {
          filteredStations = mockStations.filter(
            station => station.type === type || station.type === 'both'
          );
        }
        
        setStations(filteredStations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stations:', err);
        setError('Failed to load stations');
        toast.error('Failed to load stations');
        setLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [type]);

  return { stations, loading, error };
}

export function useStation(id: string) {
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      try {
        const foundStation = mockStations.find(s => s.id === id);
        
        if (!foundStation) {
          setError('Station not found');
          setLoading(false);
          return;
        }
        
        setStation(foundStation);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching station:', err);
        setError('Failed to load station details');
        toast.error('Failed to load station details');
        setLoading(false);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id]);

  return { station, loading, error };
}

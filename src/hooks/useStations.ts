import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, doc, getDoc, CollectionReference, Query } from 'firebase/firestore';
import { ref, onValue, off } from 'firebase/database';
import { db, realtimeDb } from '../firebase/config';
import { Station } from '../types';
import { toast } from 'sonner';

export function useStations(type?: 'charging' | 'repair') {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        
        // Get station metadata from Firestore
        const stationsRef = collection(db, 'stations');
        let stationsQuery: Query = stationsRef;
        
        if (type) {
          stationsQuery = query(
            stationsRef,
            where('type', 'in', [type, 'both'])
          );
        }
        
        const snapshot = await getDocs(stationsQuery);
        const stationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Station[];
        
        // Subscribe to real-time updates for each station
        stationsData.forEach(station => {
          const stationStatusRef = ref(realtimeDb, `stationStatus/${station.id}`);
          
          onValue(stationStatusRef, (snapshot) => {
            const statusData = snapshot.val();
            if (statusData) {
              setStations(prevStations => 
                prevStations.map(s => 
                  s.id === station.id 
                    ? { ...s, ...statusData, lastUpdated: Date.now() } 
                    : s
                )
              );
            }
          });
        });
        
        setStations(stationsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stations:', err);
        setError('Failed to load stations');
        toast.error('Failed to load stations');
        setLoading(false);
      }
    };

    fetchStations();
    
    // Cleanup subscriptions when unmounting
    return () => {
      stations.forEach(station => {
        const stationStatusRef = ref(realtimeDb, `stationStatus/${station.id}`);
        off(stationStatusRef);
      });
    };
  }, [type]);

  return { stations, loading, error };
}

export function useStation(id: string) {
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        setLoading(true);
        
        // Get station metadata from Firestore
        const stationDoc = await getDoc(doc(db, 'stations', id));
        
        if (!stationDoc.exists()) {
          setError('Station not found');
          setLoading(false);
          return;
        }
        
        const stationData = { id: stationDoc.id, ...stationDoc.data() } as Station;
        setStation(stationData);
        
        // Subscribe to real-time updates for this station
        const stationStatusRef = ref(realtimeDb, `stationStatus/${id}`);
        
        onValue(stationStatusRef, (snapshot) => {
          const statusData = snapshot.val();
          if (statusData) {
            setStation(prevStation => 
              prevStation 
                ? { ...prevStation, ...statusData, lastUpdated: Date.now() } 
                : prevStation
            );
          }
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching station:', err);
        setError('Failed to load station details');
        toast.error('Failed to load station details');
        setLoading(false);
      }
    };

    if (id) {
      fetchStation();
    }
    
    // Cleanup subscription when unmounting
    return () => {
      const stationStatusRef = ref(realtimeDb, `stationStatus/${id}`);
      off(stationStatusRef);
    };
  }, [id]);

  return { station, loading, error };
}

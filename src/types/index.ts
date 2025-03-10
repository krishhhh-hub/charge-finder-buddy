
export type StationStatus = 'available' | 'unavailable' | 'maintenance';

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'charging' | 'repair' | 'both';
  status: StationStatus;
  chargingPoints?: {
    total: number;
    available: number;
  };
  repairBays?: {
    total: number;
    available: number;
  };
  powerTypes?: string[];
  amenities?: string[];
  price?: string;
  rating?: number;
  images?: string[];
  lastUpdated: number; // timestamp
}

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BatteryCharging, Wrench, Filter, X, List, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Map from '@/components/Map';
import StationCard from '@/components/StationCard';
import { useStations } from '@/hooks/useStations';
import { Station } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const MapView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const typeParam = searchParams.get('type') as 'charging' | 'repair' | null;
  const { stations, loading, error } = useStations(typeParam || undefined);
  
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [filters, setFilters] = useState({
    type: typeParam || 'all',
    status: 'all',
  });
  
  const [showListView, setShowListView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Check for location permission when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state as 'granted' | 'denied' | 'prompt');
        
        // Listen for changes to permission state
        result.onchange = () => {
          setLocationPermission(result.state as 'granted' | 'denied' | 'prompt');
        };
      });
    }
  }, []);

  // Filter stations when stations or filters change
  useEffect(() => {
    if (loading || error) return;
    
    let filtered = [...stations];
    
    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(station => 
        station.type === filters.type || station.type === 'both'
      );
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(station => 
        station.status === filters.status
      );
    }
    
    setFilteredStations(filtered);
  }, [stations, filters, loading, error]);

  // Update URL params when filter type changes
  useEffect(() => {
    if (filters.type === 'all') {
      navigate('/map');
    } else {
      navigate(`/map?type=${filters.type}`);
    }
  }, [filters.type, navigate]);

  // Update filters when URL params change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      type: typeParam || 'all',
    }));
  }, [typeParam]);

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission('granted');
          toast.success("Location access granted", {
            description: "We can now show charging stations near you.",
          });
        },
        (error) => {
          setLocationPermission('denied');
          toast.error("Location access denied", {
            description: "Please enable location services to find charging stations near you.",
          });
        }
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      <Header />
      
      <motion.main 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 pt-16 flex flex-col"
      >
        {/* Filters */}
        <div className="bg-card border-b shadow-sm">
          <div className="container px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 text-sm font-medium py-1.5 px-3 rounded-md hover:bg-secondary transition-colors ripple"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-4 h-4" />
                Filters
              </motion.button>
              
              {/* Type filter pills (desktop) */}
              <div className="hidden md:flex items-center gap-2">
                <TypeFilterPill 
                  type="all" 
                  currentType={filters.type} 
                  onChange={(type) => setFilters({...filters, type})}
                >
                  All Stations
                </TypeFilterPill>
                <TypeFilterPill 
                  type="charging" 
                  currentType={filters.type} 
                  onChange={(type) => setFilters({...filters, type})}
                >
                  <BatteryCharging className="w-3.5 h-3.5 mr-1" />
                  Charging
                </TypeFilterPill>
                <TypeFilterPill 
                  type="repair" 
                  currentType={filters.type} 
                  onChange={(type) => setFilters({...filters, type})}
                >
                  <Wrench className="w-3.5 h-3.5 mr-1" />
                  Repair
                </TypeFilterPill>
              </div>
            </div>
            
            {/* Toggle list/map view on mobile */}
            <motion.button
              onClick={() => setShowListView(!showListView)}
              className="md:hidden flex items-center gap-1.5 text-sm font-medium py-1.5 px-3 rounded-md hover:bg-secondary transition-colors ripple"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showListView ? (
                <>
                  <MapPin className="w-4 h-4" />
                  Map
                </>
              ) : (
                <>
                  <List className="w-4 h-4" />
                  List
                </>
              )}
            </motion.button>
          </div>
          
          {/* Expanded filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="container px-4 sm:px-6 py-4 border-t bg-secondary/30 overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Type</h3>
                    <div className="flex flex-wrap gap-2">
                      <TypeFilterPill 
                        type="all" 
                        currentType={filters.type} 
                        onChange={(type) => setFilters({...filters, type})}
                      >
                        All
                      </TypeFilterPill>
                      <TypeFilterPill 
                        type="charging" 
                        currentType={filters.type} 
                        onChange={(type) => setFilters({...filters, type})}
                      >
                        <BatteryCharging className="w-3.5 h-3.5 mr-1" />
                        Charging
                      </TypeFilterPill>
                      <TypeFilterPill 
                        type="repair" 
                        currentType={filters.type} 
                        onChange={(type) => setFilters({...filters, type})}
                      >
                        <Wrench className="w-3.5 h-3.5 mr-1" />
                        Repair
                      </TypeFilterPill>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Status</h3>
                    <div className="flex flex-wrap gap-2">
                      <StatusFilterPill 
                        status="all" 
                        currentStatus={filters.status} 
                        onChange={(status) => setFilters({...filters, status})}
                      >
                        All
                      </StatusFilterPill>
                      <StatusFilterPill 
                        status="available" 
                        currentStatus={filters.status} 
                        onChange={(status) => setFilters({...filters, status})}
                      >
                        Available
                      </StatusFilterPill>
                      <StatusFilterPill 
                        status="unavailable" 
                        currentStatus={filters.status} 
                        onChange={(status) => setFilters({...filters, status})}
                      >
                        Unavailable
                      </StatusFilterPill>
                      <StatusFilterPill 
                        status="maintenance" 
                        currentStatus={filters.status} 
                        onChange={(status) => setFilters({...filters, status})}
                      >
                        Maintenance
                      </StatusFilterPill>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => setShowFilters(false)}
                    className="ml-auto bg-card rounded-md p-1.5 hover:bg-secondary/50 transition-colors"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Location Permission Alert */}
        {locationPermission !== 'granted' && (
          <div className="container px-4 sm:px-6 py-3">
            <Alert className="bg-background/90 backdrop-blur-sm border-primary/20">
              <MapPin className="h-5 w-5 text-primary" />
              <AlertTitle>Enable Location Services</AlertTitle>
              <AlertDescription className="mt-2">
                Turn on location services to find charging stations near you.
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2 bg-primary/10 hover:bg-primary/20"
                  onClick={requestLocationPermission}
                >
                  Enable
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Main content */}
        <div className="flex-1 flex md:flex-row flex-col">
          {/* Map View (hidden on mobile when list is shown) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "w-full h-[50vh] md:h-auto md:flex-1",
              showListView && "hidden md:block"
            )}
          >
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Loading stations...</p>
                </div>
              </div>
            ) : error ? (
              <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                <div className="text-center max-w-md mx-auto px-4">
                  <p className="text-destructive font-medium mb-2">Error loading stations</p>
                  <p className="text-muted-foreground text-sm">Please try again later</p>
                </div>
              </div>
            ) : (
              <Map stations={filteredStations} />
            )}
          </motion.div>
          
          {/* Station List (hidden on mobile when map is shown) */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "md:w-96 md:border-l md:overflow-auto",
              !showListView && "hidden md:block"
            )}
          >
            <div className="p-4">
              <h2 className="text-lg font-medium mb-4">
                {filteredStations.length} Station{filteredStations.length !== 1 ? 's' : ''}
              </h2>
              
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="h-48 rounded-lg bg-secondary/50 animate-pulse mb-4"
                  ></motion.div>
                ))
              ) : filteredStations.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <MapPin className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-medium">No stations found</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Try changing your filters
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {filteredStations.map((station, index) => (
                    <motion.div
                      key={station.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <StationCard 
                        key={station.id} 
                        station={station} 
                        className="h-auto"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.main>
    </motion.div>
  );
};

interface TypeFilterPillProps {
  type: 'all' | 'charging' | 'repair';
  currentType: string;
  onChange: (type: 'all' | 'charging' | 'repair') => void;
  children: React.ReactNode;
}

const TypeFilterPill = ({ type, currentType, onChange, children }: TypeFilterPillProps) => (
  <motion.button
    onClick={() => onChange(type)}
    className={cn(
      "inline-flex items-center px-3 py-1.5 rounded-full text-sm transition-colors ripple",
      type === currentType 
        ? "bg-primary text-white" 
        : "bg-card border hover:bg-secondary/50"
    )}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);

interface StatusFilterPillProps {
  status: 'all' | 'available' | 'unavailable' | 'maintenance';
  currentStatus: string;
  onChange: (status: 'all' | 'available' | 'unavailable' | 'maintenance') => void;
  children: React.ReactNode;
}

const StatusFilterPill = ({ status, currentStatus, onChange, children }: StatusFilterPillProps) => (
  <motion.button
    onClick={() => onChange(status)}
    className={cn(
      "inline-flex items-center px-3 py-1.5 rounded-full text-sm transition-colors ripple",
      status === currentStatus 
        ? status === 'available' 
          ? "bg-station-available text-white" 
          : status === 'unavailable' 
            ? "bg-station-unavailable text-white" 
            : status === 'maintenance' 
              ? "bg-station-maintenance text-white" 
              : "bg-primary text-white"
        : "bg-card border hover:bg-secondary/50"
    )}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);

export default MapView;


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BatteryCharging, Navigation, ChevronRight, Search, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Map from '@/components/Map';
import { useStations } from '@/hooks/useStations';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const { toast } = useToast();
  const { stations } = useStations();
  
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
  
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission('granted');
          toast({
            title: "Location access granted",
            description: "We can now show charging stations near you.",
          });
        },
        (error) => {
          setLocationPermission('denied');
          toast({
            title: "Location access denied",
            description: "Please enable location services to find charging stations near you.",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Animation and Glow Effects */}
        <section className="relative h-[90vh] flex items-center overflow-hidden cyber-grid">
          <div className="absolute inset-0 z-0">
            <div className="h-full w-full bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-black/60"></div>
            <div className="absolute inset-0 line-effect opacity-20"></div>
            <div className="absolute inset-0 video-static"></div>
          </div>
          
          {/* Energy flow animation elements */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 energy-flow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-primary/5 energy-flow" style={{animationDelay: '1s'}}></div>
          
          {/* Floating elements */}
          <motion.div 
            className="absolute top-1/3 right-1/4 w-16 h-16 floating glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <BatteryCharging className="h-full w-full text-primary/70" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-1/3 left-1/3 w-12 h-12 floating glow"
            style={{animationDelay: '1.5s'}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 2, delay: 1 }}
          >
            <Navigation className="h-full w-full text-primary/70" />
          </motion.div>
          
          {/* Map in background with reduced opacity */}
          <div className="absolute inset-0 z-[-1] opacity-30">
            <Map stations={stations} />
          </div>
           
          {locationPermission !== 'granted' && (
            <div className="absolute top-4 right-4 z-20 max-w-md">
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
          
          <div className="relative z-10 container mx-auto px-4">
            <motion.div 
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4 text-white drop-shadow-lg electric-pulse">
                Future of EV <span className="text-primary">Charging</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-lg">
                Discover the network of charging stations powering your journey forward.
              </p>
              
              <div className="mt-8">
                <Link to="/map">
                  <Button variant="outline" size="lg" className="bg-background/80 backdrop-blur-sm gap-2 electric-pulse">
                    Find Stations <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background z-[1]" />
        </section>
        
        {/* Features Section */}
        <section className="py-20 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Use ChargeMate?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BatteryCharging className="h-10 w-10 text-primary" />}
              title="Find Charging Stations"
              description="Quickly locate EV charging stations near you with real-time availability."
            />
            
            <FeatureCard 
              icon={<Navigation className="h-10 w-10 text-primary" />}
              title="Easy Navigation"
              description="Get directions to the nearest charging station with just one tap."
            />
            
            <FeatureCard 
              icon={<Search className="h-10 w-10 text-primary" />}
              title="Smart Search"
              description="Filter by charging type, price, and amenities to find your ideal spot."
            />
          </div>
        </section>
      </main>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <motion.div 
    className="bg-muted/50 p-8 rounded-xl border border-border"
    whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.2)' }}
    transition={{ duration: 0.2 }}
  >
    <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

export default Index;

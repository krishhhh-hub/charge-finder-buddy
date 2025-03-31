import { useNavigate } from 'react-router-dom';
import { BatteryCharging, Wrench, MapPin, ZapOff, Map, Shield } from 'lucide-react';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';
import { useStations } from '@/hooks/useStations';
import StationCard from '@/components/StationCard';
import { useState, useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { stations, loading } = useStations();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Get 3 random stations to display on the homepage
  const featuredStations = stations
    .filter(station => station.status === 'available')
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="min-h-screen animated-gradient">
      <Header />
      
      <main className="container px-4 sm:px-6 pt-24 pb-16">
        {/* Hero Section */}
        <section className={cn(
          "pt-16 pb-20 transition-opacity duration-1000 ease-out",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          <div className="max-w-3xl mx-auto text-center animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <BatteryCharging className="w-4 h-4 mr-1.5" />
              Real-time Availability
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Find EV Charging &<br />Repair Stations
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground">
              Locate available charging points and repair services for your electric vehicle in real-time.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/map?type=charging')}
                className="inline-flex items-center justify-center px-5 py-3 bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 transition-all duration-200 font-medium"
              >
                <BatteryCharging className="w-5 h-5 mr-2" />
                Find Charging Stations
              </button>
              <button 
                onClick={() => navigate('/map?type=repair')}
                className="inline-flex items-center justify-center px-5 py-3 bg-white text-foreground rounded-lg shadow-sm border hover:bg-secondary/30 transition-all duration-200 font-medium"
              >
                <Wrench className="w-5 h-5 mr-2" />
                Find Repair Stations
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white rounded-2xl shadow-sm mb-16 animate-scale-in" style={{ animationDelay: '400ms' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Why Use EV Finder</h2>
              <p className="mt-4 text-muted-foreground">Features designed to make your EV journey smoother</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <FeatureCard 
                icon={<BatteryCharging className="w-6 h-6 text-primary" />}
                title="Real-Time Availability"
                description="Get up-to-date information on charging station availability directly from IoT sensors."
              />
              <FeatureCard 
                icon={<MapPin className="w-6 h-6 text-primary" />}
                title="Nearby Stations"
                description="Find the closest charging and repair stations to your current location."
              />
              <FeatureCard 
                icon={<ZapOff className="w-6 h-6 text-primary" />}
                title="Breakdown Assistance"
                description="Quickly locate the nearest repair station in case of vehicle issues."
              />
            </div>
          </div>
        </section>

        {/* Available Stations Section */}
        <section className="py-12 animate-fade-up" style={{ animationDelay: '600ms' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Available Stations</h2>
              <button 
                onClick={() => navigate('/map')}
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-[320px] rounded-xl bg-white/60 animate-pulse"></div>
                ))
              ) : featuredStations.length > 0 ? (
                featuredStations.map((station) => (
                  <StationCard key={station.id} station={station} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <Map className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No stations available</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    There are currently no available stations. Check back later or view all stations on the map.
                  </p>
                  <button 
                    onClick={() => navigate('/map')}
                    className="mt-6 px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    View All Stations
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Safety First Section */}
        <section className="py-16 px-4 sm:px-6 rounded-2xl bg-primary/5 mb-16 animate-fade-up" style={{ animationDelay: '800ms' }}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Safety & Reliability First</h2>
            <p className="mt-4 text-muted-foreground">
              Our platform ensures that you have access to accurate, real-time data about charging and repair stations. 
              We directly connect to IoT sensors at stations to provide the most up-to-date availability information.
            </p>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-primary rounded-full p-2 mr-2">
                <BatteryCharging className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">CHARGEMATE</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CHARGEMATE. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-secondary/30 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]">
    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white shadow-sm mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;

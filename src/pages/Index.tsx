
import { useNavigate } from 'react-router-dom';
import { BatteryCharging, Wrench, MapPin, ZapOff, Map, Shield } from 'lucide-react';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';
import { useStations } from '@/hooks/useStations';
import StationCard from '@/components/StationCard';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

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
    <motion.div 
      className="min-h-screen animated-gradient"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />
      
      <main className="container px-4 sm:px-6 pt-24 pb-16">
        {/* Hero Section */}
        <motion.section 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className={cn(
            "pt-16 pb-20 transition-opacity duration-1000 ease-out",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              <BatteryCharging className="w-4 h-4 mr-1.5" />
              Real-time Availability
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            >
              Find EV Charging &<br />Repair Stations
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground"
            >
              Locate available charging points and repair services for your electric vehicle in real-time.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button 
                onClick={() => navigate('/map?type=charging')}
                className="inline-flex items-center justify-center px-5 py-3 bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 transition-all duration-200 font-medium btn-click-effect ripple"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <BatteryCharging className="w-5 h-5 mr-2" />
                Find Charging Stations
              </motion.button>
              <motion.button 
                onClick={() => navigate('/map?type=repair')}
                className="inline-flex items-center justify-center px-5 py-3 bg-card text-foreground rounded-lg shadow-sm border hover:bg-secondary/30 transition-all duration-200 font-medium btn-click-effect ripple"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Wrench className="w-5 h-5 mr-2" />
                Find Repair Stations
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="py-16 bg-card rounded-2xl shadow-sm mb-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Why Use CHARGEMATE</h2>
              <p className="mt-4 text-muted-foreground">Features designed to make your EV journey smoother</p>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
            >
              <FeatureCard 
                icon={<BatteryCharging className="w-6 h-6 text-primary" />}
                title="Real-Time Availability"
                description="Get up-to-date information on charging station availability directly from IoT sensors."
                delay={0.1}
              />
              <FeatureCard 
                icon={<MapPin className="w-6 h-6 text-primary" />}
                title="Nearby Stations"
                description="Find the closest charging and repair stations to your current location."
                delay={0.2}
              />
              <FeatureCard 
                icon={<ZapOff className="w-6 h-6 text-primary" />}
                title="Breakdown Assistance"
                description="Quickly locate the nearest repair station in case of vehicle issues."
                delay={0.3}
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Available Stations Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="py-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Available Stations</h2>
              <motion.button 
                onClick={() => navigate('/map')}
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="h-[320px] rounded-xl bg-card/60 animate-pulse"
                    variants={fadeIn}
                  ></motion.div>
                ))
              ) : featuredStations.length > 0 ? (
                featuredStations.map((station, index) => (
                  <motion.div
                    key={station.id}
                    variants={fadeIn}
                    custom={index}
                    transition={{ delay: 0.1 * index }}
                  >
                    <StationCard station={station} />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  variants={fadeIn}
                  className="col-span-full flex flex-col items-center justify-center py-16 text-center"
                >
                  <Map className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No stations available</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    There are currently no available stations. Check back later or view all stations on the map.
                  </p>
                  <motion.button 
                    onClick={() => navigate('/map')}
                    className="mt-6 px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors ripple"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View All Stations
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Safety First Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="py-16 px-4 sm:px-6 rounded-2xl bg-primary/5 mb-16"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.1, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
            >
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl font-bold">Safety & Reliability First</h2>
            <p className="mt-4 text-muted-foreground">
              Our platform ensures that you have access to accurate, real-time data about charging and repair stations. 
              We directly connect to IoT sensors at stations to provide the most up-to-date availability information.
            </p>
          </div>
        </motion.section>
      </main>
      
      {/* Footer */}
      <footer className="bg-card border-t py-8">
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
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => (
  <motion.div 
    variants={fadeIn}
    transition={{ delay }}
    className="bg-secondary/30 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]"
    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
  >
    <motion.div 
      className="w-12 h-12 flex items-center justify-center rounded-lg bg-card shadow-sm mb-4"
      whileHover={{ rotate: 5 }}
    >
      {icon}
    </motion.div>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

export default Index;

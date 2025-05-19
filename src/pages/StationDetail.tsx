
import { useParams } from 'react-router-dom';
import { useStation } from '@/hooks/useStations';
import Header from '@/components/Header';
import StationDetailComponent from '@/components/StationDetail';
import Map from '@/components/Map';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const StationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { station, loading, error } = useStation(id || '');

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
        className="flex-1 pt-16 pb-12"
      >
        <div className="container px-4 sm:px-6 py-8">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-secondary rounded mb-8"></div>
              <div className="h-64 w-full bg-secondary/50 rounded-xl mb-6"></div>
              <div className="h-12 w-64 bg-secondary rounded-lg mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64 w-full bg-secondary/50 rounded-lg"></div>
                <div className="h-64 w-full bg-secondary/50 rounded-lg"></div>
              </div>
            </div>
          ) : error ? (
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="bg-card rounded-lg shadow-sm p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-destructive mb-4">Station not found</h2>
              <p className="text-muted-foreground">
                Sorry, we couldn't find the station you're looking for.
              </p>
            </motion.div>
          ) : station ? (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <motion.div 
                variants={fadeInUp}
                className="lg:col-span-2"
              >
                <StationDetailComponent station={station} />
              </motion.div>
              <motion.div 
                variants={fadeInUp}
                className="lg:col-span-1 h-[500px] lg:h-auto"
              >
                <div className="sticky top-24 h-[500px]">
                  {/* Pass center with longitude and latitude in correct order for Google Maps */}
                  <Map 
                    stations={[station]} 
                    center={[station.longitude, station.latitude]} 
                    zoom={14} 
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </motion.main>
    </motion.div>
  );
};

export default StationDetail;

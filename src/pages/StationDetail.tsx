
import { useParams } from 'react-router-dom';
import { useStation } from '@/hooks/useStations';
import Header from '@/components/Header';
import StationDetailComponent from '@/components/StationDetail';
import GoogleMap from '@/components/GoogleMap';

const StationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { station, loading, error } = useStation(id || '');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 pb-12">
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
            <div className="bg-card rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Station not found</h2>
              <p className="text-muted-foreground">
                Sorry, we couldn't find the station you're looking for.
              </p>
            </div>
          ) : station ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <StationDetailComponent station={station} />
              </div>
              <div className="lg:col-span-1 h-[500px] lg:h-auto">
                <div className="sticky top-24 h-[500px]">
                  <GoogleMap 
                    stations={[station]} 
                    center={[station.longitude, station.latitude]} 
                    zoom={14} 
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default StationDetail;

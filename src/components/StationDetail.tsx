
import { useEffect, useState } from 'react';
import { Station } from '@/types';
import { cn } from '@/lib/utils';
import { 
  BatteryCharging,
  Wrench,
  Star,
  Clock,
  ChevronLeft,
  MapPin,
  Zap,
  Coffee,
  Car,
  DollarSign,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface StationDetailProps {
  station: Station;
}

const StationDetail = ({ station }: StationDetailProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const {
    name,
    address,
    type,
    status,
    chargingPoints,
    repairBays,
    powerTypes,
    amenities,
    price,
    rating,
    lastUpdated,
    images = []
  } = station;

  useEffect(() => {
    // Reset active image when station changes
    setActiveImage(0);
  }, [station.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `EV Finder - ${name}`,
        text: `Check out ${name} on EV Finder!`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <Link 
          to="/map" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Map
        </Link>
        <button 
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="relative h-64 sm:h-80 overflow-hidden">
          {/* Status indicator */}
          <div className={cn(
            'absolute top-4 right-4 z-10 px-4 py-1.5 rounded-full text-white',
            'flex items-center gap-2 shadow-sm',
            status === 'available' ? 'bg-station-available' :
            status === 'maintenance' ? 'bg-station-maintenance' :
            'bg-station-unavailable'
          )}>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse-slow"></span>
            <span className="font-medium">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          {/* Type indicator */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm flex items-center gap-1.5">
            {type === 'charging' && (
              <>
                <BatteryCharging className="w-4 h-4" />
                <span>Charging</span>
              </>
            )}
            {type === 'repair' && (
              <>
                <Wrench className="w-4 h-4" />
                <span>Repair</span>
              </>
            )}
            {type === 'both' && (
              <>
                <BatteryCharging className="w-4 h-4" />
                <Wrench className="w-4 h-4 ml-1" />
                <span>Charging & Repair</span>
              </>
            )}
          </div>

          {/* Station image */}
          {images.length > 0 ? (
            <img
              src={images[activeImage]}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              {type === 'charging' ? (
                <BatteryCharging className="w-16 h-16 text-muted-foreground/30" />
              ) : type === 'repair' ? (
                <Wrench className="w-16 h-16 text-muted-foreground/30" />
              ) : (
                <div className="flex gap-4">
                  <BatteryCharging className="w-12 h-12 text-muted-foreground/30" />
                  <Wrench className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
            </div>
          )}
          
          {/* Image navigation dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all',
                    activeImage === index 
                      ? 'bg-white scale-110' 
                      : 'bg-white/50 hover:bg-white/70'
                  )}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{name}</h1>
              <div className="flex items-center mt-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <p className="text-sm">{address}</p>
              </div>
            </div>
            
            {rating && (
              <div className="flex items-center bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-md">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1.5" />
                <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Availability section */}
            <div className="bg-secondary/40 rounded-lg p-5">
              <h2 className="text-lg font-medium mb-4">Availability</h2>
              
              <div className="space-y-4">
                {chargingPoints && (
                  <div className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BatteryCharging className="w-5 h-5 mr-2 text-primary" />
                        <h3 className="font-medium">Charging Points</h3>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-lg">{chargingPoints.available}</span>
                        <span className="text-muted-foreground ml-1">/ {chargingPoints.total}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          chargingPoints.available === 0 
                            ? "bg-red-500" 
                            : chargingPoints.available < chargingPoints.total / 3 
                              ? "bg-orange-500" 
                              : "bg-green-500"
                        )}
                        style={{ width: `${(chargingPoints.available / chargingPoints.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {repairBays && (
                  <div className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Wrench className="w-5 h-5 mr-2 text-primary" />
                        <h3 className="font-medium">Repair Bays</h3>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-lg">{repairBays.available}</span>
                        <span className="text-muted-foreground ml-1">/ {repairBays.total}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          repairBays.available === 0 
                            ? "bg-red-500" 
                            : repairBays.available < repairBays.total / 3 
                              ? "bg-orange-500" 
                              : "bg-green-500"
                        )}
                        style={{ width: `${(repairBays.available / repairBays.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Details section */}
            <div className="space-y-6">
              {powerTypes && powerTypes.length > 0 && (
                <div>
                  <div className="flex items-center mb-3">
                    <Zap className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="font-medium">Charging Types</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {powerTypes.map((type, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 bg-secondary/70 rounded-md text-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {amenities && amenities.length > 0 && (
                <div>
                  <div className="flex items-center mb-3">
                    <Coffee className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="font-medium">Amenities</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 bg-secondary/70 rounded-md text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {price && (
                <div>
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="font-medium">Pricing</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{price}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8">
            <a 
              href={`https://maps.google.com/?q=${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-primary text-white text-center py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDetail;

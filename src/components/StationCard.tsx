
import { Station } from '@/types';
import { cn } from '@/lib/utils';
import { BatteryCharging, Wrench, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface StationCardProps {
  station: Station;
  className?: string;
}

const StationCard = ({ station, className }: StationCardProps) => {
  const {
    id,
    name,
    address,
    type,
    status,
    chargingPoints,
    repairBays,
    rating,
    lastUpdated
  } = station;

  return (
    <Link
      to={`/station/${id}`}
      className={cn(
        'group block rounded-xl overflow-hidden bg-white border border-border/50 shadow-sm hover:shadow-md transition-all duration-300',
        'transform hover:-translate-y-1',
        className
      )}
    >
      <div className="relative overflow-hidden w-full h-40">
        <div className={cn(
          'absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-white text-xs font-medium',
          'flex items-center gap-1.5 shadow-sm',
          status === 'available' ? 'bg-station-available' :
          status === 'maintenance' ? 'bg-station-maintenance' :
          'bg-station-unavailable'
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-slow"></span>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
        
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-[1]"
          aria-hidden="true"
        />

        {station.images && station.images[0] ? (
          <img
            src={station.images[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            {type === 'charging' ? (
              <BatteryCharging className="w-10 h-10 text-muted-foreground/50" />
            ) : type === 'repair' ? (
              <Wrench className="w-10 h-10 text-muted-foreground/50" />
            ) : (
              <div className="flex gap-2">
                <BatteryCharging className="w-8 h-8 text-muted-foreground/50" />
                <Wrench className="w-8 h-8 text-muted-foreground/50" />
              </div>
            )}
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 z-10">
          <div className="flex items-center gap-1.5 text-white text-sm">
            {type === 'charging' && (
              <BatteryCharging className="w-4 h-4" />
            )}
            {type === 'repair' && (
              <Wrench className="w-4 h-4" />
            )}
            {type === 'both' && (
              <>
                <BatteryCharging className="w-4 h-4" />
                <span>+</span>
                <Wrench className="w-4 h-4" />
              </>
            )}
            <span className="text-xs font-medium capitalize">
              {type === 'both' ? 'Charging & Repair' : `${type}`}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{address}</p>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          {chargingPoints && (
            <div className="rounded-md bg-secondary/50 p-2 text-center">
              <p className="text-sm font-medium">
                {chargingPoints.available}/{chargingPoints.total}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Chargers Available
              </p>
            </div>
          )}
          
          {repairBays && (
            <div className="rounded-md bg-secondary/50 p-2 text-center">
              <p className="text-sm font-medium">
                {repairBays.available}/{repairBays.total}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Repair Bays Available
              </p>
            </div>
          )}
          
          {rating && (
            <div className="rounded-md bg-secondary/50 p-2 text-center flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <p className="text-sm font-medium">{rating.toFixed(1)}</p>
            </div>
          )}
          
          <div className="rounded-md bg-secondary/50 p-2 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StationCard;

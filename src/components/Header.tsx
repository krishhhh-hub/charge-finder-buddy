import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BatteryCharging, Wrench, Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when changing routes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-40 px-6 py-4 transition-all duration-300 ease-in-out',
      isScrolled ? 'glass-effect shadow-sm' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <div className="bg-primary rounded-full p-2 shadow-md">
            <BatteryCharging className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">CHARGEMATE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" isActive={location.pathname === '/'}>
            Home
          </NavLink>
          <NavLink to="/map" isActive={location.pathname === '/map'}>
            Find Stations
          </NavLink>
          <NavLink to="/map?type=charging" isActive={location.search === '?type=charging'}>
            <BatteryCharging className="w-4 h-4 mr-1" />
            Charging
          </NavLink>
          <NavLink to="/map?type=repair" isActive={location.search === '?type=repair'}>
            <Wrench className="w-4 h-4 mr-1" />
            Repair
          </NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center text-gray-700 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 top-[72px] z-30 glass-effect transform transition-all duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
      )}>
        <nav className="flex flex-col items-center gap-6 pt-10">
          <MobileNavLink to="/" isActive={location.pathname === '/'}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/map" isActive={location.pathname === '/map' && !location.search}>
            Find Stations
          </MobileNavLink>
          <MobileNavLink to="/map?type=charging" isActive={location.search === '?type=charging'}>
            <BatteryCharging className="w-5 h-5 mr-2" />
            Charging Stations
          </MobileNavLink>
          <MobileNavLink to="/map?type=repair" isActive={location.search === '?type=repair'}>
            <Wrench className="w-5 h-5 mr-2" />
            Repair Stations
          </MobileNavLink>
        </nav>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center text-sm font-medium transition-all duration-200",
      "hover:text-primary relative py-2",
      isActive ? "text-primary" : "text-foreground/90"
    )}
  >
    {children}
    <span
      className={cn(
        "absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform duration-200",
        isActive && "scale-x-100"
      )}
    />
  </Link>
);

const MobileNavLink = ({ to, isActive, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center py-3 px-6 text-lg font-medium w-full transition-all duration-200 justify-center",
      isActive 
        ? "text-primary bg-primary/10 rounded-md" 
        : "text-foreground/80 hover:bg-primary/5 hover:text-primary rounded-md"
    )}
  >
    {children}
  </Link>
);

export default Header;

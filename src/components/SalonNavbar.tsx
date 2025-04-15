
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SalonifyLogo from './SalonifyLogo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, User, UserCircle, Scissors } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const SalonNavbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('salonifyUser');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    
    // Check if staff exists
    const staffData = localStorage.getItem('salonifyStaff');
    setIsStaff(!!staffData);
  }, []);

  const isLinkActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/locations', label: 'Locations' },
    { path: '/recommendations', label: 'Smart Style' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('salonifyUser');
    setIsLoggedIn(false);
    setUser(null);
    // Redirect to home page if on dashboard or profile
    if (location.pathname === '/dashboard' || location.pathname === '/profile') {
      window.location.href = '/';
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="salon-container">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <SalonifyLogo className="w-8 h-8" />
            <span className="text-xl font-bold">Salonify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors hover:text-salon ${
                  isLinkActive(link.path)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-2">
              {isLoggedIn ? (
                <>
                  {isStaff && (
                    <Link to="/staff-panel">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Scissors size={16} />
                        Staff Panel
                      </Button>
                    </Link>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profileImage || ''} alt={user?.name || ''} />
                          <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-600"
                        onClick={handleLogout}
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="bg-salon hover:bg-salon-dark">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                    <SalonifyLogo className="w-6 h-6" />
                    <span className="text-lg font-bold">Salonify</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`py-2 transition-colors hover:text-salon ${
                        isLinkActive(link.path)
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex flex-col space-y-3 mt-auto mb-8">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center space-x-2 py-4 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profileImage || ''} alt={user?.name || ''} />
                          <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user?.name || 'User'}</div>
                          <div className="text-xs text-muted-foreground">{user?.email || ''}</div>
                        </div>
                      </div>
                      
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-1">
                          <User size={16} />
                          Profile
                        </Button>
                      </Link>
                      
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-1">
                          <UserCircle size={16} />
                          Dashboard
                        </Button>
                      </Link>
                      
                      {isStaff && (
                        <Link to="/staff-panel" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="w-full flex items-center justify-center gap-1">
                            <Scissors size={16} />
                            Staff Panel
                          </Button>
                        </Link>
                      )}
                      
                      <Button 
                        className="w-full bg-salon hover:bg-salon-dark"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full bg-salon hover:bg-salon-dark">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default SalonNavbar;

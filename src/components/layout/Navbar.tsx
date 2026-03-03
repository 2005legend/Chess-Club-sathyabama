
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Puzzle Corner', href: '/puzzle' },
    { name: 'Practice Bot', href: '/practice' },
    { name: 'Game of the Week', href: '/game-of-week' },
    { name: 'Tutorials', href: '/tutorials' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-chess-black/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.img
              src="/lovable-uploads/1d891cfb-fe62-4313-9f03-b4783d0207ca.png"
              alt="Sathyabama Chess Club"
              className="h-12 w-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="font-serif text-lg sm:text-xl font-bold text-chess-black dark:text-white hidden sm:block"
            >
              Sathyabama Chess Club
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${location.pathname === item.href
                  ? 'text-chess-accent'
                  : 'text-chess-black/80 dark:text-white/80 hover:text-chess-accent dark:hover:text-chess-accent'
                  }`}
              >
                {item.name}
                {location.pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-chess-accent"
                    layoutId="navbar-underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="ml-4 flex items-center gap-1">
                  Join Club <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a
                    href="https://chat.whatsapp.com/JKQYySbdVV23oDsficIU64"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare size={16} className="text-green-600" />
                    Join WhatsApp Group
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href="mailto:chessclub.sathyabama@gmail.com"
                    className="flex items-center gap-2"
                  >
                    <Mail size={16} className="text-chess-accent" />
                    Contact via Email
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-chess-black dark:text-white inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <motion.div
        className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-chess-black shadow-lg">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.href
                ? 'text-chess-accent bg-chess-light/50 dark:bg-chess-dark/50'
                : 'text-chess-black dark:text-white hover:bg-chess-light/30 dark:hover:bg-chess-dark/30'
                }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-2 px-3 space-y-2">
            <a
              href="https://chat.whatsapp.com/JKQYySbdVV23oDsficIU64"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full"
            >
              <Button variant="default" className="w-full flex items-center justify-center gap-2">
                <MessageSquare size={16} className="text-green-600" />
                Join WhatsApp Group
              </Button>
            </a>
            <a
              href="mailto:chessclub.sathyabama@gmail.com"
              className="flex items-center gap-2 w-full"
            >
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Mail size={16} className="text-chess-accent" />
                Contact via Email
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;

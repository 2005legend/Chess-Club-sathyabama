import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format, parseISO, isFuture } from 'date-fns';

interface Event {
  id: number;
  title: string;
  date: string;
  image: string;
  description: string;
  upcoming?: boolean;
}

// Keep placeholder events data for carousel display
const allEvents: Event[] = [
  {
    id: 1,
    title: "Annual Chess Championship",
    date: "2024-12-15", // Future date
    image: "https://images.unsplash.com/photo-1567710735227-8d2951c9db41?q=80&w=2070&auto=format&fit=crop",
    description: "Our flagship tournament bringing together the best players from all departments"
  },
  {
    id: 2,
    title: "Blitz Tournament",
    date: "2024-11-10", // Future date
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop",
    description: "Test your skills in this fast-paced competition where every second counts"
  },
  {
    id: 3,
    title: "Fresher's Chess Welcome",
    date: "2023-07-05", // Past date
    image: "https://images.unsplash.com/photo-1619167801419-bfeca661a580?q=80&w=2070&auto=format&fit=crop",
    description: "Special event to welcome new members and introduce them to our community"
  },
  {
    id: 4,
    title: "Chess Workshop",
    date: "2024-10-20", // Future date
    image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2071&auto=format&fit=crop",
    description: "Learn advanced strategies and techniques from chess masters"
  }
];

// Filter to show only upcoming events
const events: Event[] = allEvents.filter(event => isFuture(parseISO(event.date)));

// If no upcoming events, use all events as fallback
const displayEvents: Event[] = events.length > 0 ? events : allEvents;

const EventCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayEvents.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + displayEvents.length) % displayEvents.length);
  };

  useEffect(() => {
    if (!isPaused) {
      const timer = setTimeout(() => {
        nextSlide();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isPaused]);

  return (
    <div className="relative w-full overflow-hidden h-[500px] md:h-[600px]" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 }
          }}
          className="absolute inset-0"
        >
          <div 
            className="relative h-full w-full flex items-end"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url(${displayEvents[currentIndex].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-chess-black via-chess-black/60 to-transparent"></div>
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="max-w-3xl">
                <span className="inline-block px-3 py-1 rounded-full bg-chess-accent/20 text-chess-accent text-sm font-medium mb-4">
                  {format(parseISO(displayEvents[currentIndex].date), 'MMM d, yyyy')}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
                  {displayEvents[currentIndex].title}
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  {displayEvents[currentIndex].description}
                </p>
                <div className="flex gap-4">
                  <Link to="/events">
                    <Button variant="default" className="bg-white text-chess-black hover:bg-white/90">
                      View Details
                    </Button>
                  </Link>
                  <Link to="/events">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      All Events
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {displayEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-chess-accent w-6' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default EventCarousel;

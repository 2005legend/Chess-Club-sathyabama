
import { CalendarClock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  location: string;
  participants: number;
  image: string;
  upcoming?: boolean;
}

const EventCard = ({ id, title, date, location, participants, image, upcoming = false }: EventCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl bg-white dark:bg-chess-dark shadow-md hover:shadow-xl transition-all duration-300 h-full"
    >
      <div className="relative">
        {/* Event image */}
        <img 
          src={image} 
          alt={title} 
          className="w-full h-52 object-cover"
        />
        
        {/* Upcoming badge */}
        {upcoming && (
          <div className="absolute top-4 right-4 bg-chess-accent text-white text-xs font-bold px-3 py-1 rounded-full">
            Upcoming
          </div>
        )}
        
        {/* Date badge */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center text-white gap-2">
            <CalendarClock size={16} className="text-chess-accent" />
            <span className="text-sm font-medium">{date}</span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-serif text-xl font-bold mb-3 line-clamp-2">{title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-chess-accent shrink-0 mt-1" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-chess-accent" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{participants} Participants</span>
          </div>
        </div>
        
        <Link 
          to={`/events/${id}`} 
          className="inline-flex items-center font-medium text-chess-accent hover:underline"
        >
          View Details
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;

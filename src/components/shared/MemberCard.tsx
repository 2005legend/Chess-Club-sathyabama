
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MemberCardProps {
  name: string;
  role?: string;
  rating?: number;
  year?: string;
  image: string;
  favoriteOpening?: string;
  accolades?: string[];
}

const MemberCard = ({ 
  name, 
  role, 
  rating, 
  year, 
  image, 
  favoriteOpening, 
  accolades = [] 
}: MemberCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Generate initials for avatar fallback
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  return (
    <motion.div 
      layout
      className="rounded-xl overflow-hidden bg-white dark:bg-chess-dark shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-chess-accent">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-chess-accent text-white text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-serif text-xl font-bold">{name}</h3>
            {role && <p className="text-gray-600 dark:text-gray-400 text-sm">{role}</p>}
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {rating && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
              <span className="font-medium">{rating}</span>
            </div>
          )}
          
          {year && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Year</span>
              <span className="font-medium">{year}</span>
            </div>
          )}
          
          {favoriteOpening && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Favorite Opening</span>
              <span className="font-medium text-right max-w-[180px]">{favoriteOpening}</span>
            </div>
          )}
        </div>
        
        {accolades.length > 0 && (
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-sm font-medium text-chess-accent py-2 hover:underline"
            >
              <span>Accolades</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2 mt-2 text-sm">
                    {accolades.map((accolade, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Award size={16} className="text-chess-accent shrink-0 mt-1" />
                        <span className="text-gray-600 dark:text-gray-400">{accolade}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MemberCard;

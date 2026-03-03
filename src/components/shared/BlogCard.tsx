
import { CalendarDays, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorImage: string;
  image: string;
  category?: string;
}

const BlogCard = ({ 
  id, 
  title, 
  excerpt, 
  date, 
  author, 
  authorImage, 
  image, 
  category 
}: BlogCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl bg-white dark:bg-chess-dark shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col"
    >
      {/* Blog image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        
        {/* Category tag */}
        {category && (
          <div className="absolute top-4 left-4 bg-chess-accent/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
            {category}
          </div>
        )}
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-serif text-xl font-bold mb-3 line-clamp-2 hover:text-chess-accent transition-colors">
          <Link to={`/blog/${id}`}>{title}</Link>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <img 
              src={authorImage} 
              alt={author} 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{author}</span>
          </div>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <CalendarDays size={14} className="mr-1" />
            {date}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;

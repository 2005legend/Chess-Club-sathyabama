
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-chess-black text-white">
      {/* Chess pattern background */}
      <div className="absolute inset-0 chess-board-pattern opacity-10"></div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <img 
            src="/lovable-uploads/1d891cfb-fe62-4313-9f03-b4783d0207ca.png" 
            alt="Sathyabama Chess Club" 
            className="w-40 h-40 sm:w-48 sm:h-48 bg-white rounded-full p-4"
          />
        </motion.div>
        
        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-4 tracking-tight"
        >
          <span className="text-chess-accent">Sathyabama</span> Chess Club
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-xl md:text-2xl font-serif text-gray-300 mb-2"
        >
          Strategy. Focus. Growth.
        </motion.p>
        
        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="max-w-2xl mx-auto text-gray-400 mb-8 text-lg"
        >
          Chess Club — Sathyabama Institute of Science and Technology. Where strategic minds converge to master the art of chess.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <a href="https://chat.whatsapp.com/JKQYySbdVV23oDsficIU64" target="_blank" rel="noopener noreferrer">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-chess-accent hover:bg-chess-accent/90 text-white font-medium"
            >
              Join the Club <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <Link to="/events">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-chess-accent hover:bg-chess-accent/90 text-white font-medium"
            >
              Upcoming Tournaments
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Decorative chess pieces */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="chess-pieces" patternUnits="userSpaceOnUse" width="100" height="100">
              <path d="M30,20 L20,40 L40,40 Z" fill="white" opacity="0.1" />
              <circle cx="70" cy="30" r="15" fill="white" opacity="0.1" />
              <rect x="10" y="60" width="25" height="25" fill="white" opacity="0.1" />
              <path d="M70,60 Q80,70 90,60 L90,85 L70,85 Z" fill="white" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chess-pieces)" />
        </svg>
      </motion.div>
    </div>
  );
};

export default Hero;


import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-chess-dark relative pt-16">
      {/* Chess pattern background */}
      <div className="absolute inset-0 chess-board-pattern opacity-5"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4 relative z-10"
      >
        <div className="relative mb-8 inline-block">
          <div className="text-9xl font-bold font-serif text-chess-accent">404</div>
          <div className="absolute -bottom-4 left-0 right-0 h-1 bg-chess-accent opacity-30"></div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <Link to="/">
          <Button className="bg-chess-accent hover:bg-chess-accent/90 flex items-center gap-2">
            <Home size={16} />
            Return to Home
          </Button>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16"
        >
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/1d891cfb-fe62-4313-9f03-b4783d0207ca.png" 
              alt="Sathyabama Chess Club" 
              className="h-16 w-auto opacity-70"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;

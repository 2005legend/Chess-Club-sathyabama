import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy } from 'lucide-react';

// Custom PuzzlePiece icon since it's not in lucide-react
const PuzzlePiece = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 9c0-1.1-.9-2-2-2h-4c0-1.1-.9-2-2-2s-2 .9-2 2H5c-1.1 0-2 .9-2 2s.9 2 2 2c0 1.1.9 2 2 2s2-.9 2-2h4c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2s-.9-2-2-2z" />
  </svg>
);

const items = [
  { 
    title: "Join WhatsApp Group", 
    description: "Join our community chat for instant updates",
    icon: Users,
    href: "https://chat.whatsapp.com/JKQYySbdVV23oDsficIU64",
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    external: true
  },
  { 
    title: "Tournaments", 
    description: "Participate in our upcoming chess competitions",
    icon: Trophy,
    href: "/events",
    color: "bg-gradient-to-br from-blue-500 to-purple-600"
  },
  { 
    title: "Events Calendar", 
    description: "Stay updated with our events schedule",
    icon: Calendar,
    href: "/events",
    color: "bg-gradient-to-br from-amber-500 to-orange-600"
  },
  { 
    title: "Puzzle of the Day", 
    description: "Challenge yourself with our daily chess puzzles",
    icon: PuzzlePiece,
    href: "/puzzle",
    color: "bg-gradient-to-br from-green-500 to-emerald-600"
  },
];

const quickLinksVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const quickLinkVariants = {
  initial: {
    y: 20,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.3
    }
  }
};

const QuickLinks = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-chess-white dark:bg-chess-dark">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif mb-4">Quick Links</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our resources and discover what the Sathyabama Chess Club has to offer
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={quickLinksVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={quickLinkVariants}
              whileHover="hover"
            >
              {item.external ? (
                <a 
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full group"
                >
                  <div className="card-chess flex flex-col h-full overflow-hidden dark:bg-chess-dark/50 transform transition-all duration-300 group-hover:shadow-xl">
                    <div className={`p-4 ${item.color} text-white rounded-t-xl`}>
                      <item.icon size={28} />
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-chess-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <div className="px-6 pb-6 mt-auto">
                      <span className="inline-flex items-center text-chess-accent font-medium">
                        Join Now
                        <svg className="w-5 h-5 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              ) : (
                <Link 
                  to={item.href}
                  className="block h-full group"
                >
                  <div className="card-chess flex flex-col h-full overflow-hidden dark:bg-chess-dark/50 transform transition-all duration-300 group-hover:shadow-xl">
                    <div className={`p-4 ${item.color} text-white rounded-t-xl`}>
                      <item.icon size={28} />
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-chess-accent transition-colors">
                        {item.title}
                    </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <div className="px-6 pb-6 mt-auto">
                      <span className="inline-flex items-center text-chess-accent font-medium">
                        Learn more
                        <svg className="w-5 h-5 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default QuickLinks;

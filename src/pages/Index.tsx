
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import Hero from '@/components/home/Hero';
import QuickLinks from '@/components/home/QuickLinks';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Image Section */}
      <section className="w-full py-16 bg-chess-black/5 dark:bg-chess-black/40">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2071&auto=format&fit=crop" 
              alt="Chess tournament" 
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chess-black via-chess-black/60 to-transparent flex items-end">
              <div className="p-8 md:p-12 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
                  Join Our Next Tournament
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Experience the thrill of competitive chess with players from all skill levels. Our tournaments offer a chance to test your skills, learn new strategies, and connect with fellow chess enthusiasts.
                </p>
                <div className="flex gap-4">
                  <Link to="/events">
                    <Button variant="default" className="bg-white text-chess-black hover:bg-white/90">
                      View Events
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Links */}
      <QuickLinks />
      
      {/* About Section Preview */}
      <section className="py-16 px-4 bg-white dark:bg-chess-dark">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-chess-accent/10 text-chess-accent text-sm font-medium mb-4">
                About Us
              </span>
              <h2 className="text-3xl font-bold font-serif mb-4">
                Fostering Strategic Excellence
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Founded in 2010, the Sathyabama Chess Club is dedicated to promoting the game of chess 
                among students and faculty. We believe that chess is not just a game, but a powerful tool 
                for developing critical thinking, pattern recognition, and strategic planning skills.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our club welcomes players of all skill levels, from beginners to experienced competitors. 
                We offer regular training sessions, friendly matches, and opportunities to participate in 
                intercollegiate tournaments.
              </p>
              <Link 
                to="/about"
                className="inline-flex items-center font-medium text-chess-accent hover:underline"
              >
                Learn more about our club
                <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="chess-board-pattern absolute inset-0 rounded-2xl opacity-10"></div>
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2071&auto=format&fit=crop" 
                  alt="Chess players" 
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-chess-black/70 to-transparent flex items-center pl-10">
                  <div className="max-w-xs">
                    <h3 className="text-white text-2xl font-bold font-serif mb-2">
                      "Chess is life in miniature."
                    </h3>
                    <p className="text-white/70 italic">- Garry Kasparov</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 px-4 bg-chess-black text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { number: '50+', label: 'Active Members' },
              { number: '3', label: 'Tournaments Organized' },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
              >
                <h3 className="text-4xl font-bold font-serif text-chess-accent mb-2">{stat.number}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      

      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-chess-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 chess-board-pattern opacity-5"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-serif mb-4">
              Ready to Join Our Chess Community?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Whether you're a beginner or an experienced player, we welcome everyone who shares our passion for chess.
            </p>
            <button
              onClick={() => window.open('https://chat.whatsapp.com/JKQYySbdVV23oDsficIU64', '_blank')}
              className="inline-block px-8 py-3 bg-white text-chess-accent font-medium rounded-full hover:bg-white/90 transition-colors shadow-md"
            >
              Join the Club Today
            </button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Index;

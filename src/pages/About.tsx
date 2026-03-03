
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import MemberCard from '@/components/shared/MemberCard';

const About = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Team members data
  const teamMembers = [
    {
      name: 'Sidaarth.K',
      role: 'President',
      image: '/placeholder.svg',
      accolades: ['BE CSE', 'President of Chess Club', 'Strategic Leader']
    },
    {
      name: 'Monesh Raj.S',
      role: 'Vice President', 
      image: '/placeholder.svg',
      accolades: ['BE EEE', 'Vice President of Chess Club', 'Tournament Organizer']
    },
    {
      name: 'Reshma Sathishkumar',
      role: 'Cluster Coordinator',
      image: '/placeholder.svg',
      accolades: ['BE Biomedical', 'Cluster Coordinator', 'Event Management Specialist']
    }
  ];
  
  return (
    <PageTransition>
      {/* Header */}
      <div className="pt-24 bg-chess-black text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">About Our Club</h1>
            <p className="text-xl text-gray-300">
              Discover our mission, vision, and the passionate team behind the Sathyabama Chess Club
            </p>
          </motion.div>
        </div>
        
        <div className="h-20 bg-white dark:bg-chess-dark chess-board-pattern"></div>
      </div>
      
      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-white dark:bg-chess-dark">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-chess-dark/50 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-800"
            >
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-chess-accent/10 text-chess-accent text-sm font-medium">
                  Our Mission
                </span>
              </div>
              <h2 className="text-3xl font-bold font-serif mb-4">Cultivating Strategic Minds</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our mission is to foster a community of chess enthusiasts at Sathyabama Institute of Science and Technology, promoting intellectual growth, 
                strategic thinking, and sportsmanship through the game of chess. We embody our core values: Strategy. Focus. Growth.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                We are dedicated to providing opportunities for students to learn, practice, and compete in chess, regardless of 
                their prior experience or skill level. Through regular training sessions, friendly matches, and competitive tournaments, 
                we aim to create an environment where members can develop their chess skills and forge lasting friendships.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-chess-dark/50 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-800"
            >
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-chess-accent/10 text-chess-accent text-sm font-medium">
                  Our Vision
                </span>
              </div>
              <h2 className="text-3xl font-bold font-serif mb-4">Building Champions</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We envision Sathyabama Chess Club as a center of excellence for chess in the educational community, 
                recognized for nurturing talented players and promoting the intellectual benefits of the game.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Our vision is to create a vibrant chess culture on campus that extends beyond competitions, encouraging 
                analytical thinking, patience, and strategic planning in all aspects of life. We aspire to develop not just 
                skilled chess players, but well-rounded individuals who apply the lessons of chess to overcome challenges 
                in their academic and professional pursuits.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Core Values */}
      <section className="py-16 px-4 bg-chess-black text-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold font-serif mb-4">Our Core Values</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              The principles that guide our club's activities and decisions
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Excellence",
                description: "We pursue mastery in chess and strive for continuous improvement in all our endeavors.",
                icon: "🏆"
              },
              {
                title: "Inclusivity",
                description: "We welcome players of all backgrounds and skill levels, creating a diverse and supportive community.",
                icon: "🤝"
              },
              {
                title: "Sportsmanship",
                description: "We promote fair play, respect for opponents, and gracious behavior in victory and defeat.",
                icon: "🎯"
              },
              {
                title: "Innovation",
                description: "We embrace creative approaches to chess strategy, teaching methods, and club activities.",
                icon: "💡"
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold font-serif mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Meet the Team */}
      <section className="py-16 px-4 bg-chess-light/50 dark:bg-chess-black">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold font-serif mb-4">Meet Our Team</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The dedicated individuals who lead and organize the Sathyabama Chess Club
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MemberCard 
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  accolades={member.accolades}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default About;

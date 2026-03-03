
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, MapPin, Phone, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-chess-black text-white pt-12 pb-6 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/lovable-uploads/1d891cfb-fe62-4313-9f03-b4783d0207ca.png"
                alt="Sathyabama Chess Club"
                className="h-12 w-auto bg-white rounded-full p-1"
              />
              <h3 className="font-serif text-lg font-bold">Chess Club — SIST</h3>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Strategy. Focus. Growth. We are a community of chess enthusiasts at Sathyabama Institute of Science and Technology.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/sathyabama_chess_club/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'About', href: '/about' },
                { name: 'Events', href: '/events' },
                { name: 'Practice Bot', href: '/practice' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-chess-accent transition-colors flex items-center gap-1"
                  >
                    <ChevronRight size={16} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { name: 'Puzzle Corner', href: '/puzzle' },
                { name: 'Join the Club', href: '/contact' },
                { name: 'Tournaments', href: '/events' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-chess-accent transition-colors flex items-center gap-1"
                  >
                    <ChevronRight size={16} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="text-chess-accent shrink-0 mt-0.5" size={18} />
                <span className="text-gray-400 text-sm">Sathyabama Institute of Science and Technology, Jeppiaar Nagar, Chennai, Tamil Nadu 600119</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-chess-accent shrink-0" size={18} />
                <span className="text-gray-400 text-sm">+91 79043 14877</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-chess-accent shrink-0" size={18} />
                <span className="text-gray-400 text-sm">chessclub.sathyabama@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Sathyabama Chess Club. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

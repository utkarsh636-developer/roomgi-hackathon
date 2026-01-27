import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800 font-montserrat text-gray-300">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-900/50">R</div>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Room<span className="text-indigo-500">Gi</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed pr-4">
              Your trusted companion for finding verified student housing. Zero brokerage, 100% transparency.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Home</Link></li>
              <li><Link to="/explore" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Explore Stays</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>About Us</Link></li>
              <li><Link to="/blog" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>Blog</Link></li>
              <li><Link to="/list-property" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>List Property</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-indigo-500 mt-1 shrink-0" size={20} />
                <span className="text-sm">123 Innovation Drive, Tech Hub,<br />Bangalore, Karnataka 560001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-indigo-500 shrink-0" size={20} />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-indigo-500 shrink-0" size={20} />
                <span className="text-sm">hello@roomgi.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get the latest updates and offers.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2026 RoomGi. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

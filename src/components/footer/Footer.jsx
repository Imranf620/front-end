import React from 'react';
import { Facebook, Twitter, LinkedIn, GitHub } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 py-12 ">
      <div className="max-w-screen-xl mx-auto text-center">
        <div className="flex justify-center gap-6 mb-6">
          <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook className="text-white hover:text-blue-500 transition-all duration-300" />
         </Link>
          <Link href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="text-white hover:text-blue-400 transition-all duration-300" />
         </Link>
          <Link href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <LinkedIn className="text-white hover:text-blue-700 transition-all duration-300" />
         </Link>
          <Link href="https://www.github.com" target="_blank" rel="noopener noreferrer">
            <GitHub className="text-white hover:text-gray-400 transition-all duration-300" />
         </Link>
        </div>

        <div className="text-sm mb-4">
          <p className="opacity-80">
            <Link to="/terms" className="hover:text-gray-400 transition-all duration-300">
              Terms & Conditions
            </Link>{' '}|{' '}
            <Link to="/privacy" className="hover:text-gray-400 transition-all duration-300">
              Privacy Policy
            </Link>
          </p>
        </div>

        <div className="text-xs opacity-70">
          <p>&copy; {new Date().getFullYear()} Gofilez. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

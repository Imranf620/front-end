import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = Cookies.get('cookie-consent');
    if (!cookieConsent) {
      setShowBanner(true); 
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookie-consent', 'accepted', { expires: 365 });
    setShowBanner(false); 
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 sm:p-6 text-center z-50 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm sm:text-base">
          We use cookies to improve your experience. By using our site, you agree to our 
          <Link to="/privacy" className="text-blue-400 hover:underline"> Privacy Policy</Link> and 
          <Link to="/terms" className="text-blue-400 hover:underline"> Terms & Conditions</Link>.
        </p>
        <button 
          onClick={handleAccept} 
          className="mt-4 sm:mt-0 sm:ml-4 bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;

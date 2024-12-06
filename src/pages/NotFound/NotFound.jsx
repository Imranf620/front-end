import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <p className="text-xl text-gray-700 my-4">
          Oops! The page you're looking for cannot be found.
        </p>
        <button
          onClick={handleGoHome}
          className="text-indigo-600 hover:text-indigo-800 text-lg font-semibold"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;

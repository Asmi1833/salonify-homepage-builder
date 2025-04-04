
import React from 'react';

interface SalonifyLogoProps {
  className?: string;
}

const SalonifyLogo: React.FC<SalonifyLogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="mr-2 relative">
        <div className="w-8 h-8 rounded-full bg-salon"></div>
        <div className="absolute top-1 left-1 w-6 h-6 rounded-full border-2 border-white"></div>
        <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-salon-light"></div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-salon to-salon-dark bg-clip-text text-transparent">
        Salonify
      </span>
    </div>
  );
};

export default SalonifyLogo;


import React from 'react';
import { Scissors } from 'lucide-react';

interface SalonifyLogoProps {
  className?: string;
}

const SalonifyLogo: React.FC<SalonifyLogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="mr-2 relative">
        <div className="w-8 h-8 rounded-full bg-salon flex items-center justify-center">
          <Scissors className="w-5 h-5 text-white" />
        </div>
        <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-salon-light"></div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-salon to-salon-dark bg-clip-text text-transparent">
        Salonify
      </span>
    </div>
  );
};

export default SalonifyLogo;

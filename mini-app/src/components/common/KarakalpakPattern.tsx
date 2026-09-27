import React from 'react';

interface KarakalpakPatternProps {
  variant?: 'corner-diamond' | 'bottom-ribbon' | 'certificate-frame';
  className?: string;
}

export const KarakalpakPattern: React.FC<KarakalpakPatternProps> = ({
  variant = 'bottom-ribbon',
  className = '',
}) => {
  if (variant === 'corner-diamond') {
    return (
      <svg
        className={`w-16 h-16 text-teal-600 ${className}`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Traditional Karakalpak Stepped Diamond Ornament (Múyiz / Qaraqalpaq naǵısı) */}
        <path
          d="M 50 5 L 95 50 L 50 95 L 5 50 Z"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 50 18 L 82 50 L 50 82 L 18 50 Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="4 2"
          fill="none"
        />
        {/* Stepped inner hooks */}
        <path
          d="M 50 30 L 70 50 L 50 70 L 30 50 Z"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M 50 38 L 50 62 M 38 50 L 62 50"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Corner curls */}
        <circle cx="50" cy="8" r="3" fill="currentColor" />
        <circle cx="92" cy="50" r="3" fill="currentColor" />
        <circle cx="50" cy="92" r="3" fill="currentColor" />
        <circle cx="8" cy="50" r="3" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'bottom-ribbon') {
    return (
      <div className={`w-full overflow-hidden flex items-center justify-center opacity-85 py-1 ${className}`}>
        <svg
          viewBox="0 0 400 36"
          className="w-full h-8 max-w-md text-teal-600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="qaraqalpaq-ribbon" width="40" height="36" patternUnits="userSpaceOnUse">
              {/* Outer diamond */}
              <polygon points="20,2 38,18 20,34 2,18" stroke="#0D9488" strokeWidth="2.5" fill="none" />
              {/* Inner diamond */}
              <polygon points="20,8 30,18 20,28 10,18" stroke="#14B8A6" strokeWidth="1.5" fill="#CCFBF1" fillOpacity="0.4" />
              {/* Center cross/motif */}
              <path d="M 20 12 L 20 24 M 14 18 L 26 18" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
              {/* Connecting side brackets */}
              <polyline points="0,8 4,18 0,28" stroke="#0D9488" strokeWidth="2" fill="none" />
              <polyline points="40,8 36,18 40,28" stroke="#0D9488" strokeWidth="2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="36" fill="url(#qaraqalpaq-ribbon)" />
        </svg>
      </div>
    );
  }

  // Certificate border frame
  return (
    <div className={`absolute inset-0 pointer-events-none p-3 ${className}`}>
      <div className="w-full h-full border-4 border-teal-700/60 rounded-xl relative flex flex-col justify-between">
        {/* 4 Corner Ornaments */}
        <div className="absolute top-1 left-1 w-8 h-8 border-t-2 border-l-2 border-teal-800" />
        <div className="absolute top-1 right-1 w-8 h-8 border-t-2 border-r-2 border-teal-800" />
        <div className="absolute bottom-1 left-1 w-8 h-8 border-b-2 border-l-2 border-teal-800" />
        <div className="absolute bottom-1 right-1 w-8 h-8 border-b-2 border-r-2 border-teal-800" />
      </div>
    </div>
  );
};

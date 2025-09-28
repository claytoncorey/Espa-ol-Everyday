import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="absolute inset-x-0 top-0 h-[30%] z-20 pointer-events-none">
      <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="xMidYMin meet">
        {/* Invisible path for the title text to follow. Curves upwards. */}
        <path
          id="titleCurve"
          d="M 50,130 A 200,200 0 0,1 450,130"
          fill="none"
        />
        
        <text 
          className="font-black text-sky-900 fill-current tracking-wider" 
          style={{ 
            textShadow: '0 1px 2px rgba(255,255,255,0.5)',
            fontSize: 'clamp(1.25rem, 4vmin, 2.5rem)'
          }}
        >
          <textPath href="#titleCurve" startOffset="50%" textAnchor="middle">
            Español Everyday
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default Header;
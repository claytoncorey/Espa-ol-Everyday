
import React from 'react';

interface HeaderProps {
  totalLearned: number;
}

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 4a1 1 0 011-1h.01a1 1 0 01.993.883L11 4v5.5a.5.5 0 00.5.5H12a1 1 0 110 2h-1.5a2.5 2.5 0 01-2.5-2.5V4zM9 14a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
        <path d="M5 4a1 1 0 011-1h1.5a.5.5 0 01.5.5V12a2.5 2.5 0 002.5 2.5H12a1 1 0 110 2H8.5A4.5 4.5 0 014 11.5V5a1 1 0 011-1z" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ totalLearned }) => {
  return (
    <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-4 px-2">
      <div className="flex items-center">
        <span role="img" aria-label="spain flag" className="text-2xl mr-3">🇪🇸</span>
        <h1 className="text-2xl font-black text-sky-900">Español Everyday</h1>
      </div>
      <div className="flex items-center bg-white/70 backdrop-blur-sm shadow-md rounded-full px-4 py-2">
        <BookIcon />
        <span className="font-bold text-slate-700">{totalLearned}</span>
        <span className="text-slate-500 ml-1.5">Words Learned</span>
      </div>
    </header>
  );
};

export default Header;

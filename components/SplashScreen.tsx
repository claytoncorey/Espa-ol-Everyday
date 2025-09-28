import React from 'react';
import AnimatedBackground from './AnimatedBackground';

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden text-white">
      <AnimatedBackground />
      <div className="relative z-10 w-[95vmin] h-[95vmin] rounded-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-sky-500 to-sky-600 shadow-2xl animate-fade-in">
        <h1 className="font-black text-[clamp(2rem,10vmin,6rem)] leading-tight text-sky-900" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
          Español Everyday
        </h1>
        <p className="mt-4 text-sky-100 opacity-90 text-[clamp(1rem,3vmin,2rem)] max-w-md">
          Learn just a few words every day to build your vocabulary.
        </p>
        <button
          onClick={onStart}
          className="mt-8 px-8 py-4 bg-white/30 text-white font-bold rounded-full shadow-lg hover:bg-white/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/80 transform hover:scale-110"
        >
          <span className="text-[clamp(1rem,2.8vmin,1.8rem)]">Let's Start!</span>
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;

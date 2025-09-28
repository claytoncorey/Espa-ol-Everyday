import React, { useState, useEffect } from 'react';
import type { Word } from '../types';
import { initAudio } from '../services/soundService';

// Add styles for the pop animation
const popAnimationStyles = `
@keyframes pop {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
.animate-pop {
  animation: pop 0.3s ease-in-out;
}
`;

if (typeof window !== 'undefined' && !document.getElementById('pop-animation-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "pop-animation-styles";
  styleSheet.type = "text/css";
  styleSheet.innerText = popAnimationStyles;
  document.head.appendChild(styleSheet);
}

const flipCardStyles = `
.card-container {
  perspective: 1000px;
}
.card {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.7s;
  transform-style: preserve-3d;
}
.card.is-flipped {
  transform: rotateY(180deg);
}
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
  border-radius: 9999px; /* matching Tailwind's rounded-full */
}
.card-face-back {
  transform: rotateY(180deg);
}
`;

if (typeof window !== 'undefined' && !document.getElementById('flip-card-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "flip-card-styles";
  styleSheet.type = "text/css";
  styleSheet.innerText = flipCardStyles;
  document.head.appendChild(styleSheet);
}


interface WordBubbleProps {
  word: Word;
  onLearn: (word: Word) => void;
}

const WordBubble: React.FC<WordBubbleProps> = ({ word, onLearn }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPopping, setIsPopping] = useState(false); // State for animation

  // When a new word is passed in, ensure the card is flipped to the front.
  useEffect(() => {
    setIsFlipped(false);
  }, [word]);

  const handleFlip = () => {
    initAudio();
    setIsFlipped(!isFlipped);
  };

  const handleLearn = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onLearn(word);
    
    setIsPopping(true);
    setTimeout(() => {
        setIsPopping(false);
    }, 300); // Duration of the animation
  };
  
  const NextWordButton = ({ className = '' }: { className?: string }) => (
     <button
        onClick={handleLearn}
        onKeyDown={(e) => e.key === 'Enter' && handleLearn(e)}
        className={`font-bold rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 transform hover:scale-110 ${className}`}
        aria-label="Mark word as learned and go to the next word"
      >
        <span className="text-[clamp(1rem,3vmin,1.75rem)]">Next Word</span>
    </button>
  );


  return (
    <div className={`relative w-[85%] h-[85%] flex items-center justify-center ${isPopping ? 'animate-pop' : ''}`}>
      <div className="card-container w-full h-full" onClick={handleFlip}>
        <div 
          className={`card shadow-2xl ${isFlipped ? 'is-flipped' : ''}`}
        >
          {/* Front of bubble */}
          <div className="card-face bg-white/10 backdrop-blur-sm flex flex-col justify-between items-center p-4 text-white cursor-pointer">
            <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
              <h2 className="font-black capitalize text-[clamp(2.5rem,10vmin,7rem)] leading-tight">{word.spanish}</h2>
              <p className="font-bold text-sky-200 capitalize text-[clamp(1.5rem,5vmin,3rem)] mt-2">{word.english}</p>
              <p className="mt-6 text-sky-100 opacity-80 text-[clamp(0.8rem,2.2vmin,1.3rem)]">Click for details</p>
            </div>
            <div className="w-full flex items-center justify-center pb-2 pt-4">
               <NextWordButton className="px-10 py-4 bg-blue-500/90 hover:bg-blue-500 text-white focus:ring-white/80" />
            </div>
          </div>
          
          {/* Back of bubble */}
          <div className="card-face card-face-back bg-white flex flex-col justify-between overflow-hidden">
            <div className="text-center flex-grow flex flex-col justify-center p-4 sm:p-6 text-slate-700">
              <h3 className="font-black text-emerald-600 capitalize text-[clamp(2rem,8vmin,5rem)]">{word.spanish}</h3>
              <p className="mt-2 italic text-slate-600 text-[clamp(0.9rem,2.5vmin,1.2rem)] px-4">{word.description}</p>
              <div className="mt-4 text-slate-500 space-y-2 max-h-28 sm:max-h-36 overflow-y-auto px-2 text-[clamp(0.85rem,2.2vmin,1.1rem)] border-t border-slate-200 pt-3 mx-4">
                <p>"{word.example_es}"</p>
                <p className="italic">"{word.example_en}"</p>
              </div>
            </div>
            <div className="w-full h-[25%] bg-emerald-500 flex items-center justify-around text-white font-bold">
               <NextWordButton className="px-10 py-4 bg-white/90 hover:bg-white text-blue-600 focus:ring-blue-500/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordBubble;
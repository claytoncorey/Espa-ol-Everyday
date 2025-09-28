import React, { useState } from 'react';
import type { Word } from '../types';
import { initAudio } from '../services/soundService';

interface WordCardProps {
  word: Word;
  onLearn: (word: Word) => void;
  isLearned: boolean;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const WordCard: React.FC<WordCardProps> = ({ word, onLearn, isLearned }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    // Initialize audio context on the first user interaction to comply with browser policies.
    initAudio();
    if (!isLearned) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleLearn = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLearn(word);
    setIsFlipped(false);
  };
  
  return (
    <div className={`relative perspective-1000 w-full h-64 ${isLearned ? 'opacity-70' : ''}`} onClick={handleFlip}>
      <div 
        className={`absolute w-full h-full transition-transform duration-700 transform-style-preserve-3d rounded-2xl shadow-lg ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex flex-col justify-center items-center p-6 text-white cursor-pointer">
          {isLearned && (
            <div className="absolute top-3 right-3 bg-emerald-500 rounded-full p-1.5 z-10">
              <CheckIcon />
            </div>
          )}
          <h2 className="text-4xl font-black capitalize">{word.spanish}</h2>
          <p className="mt-4 text-sky-100">Click to flip</p>
        </div>
        
        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl flex flex-col justify-between p-6 rotate-y-180">
          <div>
            <h3 className="text-3xl font-bold text-slate-800 capitalize">{word.english}</h3>
            <div className="mt-4 text-slate-500 space-y-2">
              <p>"{word.example_es}"</p>
              <p className="italic">"{word.example_en}"</p>
            </div>
          </div>
          <button
            onClick={handleLearn}
            disabled={isLearned}
            className="w-full mt-4 bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordCard;

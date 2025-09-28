
import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useWordBank } from './hooks/useWordBank';
import Header from './components/Header';
import WordCard from './components/WordCard';
import ProgressBar from './components/ProgressBar';
import LoadingSpinner from './components/LoadingSpinner';
import Celebration from './components/Celebration';
import { playSuccessChime, playCompletionFanfare } from './services/soundService';
import type { Word } from './types';

function App() {
  const { 
    dailyWords, 
    allWords,
    learnedToday, 
    isLoading,
    isAddingWord,
    error, 
    markAsLearned,
    addNewWord,
  } = useWordBank();
  
  const [celebrateWord, setCelebrateWord] = useState(false);
  const [celebrateDay, setCelebrateDay] = useState(false);

  const handleLearnWord = (word: Word) => {
    if (learnedToday.find(w => w.spanish === word.spanish)) return;

    markAsLearned(word);
    playSuccessChime();
    setCelebrateWord(true);
    setTimeout(() => setCelebrateWord(false), 2000);
  };

  const isDayComplete = useMemo(() => {
    return dailyWords.length > 0 && learnedToday.length === dailyWords.length;
  }, [dailyWords, learnedToday]);

  useEffect(() => {
    if (isDayComplete) {
      playCompletionFanfare();
      setCelebrateDay(true);
    } else {
      setCelebrateDay(false);
    }
  }, [isDayComplete]);

  const progress = dailyWords.length > 0 ? (learnedToday.length / dailyWords.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-emerald-100 flex flex-col items-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {celebrateWord && <Celebration type="word" />}
      {celebrateDay && <Celebration type="day" />}
      
      <Header totalLearned={allWords.length} />

      <main className="w-full max-w-4xl mx-auto flex-grow">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full mt-20">
            <LoadingSpinner />
            <p className="text-lg text-sky-700 font-semibold mt-4">Planting new words for you...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full mt-20 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <p><strong className="font-bold">Oh no!</strong> {error}</p>
          </div>
        )}
        {!isLoading && !error && (
          <>
            <div className="my-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-black text-sky-800 tracking-tight">Your Words for Today</h1>
              <p className="text-slate-500 mt-2">Learn these words to grow your vocabulary!</p>
            </div>
            
            <div className="w-full max-w-lg mx-auto flex items-center gap-4 px-4 mb-8">
              <div className="flex-grow">
                <ProgressBar progress={progress} learnedCount={learnedToday.length} totalCount={dailyWords.length} />
              </div>
              <button
                onClick={addNewWord}
                disabled={isLoading || isAddingWord}
                className="flex-shrink-0 flex items-center justify-center bg-sky-500 text-white font-bold h-12 w-12 rounded-full shadow-lg hover:bg-sky-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
                aria-label="Add a new word"
              >
                {isAddingWord ? (
                  <div className="w-6 h-6 border-2 border-sky-100 border-t-transparent border-solid rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            </div>


            {isDayComplete ? (
              <div className="text-center mt-12 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg animate-fade-in">
                <h2 className="text-4xl font-black text-emerald-600">¡Excelente!</h2>
                <p className="text-slate-600 mt-4 text-lg">You've learned all your words for today. Come back tomorrow for more, or add another word!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
                {dailyWords.map((word) => (
                  <WordCard
                    key={word.spanish}
                    word={word}
                    onLearn={handleLearnWord}
                    isLearned={learnedToday.some(learnedWord => learnedWord.spanish === word.spanish)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Español Everyday</p>
      </footer>
    </div>
  );
}

export default App;

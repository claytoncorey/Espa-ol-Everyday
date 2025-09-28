import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useWordBank } from './hooks/useWordBank';
import Header from './components/Header';
import WordBubble from './components/WordCard';
import LoadingSpinner from './components/LoadingSpinner';
import Celebration from './components/Celebration';
import AnimatedBackground from './components/AnimatedBackground';
import CircularProgressBar from './components/ProgressBar';
import SplashScreen from './components/SplashScreen';
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
    isNewUser,
  } = useWordBank();
  
  const [celebrateWord, setCelebrateWord] = useState(false);
  const [celebrateDay, setCelebrateDay] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setShowSplash(isNewUser);
    }
  }, [isNewUser, isLoading]);

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

  const currentWord = useMemo(() => {
    if (isDayComplete) return null;
    return dailyWords.find(dw => !learnedToday.some(lw => lw.spanish === dw.spanish));
  }, [dailyWords, learnedToday, isDayComplete]);

  useEffect(() => {
    if (isDayComplete) {
      playCompletionFanfare();
      setCelebrateDay(true);
    } else {
      setCelebrateDay(false);
    }
  }, [isDayComplete]);

  const progress = dailyWords.length > 0 ? (learnedToday.length / dailyWords.length) * 100 : 0;

  const bubbleGradient = isDayComplete
    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
    : 'bg-gradient-to-br from-sky-500 to-sky-600';

  if (isLoading && showSplash) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50">
        <AnimatedBackground />
        {/* You can add a spinner here if initial load is slow */}
      </div>
    );
  }

  if (showSplash) {
    return <SplashScreen onStart={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground />
      {celebrateWord && <Celebration type="word" />}
      {celebrateDay && <Celebration type="day" />}
      
      <div className={`relative w-[95vmin] h-[95vmin] rounded-full flex flex-col items-center justify-center z-10 shadow-2xl text-white transition-colors duration-500 ${bubbleGradient}`}>
        
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {!isDayComplete && currentWord && <CircularProgressBar progress={progress} />}
        </div>

        <Header />

        <main className="w-full flex-grow flex flex-col items-center justify-center z-0 p-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <LoadingSpinner />
              <p className="text-lg text-sky-100 font-semibold mt-4">Planting new words for you...</p>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center text-center h-full bg-red-100/80 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-xs" role="alert">
              <p><strong className="font-bold">Oh no!</strong> {error}</p>
            </div>
          )}
          {!isLoading && !error && (
            <>
              {isDayComplete ? (
                <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center animate-fade-in">
                  <h2 className="font-black text-[clamp(2.5rem,12vmin,8rem)]">¡Excelente!</h2>
                  <p className="mt-4 opacity-90 text-[clamp(1rem,3vmin,2rem)]">You've learned all your words for today!</p>
                  <button
                    onClick={addNewWord}
                    disabled={isAddingWord}
                    className="mt-6 flex items-center justify-center w-16 h-16 bg-white/30 text-white font-bold rounded-full shadow-lg hover:bg-white/40 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/80 disabled:bg-slate-300/30 disabled:text-slate-100 disabled:cursor-not-allowed transform hover:scale-110 disabled:scale-100"
                    aria-label="Learn one more word"
                  >
                    {isAddingWord ? (
                      <div className="w-8 h-8 border-2 border-sky-100 border-t-white border-solid rounded-full animate-spin"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : currentWord ? (
                 <div className="w-full h-full flex flex-col items-center justify-center gap-8 animate-fade-in">
                    <WordBubble
                      key={currentWord.spanish}
                      word={currentWord}
                      onLearn={handleLearnWord}
                    />
                  </div>
              ) : (
                  <div className="text-center my-8">
                      <p className="text-slate-100 mt-4 text-lg">Loading your first word...</p>
                  </div>
              )}
            </>
          )}
        </main>

        <div className="absolute inset-x-0 bottom-0 h-[30%] z-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="xMidYMax meet">
                <path
                  id="wordCountCurve"
                  d="M 100,70 A 150,150 0 0,0 400,70"
                  fill="none"
                />
                 <path
                  id="footerCurve"
                  d="M 50,40 A 200,200 0 0,0 450,40"
                  fill="none"
                />
                {!isDayComplete && currentWord && (
                    <text className="font-bold text-sky-100 fill-current" style={{ fontSize: 'clamp(0.7rem, 2vmin, 1.1rem)' }}>
                       <textPath href="#wordCountCurve" startOffset="50%" textAnchor="middle">
                        {allWords.length} {allWords.length === 1 ? 'Word' : 'Words'} Learned
                      </textPath>
                    </text>
                )}
                <text className="text-sky-200/80 fill-current" style={{ fontSize: 'clamp(0.6rem, 1.5vmin, 0.9rem)' }}>
                    <textPath href="#footerCurve" startOffset="50%" textAnchor="middle">
                        Designed by Clayton Corey
                    </textPath>
                </text>
            </svg>
        </div>
      </div>
    </div>
  );
}

export default App;
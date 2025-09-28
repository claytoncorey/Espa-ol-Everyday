
import { useState, useEffect, useCallback } from 'react';
import { fetchInitialWord, fetchNewWords } from '../services/geminiService';
import { LOCAL_STORAGE_KEY, DAILY_WORDS_COUNT } from '../constants';
import type { Word, StoredData } from '../types';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const useWordBank = () => {
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [dailyWords, setDailyWords] = useState<Word[]>([]);
  const [learnedToday, setLearnedToday] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddingWord, setIsAddingWord] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAndProcessData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const savedDataRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const today = getTodayDateString();
      let data: StoredData | null = null;
      if (savedDataRaw) {
        data = JSON.parse(savedDataRaw);
      }

      if (!data || data.words.length === 0) { // First time user
        console.log("First time user, fetching initial word.");
        const initialWord = await fetchInitialWord();
        const newWords = [initialWord];
        const newData: StoredData = { words: newWords, lastLoginDate: today, dailyWordsCount: 1 };
        setAllWords(newWords);
        setDailyWords(newWords);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      } else if (data.lastLoginDate !== today) { // New day
        console.log("New day detected, fetching new words.");
        const existingWordStrings = data.words.map(w => w.spanish);
        const newWords = await fetchNewWords(existingWordStrings, DAILY_WORDS_COUNT);
        const updatedWords = [...data.words, ...newWords];
        const newData: StoredData = { words: updatedWords, lastLoginDate: today, dailyWordsCount: DAILY_WORDS_COUNT };
        setAllWords(updatedWords);
        setDailyWords(newWords);
        setLearnedToday([]); // Reset daily progress
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      } else { // Same day
        console.log("Returning user, same day.");
        setAllWords(data.words);
        // Handle old data that might not have dailyWordsCount
        const count = data.dailyWordsCount || (data.words.length > 5 ? DAILY_WORDS_COUNT : data.words.length);
        setDailyWords(data.words.slice(-count)); 
        setLearnedToday([]); 
      }
    } catch (err) {
      console.error("Error in word bank logic:", err);
      setError("Failed to fetch new words. Please check your API key and network connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAndProcessData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsLearned = useCallback((word: Word) => {
    setLearnedToday(prev => {
      if (prev.find(w => w.spanish === word.spanish)) {
        return prev;
      }
      return [...prev, word];
    });
  }, []);
  
  const addNewWord = useCallback(async () => {
    setIsAddingWord(true);
    setError(null);
    try {
      const existingWordStrings = allWords.map(w => w.spanish);
      const [newWord] = await fetchNewWords(existingWordStrings, 1);
      
      if (newWord) {
        const savedDataRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        // This should always exist, but provide a safe fallback.
        const data: StoredData = savedDataRaw ? JSON.parse(savedDataRaw) : { words: allWords, lastLoginDate: getTodayDateString(), dailyWordsCount: dailyWords.length };
        
        const updatedWords = [...data.words, newWord];
        // Fallback for old data structure
        const newDailyCount = (data.dailyWordsCount || dailyWords.length) + 1;
        
        const newData: StoredData = {
          words: updatedWords,
          lastLoginDate: data.lastLoginDate,
          dailyWordsCount: newDailyCount
        };
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
        
        setAllWords(updatedWords);
        setDailyWords(prev => [...prev, newWord]);
      } else {
        throw new Error("No new word was returned from the API.");
      }
    } catch (err) {
      console.error("Failed to add a new word:", err);
      setError("Could not fetch an extra word. Please try again later.");
    } finally {
      setIsAddingWord(false);
    }
  }, [allWords, dailyWords.length]);

  return { 
    dailyWords,
    allWords,
    learnedToday,
    isLoading,
    isAddingWord,
    error,
    markAsLearned,
    addNewWord
  };
};

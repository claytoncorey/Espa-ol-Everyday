
import { GoogleGenAI, Type } from '@google/genai';
import type { Word } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const wordSchema = {
  type: Type.OBJECT,
  properties: {
    spanish: { type: Type.STRING, description: 'The word in Spanish.' },
    english: { type: Type.STRING, description: 'The English translation of the word.' },
    example_es: { type: Type.STRING, description: 'An example sentence in Spanish.' },
    example_en: { type: Type.STRING, description: 'The English translation of the example sentence.' },
  },
  required: ['spanish', 'english', 'example_es', 'example_en'],
};

export const fetchInitialWord = async (): Promise<Word> => {
  const prompt = `
    Give me one very common and easy-to-learn Spanish noun for an absolute beginner. 
    It should be something concrete and easily recognizable, like "casa" or "gato".
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: wordSchema,
    },
  });

  const parsedResponse = JSON.parse(response.text);
  return parsedResponse as Word;
};

export const fetchNewWords = async (existingWords: string[], count: number): Promise<Word[]> => {
  const prompt = `
    I am building a Spanish learning app. The user has already learned the following words: ${existingWords.join(', ')}.
    Please provide ${count} new Spanish words that are a logical next step in difficulty. 
    They should be common and useful for a beginner. Avoid repeating any of the existing words.
    Focus on a mix of common nouns, verbs, and adjectives.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: wordSchema,
      },
    },
  });

  const parsedResponse = JSON.parse(response.text);
  return parsedResponse as Word[];
};

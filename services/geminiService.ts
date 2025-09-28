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
    description: { type: Type.STRING, description: 'A short, simple description of the word\'s usage or context for a beginner.' },
  },
  required: ['spanish', 'english', 'example_es', 'example_en', 'description'],
};

export const fetchNewWords = async (existingWords: string[], count: number): Promise<Word[]> => {
  const prompt = `
    I am building a Spanish learning app for an absolute beginner.
    Please provide ${count} common and useful Spanish words.
    For each word, provide the English translation, a simple example sentence in both Spanish and English, and a short, beginner-friendly description of the word's common usage or context.
    ${existingWords.length > 0 ? `The user has already learned these words, so do not include them: ${existingWords.join(', ')}.` : 'This is the very first set of words for the user.'}
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
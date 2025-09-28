
export interface Word {
  spanish: string;
  english: string;
  example_es: string;
  example_en: string;
}

export interface StoredData {
  words: Word[];
  lastLoginDate: string;
  dailyWordsCount: number;
}

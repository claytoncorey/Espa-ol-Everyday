
import React from 'react';

interface ProgressBarProps {
  progress: number;
  learnedCount: number;
  totalCount: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, learnedCount, totalCount }) => {
  return (
    <div className="w-full max-w-md mx-auto px-4">
        <div className="flex justify-between items-center mb-1">
            <span className="text-base font-semibold text-sky-700">Daily Progress</span>
            <span className="text-sm font-bold text-sky-700">{learnedCount} / {totalCount}</span>
        </div>
      <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
        <div
          className="bg-gradient-to-r from-emerald-400 to-sky-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

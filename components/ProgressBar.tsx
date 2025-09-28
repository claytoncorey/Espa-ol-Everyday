import React from 'react';

interface CircularProgressBarProps {
  progress: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ progress }) => {
  const strokeWidth = 5; // Relative to viewBox
  const center = 50;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
      <circle
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        className="stroke-white/10"
        fill="transparent"
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        className="stroke-white/80"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
      />
    </svg>
  );
};

export default CircularProgressBar;
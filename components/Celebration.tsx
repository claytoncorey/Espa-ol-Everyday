
import React from 'react';
import './Celebration.css';

interface CelebrationProps {
  type: 'word' | 'day';
}

const Celebration: React.FC<CelebrationProps> = ({ type }) => {
  const count = type === 'day' ? 150 : 50;
  const colors = ['#fde047', '#86efac', '#67e8f9', '#f9a8d4', '#fca5a5'];
  
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const style = {
          '--duration': `${Math.random() * 2 + 3}s`,
          '--delay': `${Math.random() * 2}s`,
          '--x-start': `${Math.random() * 100}vw`,
          '--x-end': `${Math.random() * 100}vw`,
          '--bg-color': colors[Math.floor(Math.random() * colors.length)],
          '--scale': `${Math.random() * 0.5 + 0.5}`,
        } as React.CSSProperties;
        return <div key={i} className="confetti" style={style}></div>;
      })}
    </div>
  );
};

const styles = `
.confetti {
  position: absolute;
  top: -20px;
  width: 10px;
  height: 10px;
  background-color: var(--bg-color);
  opacity: 0;
  animation: fall var(--duration) var(--delay) linear infinite;
  transform: scale(var(--scale));
}

@keyframes fall {
  0% {
    transform: translateY(0vh) rotate(0deg) scale(var(--scale));
    opacity: 1;
    left: var(--x-start);
  }
  100% {
    transform: translateY(105vh) rotate(720deg) scale(var(--scale));
    opacity: 0;
    left: var(--x-end);
  }
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default Celebration;

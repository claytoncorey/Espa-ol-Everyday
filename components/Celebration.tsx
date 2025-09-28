
import React from 'react';

interface CelebrationProps {
  type: 'word' | 'day';
}

const Celebration: React.FC<CelebrationProps> = ({ type }) => {
  const count = type === 'day' ? 150 : 70;
  const colors = ['#fde047', '#86efac', '#67e8f9', '#f9a8d4', '#fca5a5'];
  
  return (
    // z-5 to be behind the main UI bubble (which is now z-10)
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-5 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const angle = Math.random() * 360;
        // Adjust distance for a nice spread
        const distance = type === 'day' 
          ? Math.random() * 300 + 200
          : Math.random() * 200 + 150;
        
        const radians = angle * (Math.PI / 180);
        const xEnd = Math.cos(radians) * distance;
        const yEnd = Math.sin(radians) * distance;

        const style = {
          '--duration': `${Math.random() * 1.2 + 0.8}s`,
          '--delay': `${Math.random() * 0.2}s`,
          '--x-end': `${xEnd}px`,
          '--y-end': `${yEnd}px`,
          '--bg-color': colors[Math.floor(Math.random() * colors.length)],
          '--scale-mid': `${Math.random() * 0.5 + 0.8}`,
          '--rotation': `${Math.random() * 720 - 360}deg`,
        } as React.CSSProperties;
        return <div key={i} className="confetti" style={style}></div>;
      })}
    </div>
  );
};

const styles = `
.confetti {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background-color: var(--bg-color);
  opacity: 0;
  /* Use 'forwards' to hold the final state of the animation */
  animation: explode var(--duration) var(--delay) ease-out forwards;
}

@keyframes explode {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  30% {
    transform: translate(calc(var(--x-end) * 0.3 - 50%), calc(var(--y-end) * 0.3 - 50%)) scale(var(--scale-mid)) rotate(calc(var(--rotation) * 0.3));
    opacity: 1;
  }
  100% {
    transform: translate(calc(var(--x-end) - 50%), calc(var(--y-end) - 50%)) scale(0) rotate(var(--rotation));
    opacity: 0;
  }
}
`;

const styleId = 'celebration-animation-styles';
if (typeof window !== 'undefined') {
    // A robust way to manage the style tag for this component.
    // It finds an existing one or creates a new one.
    let styleSheet = document.getElementById(styleId);
    if (!styleSheet) {
        styleSheet = document.createElement("style");
        styleSheet.id = styleId;
        document.head.appendChild(styleSheet);
    }
    // Update the styles. This will replace the old 'fall' animation.
    styleSheet.innerText = styles;
}


export default Celebration;
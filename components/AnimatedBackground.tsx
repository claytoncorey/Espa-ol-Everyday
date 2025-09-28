import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-emerald-200 rounded-full opacity-50 filter blur-3xl animate-blob"></div>
      <div className="absolute top-[20%] right-[5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-sky-200 rounded-full opacity-50 filter blur-3xl animate-blob animation-delay-2s"></div>
      <div className="absolute bottom-[5%] left-[20%] w-[25vw] h-[25vw] max-w-[300px] max-h-[300px] bg-teal-200 rounded-full opacity-50 filter blur-3xl animate-blob animation-delay-4s"></div>
    </div>
  );
};

const styles = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
.animate-blob {
  animation: blob 8s infinite ease-in-out;
}
.animation-delay-2s {
  animation-delay: -2s;
}
.animation-delay-4s {
  animation-delay: -4s;
}
`;

if (typeof window !== 'undefined' && !document.getElementById('blob-animation-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "blob-animation-styles";
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default AnimatedBackground;
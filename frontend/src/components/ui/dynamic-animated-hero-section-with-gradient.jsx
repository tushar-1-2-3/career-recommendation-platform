import { useEffect } from 'react';

export default function HeroSection({ title, highlight, action }) {
  useEffect(() => {
    document.querySelectorAll('.animation-line').forEach((path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}px`;
      path.style.strokeDashoffset = `${len}px`;

      setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 2s ease-in-out';
        path.style.strokeDashoffset = '0px';
      }, 500);
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center animate-fadeIn">
        <h1 className="relative z-20 m-0 max-w-5xl text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
          {title}
          <br />
          <span className="gradient-text relative z-10 inline-block">{highlight}</span>
        </h1>
        {action}
      </div>

      <div className="absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
        <svg className="absolute h-full w-full opacity-25" viewBox="0 0 177 159" preserveAspectRatio="none">
          <path
            className="animation-line"
            d="M176 1L53.5359 1C52.4313 1 51.5359 1.89543 51.5359 3L51.5359 56C51.5359 57.1046 50.6405 58 49.5359 58L0 58"
          />
        </svg>

        <svg className="absolute h-full w-full opacity-20" viewBox="0 0 176 59" preserveAspectRatio="none">
          <path
            className="animation-line"
            d="M0 1L122.464 1C123.569 1 124.464 1.89543 124.464 3L124.464 56C124.464 57.1046 125.36 58 126.464 58L176 58"
          />
        </svg>
      </div>

      <div className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] animate-patternScroll bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.075)_10px,rgba(255,255,255,0.075)_20px)]" />
    </div>
  );
}

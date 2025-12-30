'use client';

import { useEffect, useState, useRef } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function NewYearCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const newYear = new Date(currentYear + 1, 0, 1, 0, 0, 0);
    const difference = newYear.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);

      // Check if it's 10 minutes before midnight
      if (time.total > 0 && time.total <= 600000 && !notificationShown) {
        setNotificationShown(true);
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🎉 New Year Alert!', {
            body: '10 minutes until the New Year! Get ready to celebrate! 🎊',
            icon: '🎆'
          });
        }
      }

      // Check if it's midnight
      if (time.total === 0) {
        setIsCelebrating(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [notificationShown]);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) {
      // Create a simple beep tone as placeholder for music
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.1;
      
      if (!musicPlaying) {
        oscillator.start();
        setMusicPlaying(true);
        setTimeout(() => {
          oscillator.stop();
          setMusicPlaying(false);
        }, 3000);
      }
    }
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-white/20 shadow-2xl min-w-[80px] md:min-w-[120px]">
      <div className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs md:text-sm mt-2 text-white/80 uppercase tracking-wider">{label}</div>
    </div>
  );

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-stars" />
      <div className="absolute inset-0 bg-aurora-nye" />
      
      {/* Fireworks effect when celebrating */}
      {isCelebrating && (
        <>
          <div className="firework firework-1" />
          <div className="firework firework-2" />
          <div className="firework firework-3" />
          <div className="firework firework-4" />
        </>
      )}
      
      {/* Floating balloons */}
      <div className="balloon balloon-1">🎈</div>
      <div className="balloon balloon-2">🎈</div>
      <div className="balloon balloon-3">🎈</div>
      <div className="balloon balloon-4">🎊</div>
      <div className="balloon balloon-5">🎉</div>
      
      {/* Main content */}
      <main className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-6">
        {!isCelebrating ? (
          <>
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-4xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                🎆 New Year Countdown 🎆
              </h1>
              <p className="text-lg md:text-2xl text-white/90 font-light">
                {new Date().getFullYear() + 1} is almost here!
              </p>
            </div>
            
            {/* Countdown display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
              <TimeUnit value={timeLeft.days} label="Days" />
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <TimeUnit value={timeLeft.minutes} label="Minutes" />
              <TimeUnit value={timeLeft.seconds} label="Seconds" />
            </div>

            {/* Champagne bottle decoration */}
            <div className="text-6xl md:text-8xl animate-bounce-slow mb-6">
              🍾
            </div>

            {/* Music toggle button */}
            <button
              onClick={toggleMusic}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {musicPlaying ? '🔊 Music Playing' : '🎵 Play Celebration Music'}
            </button>
          </>
        ) : (
          <div className="text-center animate-celebration">
            <h1 className="text-5xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              🎉 HAPPY NEW YEAR! 🎉
            </h1>
            <p className="text-2xl md:text-4xl text-white font-light mb-8">
              Welcome to {new Date().getFullYear() + 1}!
            </p>
            <div className="text-8xl md:text-9xl animate-spin-slow">
              🎊
            </div>
          </div>
        )}
      </main>

      {/* Timezone info */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-xs md:text-sm text-center">
        Countdown based on your local timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </div>
    </div>
  );
}


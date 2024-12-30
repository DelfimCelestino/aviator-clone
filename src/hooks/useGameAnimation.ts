import { useRef, useState } from "react";

export function useGameAnimation() {
  const animationRef = useRef<number | undefined>(undefined);
  const [multiplier, setMultiplier] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<number | null>(null);

  const animate = (crashPoint: number, onCrash: () => void) => {
    const startTime = Date.now();
    const animateFrame = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      const currentMultiplier = Math.pow(Math.E, elapsed * 0.35);

      setMultiplier(currentMultiplier);

      if (currentMultiplier < crashPoint) {
        animationRef.current = requestAnimationFrame(animateFrame);
      } else {
        setGameResult(crashPoint);
        setIsPlaying(false);
        onCrash();
      }
    };
    animationRef.current = requestAnimationFrame(animateFrame);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return {
    multiplier,
    isPlaying,
    gameResult,
    setIsPlaying,
    setGameResult,
    animate,
    stopAnimation,
  };
}

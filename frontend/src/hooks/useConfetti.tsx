'use client';

import { useEffect, useRef } from 'react';
import JSConfetti from 'js-confetti';

const useConfetti = ({ className }: { className: string }) => {
  const ref = useRef(null);
  const canvas = <canvas className={className} style={{ pointerEvents: 'none' }} ref={ref} />;

  useEffect(() => {
    if (!ref.current) return;

    const confetti = new JSConfetti({ canvas: ref.current });
    confetti.addConfetti({
      confettiColors: ['#EA5858', '#F2B441', '#52C974', '#7791FA'],
    });

    return () => confetti.clearCanvas();
  }, [ref]);

  return canvas;
};

export default useConfetti;

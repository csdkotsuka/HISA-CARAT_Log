import confetti from 'canvas-confetti';

export const triggerSparkleConfetti = () => {
  // Rose Quartz, Serenity, Gold, Coral colors
  const colors = ['#F7CAC9', '#92A8D1', '#FFD1DC', '#FFE4E1', '#FFD700', '#FF7F50'];
  
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: colors,
    shapes: ['circle', 'star'],
    scalar: 1.1,
  });
};

export const triggerFullCelebration = () => {
  const count = 120;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#F7CAC9', '#92A8D1', '#F6D365', '#FDA085', '#E6E6FA'],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

document.addEventListener('DOMContentLoaded', function () {
  // Initialize confetti
  const confettiSettings = {
    target: 'confetti-container',
    max: 150,
    size: 1.5,
    animate: true,
    respawn: true,
    props: ['circle', 'square', 'triangle', 'line'],
    colors: [
      [255, 107, 107],
      [95, 61, 196],
      [32, 201, 151],
      [254, 202, 87],
    ],
    clock: 25,
    rotate: true,
    start_from_edge: true,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();

  // Clean up when leaving the page
  window.addEventListener('beforeunload', function () {
    confetti.clear();
  });

  // Add a class to the body after a short delay for a fade-in effect
  setTimeout(function () {
    document.body.classList.add('loaded');
  }, 100);
});

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  const moodSelect = document.getElementById('mood');

  const moodClasses = [
    'mood-annoyed',
    'mood-passive-aggressive',
    'mood-crying',
    'mood-actually-mad',
    'mood-depressed',
    'mood-school-s-driving-you-nuts',
    'mood-ready-to-end-a-fight',
    'mood-emergency',
    'mood-other-stuff-i-d-rather-not-say',
    'darkmode-annoyed',
    'darkmode-passive-aggressive',
    'darkmode-crying',
    'darkmode-actually-mad',
    'darkmode-depressed',
    'darkmode-school-s-driving-you-nuts',
    'darkmode-ready-to-end-a-fight',
    'darkmode-emergency',
    'darkmode-other-stuff-i-d-rather-not-say'
  ];

  function applyMoodClass() {
    moodClasses.forEach(cls => document.body.classList.remove(cls));

    const mood = moodSelect?.value;
    const isDark = document.body.classList.contains('dark-mode');

    if (mood) {
      const className = isDark ? `darkmode-${mood}` : `mood-${mood}`;
      document.body.classList.add(className);
    }
  }

  toggle?.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    applyMoodClass();
  });

  moodSelect?.addEventListener('change', applyMoodClass);

  applyMoodClass(); // all'avvio
});
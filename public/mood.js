document.addEventListener('DOMContentLoaded', () => {
  const moodSelect = document.getElementById('mood');
  if (!moodSelect) {
    console.error('moodSelect not found!');
    return;
  }

  function applyMoodClass() {
    console.log('Applying mood:', moodSelect.value); // Debug
    const moodClasses = [
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

    // Rimuovi solo le classi dei mood
    moodClasses.forEach(cls => document.body.classList.remove(cls));

    // Aggiungi la nuova classe del mood
    const mood = moodSelect.value;
    if (mood) {
      document.body.classList.add(`darkmode-${mood}`);
      console.log('Added class:', `darkmode-${mood}`);
    } else {
      console.log('No mood selected');
    }
  }

  moodSelect.addEventListener('change', applyMoodClass);
  applyMoodClass(); // Applica il mood all'avvio
});
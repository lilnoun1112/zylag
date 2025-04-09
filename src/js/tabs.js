  const tabButtons = document.querySelectorAll('.label-box .button-secondary');
  const tabContents = [document.getElementById('background'), document.getElementById('philosophy')];

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const isActive = button.classList.contains('active');

      // If already active, do nothing (or toggle off, if you want)
      if (isActive) return;

      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Hide all paragraphs
      tabContents.forEach(p => p.style.display = 'none');

      // Activate this button and show the content
      button.classList.add('active');
      document.getElementById(targetId).style.display = 'block';
    });
  });

  // Optionally: initialize by showing one tab
  document.querySelector('.label-box .button-secondary[data-target="background"]').click();

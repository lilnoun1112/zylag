// tabs.js
export function initTabs() {
  const tabButtons = document.querySelectorAll('.label-box .button-secondary');
  const tabContents = [document.getElementById('background'), document.getElementById('philosophy')];

  if (!tabButtons.length || !tabContents.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const isActive = button.classList.contains('active');
      if (isActive) return;

      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(p => p.style.display = 'none');

      button.classList.add('active');
      const target = document.getElementById(targetId);
      if (target) target.style.display = 'block';
    });
  });

  // Auto-select the first tab if it exists
  const first = document.querySelector('.label-box .button-secondary[data-target="background"]');
  first?.click();
}


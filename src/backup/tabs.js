export function initTabs() {
  const tabButtons = document.querySelectorAll('.label-box .button-secondary');
  const tabContents = [
    document.getElementById('background'),
    document.getElementById('philosophy')
  ];

  tabButtons.forEach(button => {
    const clone = button.cloneNode(true);
    button.replaceWith(clone);
  });

  const freshButtons = document.querySelectorAll('.label-box .button-secondary');
  freshButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const isActive = button.classList.contains('active');

      if (isActive) return;

      freshButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(p => p.style.display = 'none');

      button.classList.add('active');
      document.getElementById(targetId).style.display = 'block';
    });
  });

  const defaultTab = document.querySelector('.label-box .button-secondary[data-target="background"]');
  if (defaultTab) defaultTab.click();
}


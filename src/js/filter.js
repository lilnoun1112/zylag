// filter.js
export function initFilter() {
  const buttons = document.querySelectorAll('.button-secondary[data-tag]');
  const articles = document.querySelectorAll('.article-card');

  if (!buttons.length || !articles.length) return;

  let activeTag = null;

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.getAttribute('data-tag');

      if (activeTag === tag) {
        activeTag = null;
        button.classList.remove('active');
        articles.forEach(article => article.style.display = 'flex');
        return;
      }

      activeTag = tag;
      buttons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');

      articles.forEach(article => {
        const tagElements = article.querySelectorAll('.label-pill');
        const tags = Array.from(tagElements).map(el => el.textContent.trim());
        article.style.display = tags.includes(tag) ? 'flex' : 'none';
      });
    });
  });
}


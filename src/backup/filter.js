export function initFilter() {
  const buttons = document.querySelectorAll('.button-secondary');
  const articles = document.querySelectorAll('.article-card');

  buttons.forEach(button => {
    const clone = button.cloneNode(true);
    button.replaceWith(clone);
  });

  const newButtons = document.querySelectorAll('.button-secondary');
  let activeTag = null;

  newButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.getAttribute('data-tag');

      if (activeTag === tag) {
        activeTag = null;
        button.classList.remove('active');
        articles.forEach(article => article.style.display = 'flex');
        return;
      }

      activeTag = tag;
      newButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');

      articles.forEach(article => {
        const tagElements = article.querySelectorAll('.label-pill');
        const tags = Array.from(tagElements).map(el => el.textContent.trim());

        if (tags.includes(tag)) {
          article.style.display = 'flex';
        } else {
          article.style.display = 'none';
        }
      });
    });
  });
}

const buttons = document.querySelectorAll('.button-secondary');
const articles = document.querySelectorAll('.article-card');

let activeTag = null;

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const tag = button.getAttribute('data-tag');

    // If the same tag is clicked again, reset
    if (activeTag === tag) {
      activeTag = null;
      button.classList.remove('active');
      articles.forEach(article => article.style.display = 'flex');
      return;
    }

    // Otherwise activate this button
    activeTag = tag;
    buttons.forEach(b => b.classList.remove('active'));
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

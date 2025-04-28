export function initFilter() {
  const buttons = document.querySelectorAll('.button-secondary[data-tag]');
  const articles = document.querySelectorAll('.article-card');
  const highlights = document.querySelectorAll('.article-highlight');
  const boxes = document.querySelectorAll('.article-box');

  if (!buttons.length || (!articles.length && !highlights.length)) return;

  let activeTag = null;
  const DEFAULT_HIGHLIGHT = "Frontend";

  function activeHighlightTag() {
    return activeTag || DEFAULT_HIGHLIGHT;
  }

  function show(el) {
    el.style.display = 'flex';
    el.style.opacity = 1;
  }

  function hide(el) {
    el.style.display = 'none';
    el.style.opacity = 0;
  }

  function filterArticles() {
    articles.forEach(article => {
      const tagElements = article.querySelectorAll('.label-pill');
      const tags = Array.from(tagElements).map(el => el.textContent.trim());

      const matchesTag = !activeTag || tags.includes(activeTag);

      const highlightValue = article.getAttribute('data-highlight')?.trim() || '';
      const isCurrentHighlight = highlightValue === activeHighlightTag();

      if (matchesTag && !isCurrentHighlight) {
        show(article);
      } else {
        hide(article);
      }
    });
  }

  function filterHighlights() {
    highlights.forEach(highlight => {
      const highlightTagsRaw = highlight.getAttribute('data-highlight') || '';
      const highlightTags = highlightTagsRaw.split(',').map(t => t.trim());

      if (!activeTag) {
        if (highlightTags.includes(DEFAULT_HIGHLIGHT)) {
          show(highlight);
        } else {
          hide(highlight);
        }
      } else {
        if (highlightTags.includes(activeTag)) {
          show(highlight);
        } else {
          hide(highlight);
        }
      }
    });
  }

  function fixArticleBoxes() {
    boxes.forEach(box => {
      const cards = box.querySelectorAll('.article-card');
      const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');

      if (visibleCards.length === 0) {
        box.style.display = 'none';
      } else {
        box.style.display = 'flex';
      }
    });
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.getAttribute('data-tag');

      if (activeTag === tag) {
        activeTag = null;
        button.classList.remove('active');
      } else {
        activeTag = tag;
        buttons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
      }

      filterArticles();
      filterHighlights();
      fixArticleBoxes();
    });
  });

  // 🔥 Initial filtering on page load
  filterArticles();
  filterHighlights();
  fixArticleBoxes();
}

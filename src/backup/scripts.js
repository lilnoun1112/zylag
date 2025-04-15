import { initHeaderScroll } from './header-scroll.js';
import { initHeaderScrollGSAP } from './header-scroll-gsap.js';
import { initHoverPlay } from './hover-play.js';
import { initNavActivate } from './nav-activate.js';
import { initScrollDrag } from './scroll-drag.js';

console.log('✅ scripts.js loaded');

function initSharedScripts() {
  console.log('📦 initAll (shared scripts)');
  initHoverPlay();
  initNavActivate();
  initScrollDrag();
}

// Init once on first page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('📦 DOMContentLoaded → barbapage:ready');
  document.dispatchEvent(new CustomEvent('barbapage:ready'));
});

// Fire shared scripts on both initial load and after transitions
document.addEventListener('barbapage:ready', initSharedScripts);
barba.hooks.afterEnter(initSharedScripts);
barba.hooks.before(() => {
  console.log('🌀 Barba transition started');
});

// 🔥 PAGE-SPECIFIC INIT
barba.init({
  views: [
    {
      namespace: 'home',
      afterEnter() {
        console.log('🏠 Home loaded');
        initHeaderScroll();
        initHeaderScrollGSAP();
      }
    },
    {
      namespace: 'article',
      afterEnter() {
        console.log('📄 Article loaded');
      }
    }
  ],
  transitions: [
    {
      name: 'home-to-article',
      from: { namespace: ['home'] },
      to: { namespace: ['article'] },

      async leave({ current }) {
        const done = this.async();
        const el = (sel) => document.querySelector(sel);
        const columnMain = current.container.querySelector('.column-main');
        const fadingElements = [...columnMain.children];
        const topBlur = el('.top-blur');
        const content = el('.content');

        await gsap.to([...fadingElements, topBlur, content], {
          opacity: 0,
          duration: 0.4,
        });

        el('.nav')?.classList.add('scrolled', 'articlepage');
        topBlur?.classList.add('scrolled');
        content?.classList.add('articlepage');
        el('.header')?.classList.add('scrolled', 'articlepage');
        el('.column-header-logo')?.classList.add('scrolled');
        el('.logo')?.classList.add('scrolled');
        el('.column-header')?.classList.add('scrolled');
        el('.column-header .line-header')?.classList.add('articlepage');

        const section = el('.section#works');
        section?.classList.add('articlepage');
        section?.removeAttribute('id');

        await new Promise((resolve) => setTimeout(resolve, 500));
        done();
      },

      async enter({ next }) {
        const columnMain = next.container.querySelector('.column-main');
        const fadingElements = [...columnMain.children];
        const topBlur = document.querySelector('.top-blur');
        const content = document.querySelector('.content');

        gsap.fromTo([...fadingElements, topBlur, content], {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.4,
        });
      }
    },
    {
      name: 'article-to-home',
      from: { namespace: ['article'] },
      to: { namespace: ['home'] },

      async leave({ current }) {
        const done = this.async();
        const el = (sel) => document.querySelector(sel);
        const columnMain = current.container.querySelector('.column-main');
        const fadingElements = [...columnMain.children];
        const topBlur = el('.top-blur');
        const content = el('.content');

        await gsap.to([...fadingElements, topBlur, content], {
          opacity: 0,
          duration: 0.4,
        });

        el('.nav')?.classList.remove('scrolled', 'articlepage');
        topBlur?.classList.remove('scrolled');
        content?.classList.remove('articlepage');
        el('.header')?.classList.remove('scrolled', 'articlepage');
        el('.column-header-logo')?.classList.remove('scrolled');
        el('.logo')?.classList.remove('scrolled');
        el('.column-header')?.classList.remove('scrolled');
        el('.column-header .line-header')?.classList.remove('articlepage');

        const section = el('.section.articlepage');
        section?.classList.remove('articlepage');
        section?.setAttribute('id', 'works');

        await new Promise((resolve) => setTimeout(resolve, 500));
        done();
      },

      async enter({ next }) {
        const columnMain = next.container.querySelector('.column-main');
        const fadingElements = [...columnMain.children];
        const topBlur = document.querySelector('.top-blur');
        const content = document.querySelector('.content');

        gsap.fromTo([...fadingElements, topBlur, content], {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.4,
        });
      }
    }
  ]
});


// Reset scroll on every enter
barba.hooks.afterEnter(() => {
  window.scrollTo(0, 0);
});



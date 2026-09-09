(() => {
  const entries = document.querySelector('.course-entries');
  if (!entries) return;
  function updateCourse() {
    const slug = location.hash.slice(1);
    const active = [...entries.children].find(entry => entry.id === slug) || entries.querySelector('.course-default');
    const title = active.querySelector('h1').textContent;
    document.title = `${title} — Quran Dawn`;
    document.querySelector('meta[property="og:title"]').content = document.title;
    const description = active.querySelector('.course-detail-hero p').textContent;
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:description"]').content = description;
    const themes = ['course-theme-teal', 'course-theme-cream', 'course-theme-offwhite'];
    let visibleIndex = 0;
    document.querySelectorAll('.course-more .course-card-v2').forEach(card => {
      card.hidden = card.querySelector('a').hash === `#${active.id}`;
      card.classList.remove(...themes);
      if (!card.hidden) card.classList.add(themes[visibleIndex++]);
    });
  }
  window.addEventListener('hashchange', updateCourse);
  updateCourse();
})();

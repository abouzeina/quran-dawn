// Keep the contents list aligned with the section beneath the fixed header.
document.addEventListener('DOMContentLoaded', () => {
    const items = [...document.querySelectorAll('.legal-toc a[href^="#"]')]
        .map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
        .filter(item => item.section);
    if (!items.length) return;

    const header = document.querySelector('.site-header');
    let activeLink;
    let scheduled = false;

    const update = () => {
        scheduled = false;
        const margin = parseFloat(getComputedStyle(items[0].section).scrollMarginTop) || 0;
        const readingLine = Math.max(margin, header?.getBoundingClientRect().bottom || 0) + 1;
        let current = items[0];
        for (const item of items) {
            if (item.section.getBoundingClientRect().top > readingLine) break;
            current = item;
        }
        if (current.link === activeLink) return;
        activeLink?.removeAttribute('aria-current');
        current.link.setAttribute('aria-current', 'location');
        activeLink = current.link;
    };

    const scheduleUpdate = () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(update);
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    window.addEventListener('pageshow', scheduleUpdate);
    document.fonts?.ready.then(scheduleUpdate);
    update();
});

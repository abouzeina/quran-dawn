(() => {
  const started = performance.now();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const overlay = document.createElement('div');
  overlay.className = 'site-preloader';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = "<div class=\"preloader-brand\"><div class=\"preloader-symbol\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"610 423 355 234\" fill=\"#F0EDCC\"><defs><clipPath id=\"preloader-horizon\"><rect x=\"610\" y=\"423\" width=\"355\" height=\"228\"/></clipPath></defs><style>.dawn-art-sun{animation:preloader-sunrise 1.9s cubic-bezier(.22,.61,.36,1) both}@keyframes preloader-sunrise{from{transform:translateY(230px)}to{transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.dawn-art-sun{animation:none}}</style><g clip-path=\"url(#preloader-horizon)\"><g class=\"dawn-art-sun\"><path transform=\"matrix(1,0,0,-1,823.0443,432.62458)\" d=\"M0 0-20.051-86.315C-29.877-84.341-39.256-84.294-48.94-86.456L-67.957 .705C-57.52 2.703-46.778 3.738-35.754 3.738-23.483 3.738-11.542 2.445 0 0\" /><path transform=\"matrix(1,0,0,-1,752.9716,526.9322)\" d=\"M0 0C-8.204-4.842-15.138-10.648-21.297-17.982L-90.828 43.933C-76.184 59.495-58.648 72.329-39.114 81.591Z\" /><path transform=\"matrix(1,0,0,-1,913.9432,484.59724)\" d=\"M0 0-68.638-60.576C-74.656-53.266-81.614-47.295-89.677-42.57L-50.257 37.822C-31.24 28.372-14.221 15.491 0 0\" /><path transform=\"matrix(1,0,0,-1,840.9365,589.31179)\" d=\"M0 0C0 0-36.405-7.78-52.694-25.032-68.635-7.78-105.069 .103-105.073 .105-102.464 29.166-80.44 52.619-50.714 52.434-38.573 52.358-2.753 41.271 0 0\" /><path transform=\"matrix(1,0,0,-1,719.5692,564.2133)\" d=\"M0 0C-2.233-5.642-3.902-10.86-5.289-17.113L-102.488-13.516V-13.375C-99.409 9.685-91.722 31.31-80.392 50.539Z\" /><path transform=\"matrix(1,0,0,-1,957.5476,577.8236)\" d=\"M0 0-95.553-3.62C-96.588 2.351-98.21 7.687-100.419 13.352L-21.156 62.551C-10.32 43.651-2.962 22.519 0 0\" /></g></g><g class=\"dawn-art-book\"><path transform=\"matrix(1,0,0,-1,787.4077,651.06326)\" d=\"M0 0-171.637-.05V55.111L-114.168 55.186C-106.153 54.863-89.9 53.598-71.414 48.486-52.803 43.399-31.985 34.342-15.186 18.263-9.603 13.002-4.466 6.923 0 0\" /><path transform=\"matrix(1,0,0,-1,959.0693,595.952)\" d=\"M0 0-.05-55.136H-63.399L-171.662-55.111C-166.773-47.543-161.116-41.017-154.987-35.384-139.23-20.968-120.173-12.432-102.828-7.37-83.3-1.613-65.856-.273-57.444 .075Z\" /></g></svg></div><div class=\"preloader-wordmark\">QURAN DAWN</div><p class=\"preloader-tagline\">A day that begins with Quran<br>begins with purpose.</p></div><div class=\"preloader-horizon-glow\" aria-hidden=\"true\"></div><div class=\"preloader-horizon-line\" aria-hidden=\"true\"></div>";
  document.documentElement.append(overlay);
  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    overlay.classList.add('is-leaving');
    setTimeout(() => overlay.remove(), reduced ? 0 : 350);
  }
  function loaded() {
    setTimeout(close, Math.max(0, (reduced ? 0 : 2600) - (performance.now() - started)));
  }
  if (document.readyState === 'complete') loaded();
  else window.addEventListener('load', loaded, { once: true });
  // A slow or unavailable asset must never leave the page covered.
  setTimeout(close, 4000);
  window.addEventListener('pageshow', event => { if (event.persisted) close(); });
  window.addEventListener('keydown', close, { once: true });
  window.addEventListener('pointerdown', close, { once: true });
})();

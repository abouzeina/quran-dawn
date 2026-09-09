(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = [data.get('firstName').trim(), data.get('lastName').trim()].filter(Boolean).join(' ');
    const message = data.get('message').trim();
    if (!name || message.length < 10) {
      document.querySelector('#contact-status').textContent = 'Please enter your name and a message of at least 10 characters.';
      return;
    }
    const subject = `Quran Dawn enquiry: ${data.get('interest')}`;
    const body = `Name: ${name}\nEmail: ${data.get('email').trim()}\nInterest: ${data.get('interest')}\n\n${message}`;
    document.querySelector('#contact-status').textContent = 'Your email draft is ready to open. Send it from your email app. If no app opens, email learn@qurandawn.com directly; your message is still here.';
    window.location.href = `mailto:learn@qurandawn.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();

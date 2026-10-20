/* Copy only: student answers never leave this page unless the student copies them. */
(() => {
  const fields = () => [...document.querySelectorAll('main textarea, main input:not([type]), main input[type="text"], main input[type="email"], main input[type="number"], main select')];
  const tools = document.createElement('aside');
  tools.className = 'response-tools';
  tools.innerHTML = '<h2>Your responses</h2><p>Copy an individual answer below, or copy all your responses to paste into your own document or Airtable. Keep your own copy before leaving a shared device. Copying does not submit your work.</p><button type="button" class="response-copy">Copy all my responses</button><span class="response-status" role="status" aria-live="polite"></span>';
  document.querySelector('main').prepend(tools);
  const status = tools.querySelector('.response-status');
  function label(field, index) {
    if (field.labels?.length) return field.labels[0].textContent.trim();
    let previous = field.previousElementSibling;
    while (previous) {
      if (previous.matches('label, p, h3, h4, b')) return previous.textContent.trim();
      previous = previous.previousElementSibling;
    }
    return field.getAttribute('aria-label') || field.placeholder || `Response ${index + 1}`;
  }
  async function copy(text, button) {
    if (!text.trim()) { status.textContent = 'Enter a response first, then copy it.'; return; }
    const start = button.textContent;
    let success = false;
    try { await navigator.clipboard.writeText(text); success = true; } catch {
      const scratch = document.createElement('textarea');
      scratch.value = text;
      scratch.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';
      document.body.append(scratch);
      scratch.select();
      try { success = document.execCommand('copy'); } catch {}
      scratch.remove();
      button.focus();
    }
    status.textContent = success ? 'Copied. Paste into your document or Airtable to keep a copy.' : 'Automatic copying is unavailable. Select your response text and use your device’s Copy command.';
    button.textContent = success ? 'Copied!' : 'Try copying again';
    setTimeout(() => { button.textContent = start; }, 2200);
  }
  tools.querySelector('button').addEventListener('click', event => {
    const answers = fields().map((field, index) => {
      if (!field.value.trim()) return '';
      const section = field.closest('section');
      const heading = section?.querySelector('h2')?.textContent.trim();
      return `${heading ? heading + ' — ' : ''}${label(field, index)}\n${field.value}`;
    }).filter(Boolean);
    copy(answers.length ? `${document.querySelector('h1').textContent.trim()} — My responses\n\n${answers.join('\n\n')}` : '', event.currentTarget);
  });
  function enhance() {
    fields().forEach((field, index) => {
      if (field.dataset.copyReady) return;
      field.dataset.copyReady = 'true';
      const name = label(field, index);
      if (!field.labels?.length && !field.hasAttribute('aria-label')) field.setAttribute('aria-label', name);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'response-copy';
      button.textContent = 'Copy response';
      button.setAttribute('aria-label', `Copy response: ${name}`);
      button.addEventListener('click', () => copy(field.value, button));
      field.after(button);
    });
  }
  enhance();
  new MutationObserver(enhance).observe(document.querySelector('main'), { childList: true, subtree: true });
})();

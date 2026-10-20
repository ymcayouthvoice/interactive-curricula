/* Optional review aid. No guide content or student answers are edited. */
(() => {
  if (new URLSearchParams(location.search).get('proofread') !== '1') return;
  document.body.classList.add('proofreading');
  const notice = document.createElement('p');
  notice.className = 'proof-notice';
  notice.textContent = 'Proofreading view: yellow = dates; blue = departments; pink = people, roles, or possible names. Highlights are automatic prompts to verify, not confirmed errors. Open every tab and expandable section when reviewing.';
  document.body.prepend(notice);
  const dates = /\b(?:19\d{2}|20\d{2}|January|February|March|April|May|June|July|August|September|October|November|December|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|deadline|due date)\b|\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/i;
  const departments = /\b(?:department|departments|agency|agencies|Corrections|Education|Finance|Commerce|Health|Human Services|Natural Resources|Transportation)\b/i;
  const people = /\b(?:Governor|Commissioner|Director|Senator|Representative|President|Justice|Judge|Chair|Advisor|Adviser|Secretary|Treasurer|Coordinator|Mr\.|Mrs\.|Ms\.|Dr\.)|\b[A-Z][a-z]+ [A-Z][a-z]+\b/;
  function highlight() {
    document.querySelectorAll('main p,main li,main h2,main h3,main h4,main td,main th,main summary,main .mini,main .pyr2 div,main .tag,main .pg,.hero p,.hero h1,footer').forEach(el => {
      if (el.closest('.response-tools') || el.querySelector('p,li,h2,h3,h4,td,th,summary')) return;
      // Exclude response controls and their values from the review scan.
      const clone = el.cloneNode(true);
      clone.querySelectorAll('textarea,input,select,button,pre').forEach(control => control.remove());
      const text = clone.textContent;
      const categories = [];
      if (dates.test(text)) categories.push('date');
      if (departments.test(text)) categories.push('department');
      if (people.test(text)) categories.push('person');
      if (!categories.length) return;
      el.dataset.proof = categories.join(', ');
      el.classList.add('proof-' + categories[0]);
      el.title = 'Verify: ' + categories.map(c => ({date:'dates or deadlines',department:'department names',person:'people, roles, or possible names'})[c]).join('; ');
    });
  }
  highlight();
  new MutationObserver(highlight).observe(document.querySelector('main'), {childList:true,subtree:true});
})();

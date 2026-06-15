(function () {
  const STATE = {
    fighters: [],
    filtered: [],
    org: 'all',
    weight: 'all',
    style: 'all',
    query: '',
    sort: 'name',
  };

  const ORG_ORDER = ['UFC', 'RIZIN', 'ONE', 'Bellator', 'PFL', 'レジェンド'];

  const ORG_GRADIENTS = {
    UFC:    ['#1a1a1a', '#2a0a0a'],
    RIZIN:  ['#1a1a1a', '#2a0a00'],
    ONE:    ['#1a1a1a', '#001a00'],
    Bellator:['#1a1a1a', '#00202a'],
    PFL:    ['#1a1a1a', '#1a002a'],
    レジェンド:['#1a1a1a', '#2a2a00'],
  };

  const DOM = {};

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

  function init() {
    DOM.container  = qs('#fighter-container');
    DOM.input      = qs('#search-input');
    DOM.orgBtns    = qs('#filter-orgs');
    DOM.weightSel  = qs('#filter-weight');
    DOM.styleSel   = qs('#filter-style');
    DOM.sortSel    = qs('#sort-by');
    DOM.count      = qs('#results-count');
    DOM.noResults  = qs('#no-results');

    fetch('data/fighters.json')
      .then(r => r.json())
      .then(data => {
        STATE.fighters = data.fighters;
        populateFilterOptions();
        render();
      })
      .catch(() => {
        DOM.container.innerHTML = '<p style="color:var(--red-primary);text-align:center;">選手データの読み込みに失敗しました。</p>';
      });

    DOM.input.addEventListener('input', () => { STATE.query = DOM.input.value; render(); });
    DOM.weightSel.addEventListener('change', () => { STATE.weight = DOM.weightSel.value; render(); });
    DOM.styleSel.addEventListener('change', () => { STATE.style = DOM.styleSel.value; render(); });
    DOM.sortSel.addEventListener('change', () => { STATE.sort = DOM.sortSel.value; render(); });
    DOM.orgBtns.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      qsa('.filter-btn', DOM.orgBtns).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      STATE.org = btn.dataset.filter;
      render();
    });
  }

  function populateFilterOptions() {
    const weights = new Set();
    const styles = new Set();
    STATE.fighters.forEach(f => {
      weights.add(f.weightClass);
      f.style.split('/').forEach(s => styles.add(s.trim()));
    });

    const weightOrder = [
      'ヘビー級','ライトヘビー級','ミドル級','ウェルター級','ライト級',
      'フェザー級','バンタム級','フライ級','ストロー級',
      '女子バンタム級','女子フライ級','女子ストロー級','女子アトム級',
      '女子スーパーアトム級','女子ライト級','女子フェザー級'
    ];

    const sortedWeights = [...weights].sort((a, b) => {
      const ai = weightOrder.indexOf(a);
      const bi = weightOrder.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
    sortedWeights.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w;
      opt.textContent = w;
      DOM.weightSel.appendChild(opt);
    });

    const sortedStyles = [...styles].sort();
    sortedStyles.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      DOM.styleSel.appendChild(opt);
    });
  }

  function filterFighters() {
    return STATE.fighters.filter(f => {
      if (STATE.org !== 'all' && f.organization !== STATE.org) return false;
      if (STATE.weight !== 'all' && f.weightClass !== STATE.weight) return false;
      if (STATE.style !== 'all' && !f.style.includes(STATE.style)) return false;
      if (STATE.query) {
        const q = STATE.query.toLowerCase();
        const haystack = `${f.name} ${f.nameEn} ${f.nickname} ${f.organization} ${f.weightClass} ${f.style} ${f.country}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  function sortFighters(list) {
    const sorted = [...list];
    if (STATE.sort === 'wins') {
      sorted.sort((a, b) => {
        const winsA = parseInt(a.record.split('-')[0]) || 0;
        const winsB = parseInt(b.record.split('-')[0]) || 0;
        return winsB - winsA;
      });
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    }
    return sorted;
  }

  function groupByOrg(list) {
    const groups = {};
    list.forEach(f => {
      if (!groups[f.organization]) groups[f.organization] = [];
      groups[f.organization].push(f);
    });
    const ordered = [];
    const seen = new Set();
    ORG_ORDER.forEach(org => {
      if (groups[org]) { ordered.push({ org, fighters: groups[org] }); seen.add(org); }
    });
    Object.keys(groups).forEach(org => {
      if (!seen.has(org)) { ordered.push({ org, fighters: groups[org] }); seen.add(org); }
    });
    return ordered;
  }

  function getWikipediaUrl(f) {
    const name = f.nameEn.replace(/\s+/g, '_');
    return 'https://en.wikipedia.org/wiki/' + encodeURI(name);
  }

  function getOrgGradient(org) {
    const g = ORG_GRADIENTS[org];
    if (g) return `linear-gradient(135deg, ${g[0]} 0%, ${g[1]} 100%)`;
    return 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)';
  }

  function createCard(f) {
    const card = document.createElement('div');
    card.className = 'fighter-card fade-in';

    const imgDiv = document.createElement('div');
    imgDiv.className = 'fighter-image';
    imgDiv.style.background = getOrgGradient(f.organization);

    const flagSpan = document.createElement('span');
    flagSpan.className = 'fighter-flag';
    flagSpan.textContent = `${f.flag} ${f.country}`;
    imgDiv.appendChild(flagSpan);
    card.appendChild(imgDiv);

    const body = document.createElement('div');
    body.className = 'fighter-body';

    const name = document.createElement('h3');
    name.className = 'fighter-name';
    name.textContent = f.name;
    body.appendChild(name);

    const nick = document.createElement('div');
    nick.className = 'fighter-nickname';
    nick.textContent = f.nickname;
    body.appendChild(nick);

    const stats = document.createElement('div');
    stats.className = 'fighter-stats';

    const makeStat = (label, val) => {
      const div = document.createElement('div');
      div.className = 'fighter-stat';
      const span = document.createElement('span');
      span.textContent = label;
      div.appendChild(span);
      div.appendChild(document.createTextNode(val));
      return div;
    };

    stats.appendChild(makeStat('階級', f.weightClass));
    stats.appendChild(makeStat('所属', f.organization));
    stats.appendChild(makeStat('身長', f.height));
    stats.appendChild(makeStat('リーチ', f.reach));
    body.appendChild(stats);

    const record = document.createElement('div');
    record.className = 'fighter-record';
    record.textContent = f.record;
    body.appendChild(record);

    const styleWrap = document.createElement('div');
    styleWrap.style.marginTop = '8px';
    const styleSpan = document.createElement('span');
    styleSpan.className = 'fighter-style';
    styleSpan.textContent = f.style;
    styleWrap.appendChild(styleSpan);
    body.appendChild(styleWrap);

    const wikiWrap = document.createElement('div');
    wikiWrap.style.marginTop = '10px';
    const wikiA = document.createElement('a');
    wikiA.href = getWikipediaUrl(f);
    wikiA.target = '_blank';
    wikiA.rel = 'noopener';
    wikiA.textContent = 'Wikipedia ↗';
    wikiA.className = 'fighter-wiki-link';
    wikiWrap.appendChild(wikiA);
    body.appendChild(wikiWrap);

    card.appendChild(body);

    card.addEventListener('click', e => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      window.open(getWikipediaUrl(f), '_blank');
    });
    card.style.cursor = 'pointer';

    requestAnimationFrame(() => {
      card.classList.add('visible');
    });

    return card;
  }

  function render() {
    const filtered = filterFighters();
    const sorted = sortFighters(filtered);
    const grouped = groupByOrg(sorted);

    STATE.filtered = sorted;
    DOM.count.textContent = sorted.length;

    DOM.container.innerHTML = '';

    if (sorted.length === 0) {
      DOM.noResults.style.display = 'block';
      return;
    }
    DOM.noResults.style.display = 'none';

    grouped.forEach(group => {
      const section = document.createElement('div');
      section.style.marginTop = group === grouped[0] ? '0' : '48px';

      const header = document.createElement('h2');
      header.className = 'weight-category-label';
      header.textContent = `${group.org} 所属選手 (${group.fighters.length}人)`;
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'fighter-grid';
      group.fighters.forEach(f => grid.appendChild(createCard(f)));
      section.appendChild(grid);
      DOM.container.appendChild(section);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();

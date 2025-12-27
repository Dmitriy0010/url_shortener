(() => {
  const elements = {
    form: document.getElementById('shortenForm'),
    originalInput: document.getElementById('originalUrl'),
    statusEl: document.getElementById('status'),
    submitBtn: document.getElementById('submitBtn'),
    resultEl: document.getElementById('result'),
    shortLinkEl: document.getElementById('shortLink'),
    shortOriginalEl: document.getElementById('shortOriginal'),
    copyBtn: document.getElementById('copyBtn'),
    openBtn: document.getElementById('openBtn'),
    historyEl: document.getElementById('history'),
    clearHistoryBtn: document.getElementById('clearHistory')
  };

  const STORAGE_KEY = 'url-shortener-history';
  const BACKEND_BASE =
      location.hostname === 'localhost' && location.port === '8080'
          ? location.origin
          : 'http://localhost:8080';
  const HISTORY_LIMIT = 20;

  let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  renderHistory();

  elements.form.onsubmit = async (e) => {
    e.preventDefault();
    const url = elements.originalInput.value.trim();
    if (!url) return setStatus('Введите ссылку', 'error');

    setLoading(true);
    setStatus('Сокращаю ссылку...');

    try {
      const shortUrl = await shortenUrl(url);
      setStatus('Ссылка создана', 'success');
      showResult(shortUrl, url);
      addToHistory(url, shortUrl);
    } catch (error) {
      setStatus(error.message || 'Не удалось создать ссылку', 'error');
    } finally {
      setLoading(false);
    }
  };

  elements.copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(elements.shortLinkEl.textContent);
      setStatus('Скопировано в буфер обмена', 'success');
    } catch {
      setStatus('Не удалось скопировать', 'error');
    }
  };

  elements.openBtn.onclick = () => {
    window.open(elements.shortLinkEl.href, '_blank', 'noopener');
  };

  elements.clearHistoryBtn.onclick = () => {
    history = [];
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
    setStatus('История очищена');
  };

  async function shortenUrl(url) {
    const response = await fetch(`${BACKEND_BASE}/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error('Ошибка, ссылка не создана');
    }

    const data = await response.json();
    if (!data?.url) throw new Error('Неверный ответ сервера');
    
    return data.url;
  }

  function showResult(shortUrl, originalUrl) {
    elements.shortLinkEl.textContent = elements.shortLinkEl.href = shortUrl;
    elements.shortOriginalEl.textContent = `Исходный адрес: ${originalUrl}`;
    elements.resultEl.classList.remove('hidden');
  }

  function addToHistory(original, short) {
    history = [{
      original,
      short,
      createdAt: new Date().toISOString()
    }, ...history].slice(0, HISTORY_LIMIT);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
  elements.historyEl.innerHTML = history.length
    ? history.map(({ short, original, createdAt }) => `
        <div class="history-item">
          <div class="history-header">
            <span class="history-time">${new Date(createdAt).toLocaleString()}</span>
            <div class="history-actions">
              <button 
                class="icon-btn copy-history-btn" 
                data-url="${short}" 
                title="Скопировать">
                ⧉
              </button>
              <a 
                href="${short}" 
                target="_blank" 
                rel="noopener" 
                class="icon-btn open-btn"
                title="Открыть">
                Открыть
              </a>
            </div>
          </div>
          <div class="history-links">
            <div><span class="hint">Короткая:</span> ${short}</div>
            <div><span class="hint">Исходная:</span> ${original}</div>
          </div>
        </div>
      `).join('')
    : '<p class="empty">Пока нет созданных ссылок</p>';

  bindHistoryCopyButtons();
}

function bindHistoryCopyButtons() {
  document.querySelectorAll('.copy-history-btn').forEach(btn => {
    btn.onclick = async () => {
      const url = btn.dataset.url;
      try {
        await navigator.clipboard.writeText(url);
        setStatus('Ссылка скопирована', 'success');
      } catch {
        setStatus('Не удалось скопировать', 'error');
      }
    };
  });
}

  function setStatus(message, type) {
    elements.statusEl.textContent = message;
    elements.statusEl.className = type ? `status ${type}` : 'status';
  }

  function setLoading(isLoading) {
    elements.submitBtn.disabled = isLoading;
    elements.submitBtn.textContent = isLoading ? 'Сокращаю...' : 'Сократить';
  }
})();

// темная тема
const toggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}


toggle.onclick = () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};


// === APP.JS — логин + CRUD ссылок ===

document.addEventListener('DOMContentLoaded', () => {
    const authScreen = document.getElementById('authScreen');
    const authForm = document.getElementById('authForm');
    const authEmail = document.getElementById('authEmail');
    const authPassword = document.getElementById('authPassword');
    const authError = document.getElementById('authError');
    const authSubmit = document.getElementById('authSubmit');
    const toggleAuthMode = document.getElementById('toggleAuthMode');

    const userEmailEl = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');
    const urlsTableBody = document.getElementById('urlsTableBody');
    const statClicks = document.getElementById('statClicks');
    const statLinks = document.getElementById('statLinks');
    const statCtr = document.getElementById('statCtr');

    const openCreateModal = document.getElementById('openCreateModal');
    const createModal = document.getElementById('createModal');
    const createModalClose = document.getElementById('createModalClose');
    const createForm = document.getElementById('createForm');
    const originalUrl = document.getElementById('originalUrl');
    const createError = document.getElementById('createError');
    const createSubmit = document.getElementById('createSubmit');

    let isRegisterMode = false;

    // ---------- AUTH UI ----------
    function showAuth() {
        if (authScreen) authScreen.classList.remove('hidden');
    }

    function hideAuth() {
        if (authScreen) authScreen.classList.add('hidden');
    }

    function showAuthError(msg) {
        if (!authError) return;
        authError.textContent = msg;
        authError.hidden = false;
    }

    function clearAuthError() {
        if (!authError) return;
        authError.hidden = true;
        authError.textContent = '';
    }

    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', () => {
            isRegisterMode = !isRegisterMode;
            clearAuthError();
            authSubmit.textContent = isRegisterMode ? 'Зарегистрироваться' : 'Войти';
            toggleAuthMode.textContent = isRegisterMode ? 'Войти' : 'Зарегистрироваться';
            toggleAuthMode.previousSibling.textContent = isRegisterMode
                ? 'Уже есть аккаунт? '
                : 'Нет аккаунта? ';
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearAuthError();

            const email = authEmail.value.trim();
            const password = authPassword.value;

            authSubmit.disabled = true;
            authSubmit.textContent = 'Загрузка...';

            try {
                if (isRegisterMode) {
                    await apiRegister(email, password);
                    // после регистрации сразу логиним
                }

                const data = await apiLogin(email, password);
                setToken(data.token);
                userEmailEl.textContent = email;
                hideAuth();
                await loadUrls();
            } catch (err) {
                showAuthError(err.message);
            } finally {
                authSubmit.disabled = false;
                authSubmit.textContent = isRegisterMode ? 'Зарегистрироваться' : 'Войти';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearToken();
            userEmailEl.textContent = '—';
            if (urlsTableBody) urlsTableBody.innerHTML = '';
            updateStats([]);
            showAuth();
        });
    }

    // ---------- MODAL ----------
    function openModal() {
        if (!createModal) return;
        createError.hidden = true;
        originalUrl.value = '';
        createModal.hidden = false;
    }

    function closeModal() {
        if (!createModal) return;
        createModal.hidden = true;
    }

    if (openCreateModal) openCreateModal.addEventListener('click', openModal);
    if (createModalClose) createModalClose.addEventListener('click', closeModal);
    if (createModal) {
        createModal.addEventListener('click', (e) => {
            if (e.target === createModal) closeModal();
        });
    }

    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            createError.hidden = true;
            createSubmit.disabled = true;
            createSubmit.textContent = 'Создаём...';

            try {
                await apiShorten(originalUrl.value.trim());
                closeModal();
                await loadUrls();
            } catch (err) {
                createError.textContent = err.message;
                createError.hidden = false;
            } finally {
                createSubmit.disabled = false;
                createSubmit.textContent = 'Сократить';
            }
        });
    }

    // ---------- TABLE + STATS ----------
    function updateStats(urls) {
        const totalLinks = urls.length;
        const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);

        if (statLinks) statLinks.textContent = totalLinks.toLocaleString('ru-RU');
        if (statClicks) statClicks.textContent = totalClicks.toLocaleString('ru-RU');
        if (statCtr) {
            // условный "CTR" для портфолио: клики / ссылки
            const avg = totalLinks ? (totalClicks / totalLinks).toFixed(1) : '0';
            statCtr.textContent = avg;
        }
    }

    function renderUrls(urls) {
        if (!urlsTableBody) return;

        if (!urls.length) {
            urlsTableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center; color: var(--text-muted); padding: 32px 0;">
                        Пока нет ссылок. Нажми «Создать».
                    </td>
                </tr>
            `;
            updateStats([]);
            return;
        }

        urlsTableBody.innerHTML = urls.map(u => {
            const short = u.short_url || u.short_code;
            const original = u.original_url || '';
            const clicks = u.clicks || 0;

            return `
                <tr data-id="${u.id}">
                    <td>
                        <a href="${short}" class="short-link" target="_blank" rel="noopener">
                            ${u.short_code || short}
                        </a>
                    </td>
                    <td class="truncate" title="${original}">${original}</td>
                    <td>${clicks.toLocaleString('ru-RU')}</td>
                    <td>
                        <button class="icon-btn btn-copy" data-url="${short}" title="Копировать">
                            <i class="ph ph-copy"></i>
                        </button>
                        <button class="icon-btn danger btn-delete" data-id="${u.id}" title="Удалить">
                            <i class="ph ph-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        updateStats(urls);

        // копирование
        urlsTableBody.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(btn.dataset.url);
                    btn.innerHTML = '<i class="ph ph-check"></i>';
                    setTimeout(() => { btn.innerHTML = '<i class="ph ph-copy"></i>'; }, 1200);
                } catch (_) {
                    alert('Не удалось скопировать');
                }
            });
        });

        // удаление
        urlsTableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Удалить ссылку?')) return;
                try {
                    await apiDeleteUrl(btn.dataset.id);
                    await loadUrls();
                } catch (err) {
                    alert(err.message);
                }
            });
        });
    }

    async function loadUrls() {
        try {
            const data = await apiGetMyUrls();
            renderUrls(data.urls || []);
        } catch (err) {
            // токен протух / нет доступа
            console.error(err);
            clearToken();
            showAuth();
        }
    }

    // ---------- INIT ----------
    if (getToken()) {
        hideAuth();
        // email из токена мы не парсим — покажем после логина; можно оставить "user"
        userEmailEl.textContent = 'user';
        loadUrls();
    } else {
        showAuth();
    }
});
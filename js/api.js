// Все запросы к Short.ly API в одном месте
const API_BASE = 'https://nova-api-p6r4.onrender.com';

function getToken() {
    return localStorage.getItem('pulse_token');
}

function setToken(token) {
    localStorage.setItem('pulse_token', token);
}

function clearToken() {
    localStorage.removeItem('pulse_token');
}

async function apiRequest(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || `Ошибка ${res.status}`);
    }

    return data;
}

// --- Auth ---
async function apiRegister(email, password) {
    return apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

async function apiLogin(email, password) {
    return apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

// --- URLs ---
async function apiGetMyUrls() {
    return apiRequest('/api/url/my-urls');
}

async function apiShorten(original_url) {
    return apiRequest('/api/url/shorten', {
        method: 'POST',
        body: JSON.stringify({ original_url })
    });
}

async function apiDeleteUrl(id) {
    return apiRequest(`/api/url/${id}`, {
        method: 'DELETE'
    });
}
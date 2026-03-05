// admin-app/public/js/auth.js
function getAdmin() {
    const a = localStorage.getItem('hms_admin');
    if (!a) { window.location.href = '/admin/'; return null; }
    return JSON.parse(a);
}
function adminLogout() {
    localStorage.removeItem('hms_admin');
    localStorage.removeItem('hms_admin_token');
    window.location.href = '/admin/';
}
function showToast(msg, type = 'success') {
    const colors = { success: '#52b788', danger: '#e63946', info: '#0096c7' };
    const t = document.createElement('div');
    t.className = 'toast';
    t.style.background = colors[type] || '#1a2332';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}
// Active nav
(function () {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
        if (el.getAttribute('href') === page) el.classList.add('active');
    });
})();

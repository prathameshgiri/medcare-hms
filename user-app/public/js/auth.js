// js/auth.js – shared auth helpers for patient portal
function getUser() {
    const u = localStorage.getItem('hms_user');
    if (!u) { window.location.href = '/login.html'; return null; }
    return JSON.parse(u);
}
function logout() {
    localStorage.removeItem('hms_user');
    localStorage.removeItem('hms_token');
    window.location.href = '/';
}

// Inject the top navbar for authenticated pages
function renderAuthNav(activePage) {
    const user = getUser();
    if (!user) return;
    const nav = document.getElementById('authNav');
    if (!nav) return;
    const pages = [
        { href: 'appointments.html', label: 'My Appointments', id: 'appt' },
        { href: 'doctors.html', label: 'Find Doctors', id: 'doc' },
        { href: 'prescriptions.html', label: 'Prescriptions', id: 'rx' },
        { href: 'contact.html', label: 'Contact', id: 'contact' },
        { href: 'profile.html', label: 'Profile', id: 'profile' },
    ];
    nav.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="/" class="nav-logo">
          <div class="nav-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
          </div>
          MedCare HMS
        </a>
        <div class="nav-links">
          ${pages.map(p => `<a href="${p.href}" class="nav-link${activePage === p.id ? ' active' : ''}">${p.label}</a>`).join('')}
        </div>
        <div class="nav-right">
          <div class="nav-user">
            <div class="nav-avatar">${user.name[0]}</div>
            <span class="nav-user-name">${user.name.split(' ')[0]}</span>
          </div>
          <button class="nav-logout" onclick="logout()" title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </nav>`;
}

function showToast(msg, color) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.style.background = color || 'var(--success)';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

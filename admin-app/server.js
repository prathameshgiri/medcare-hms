// ============================================================
// admin-app/server.js – Admin Panel Server (Port 3001)
// ============================================================
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../shared/data');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/admin', express.static(path.join(__dirname, 'public')));

// ─── Admin Auth ────────────────────────────────────────────
app.post('/admin/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const admin = db.getAdminByEmail(email);
    if (!admin) return res.status(401).json({ success: false, message: 'Admin not found' });
    if (admin.password !== password) return res.status(401).json({ success: false, message: 'Invalid password' });
    const { password: _, ...safeAdmin } = admin;
    res.json({ success: true, admin: safeAdmin, token: 'admin-token-' + admin.id });
});

// ─── Stats ─────────────────────────────────────────────────
app.get('/admin/api/stats', (req, res) => {
    res.json({ success: true, stats: db.getStats() });
});

// ─── Patients ──────────────────────────────────────────────
app.get('/admin/api/patients', (req, res) => {
    const safe = db.users.map(({ password, ...u }) => u);
    res.json({ success: true, patients: safe });
});

// ─── Doctors ───────────────────────────────────────────────
app.get('/admin/api/doctors', (req, res) => {
    res.json({ success: true, doctors: db.doctors });
});

app.post('/admin/api/doctors', (req, res) => {
    const { name, specialization, experience, qualification, email, phone, availability, timings, fee, rating } = req.body;
    if (!name || !specialization) return res.status(400).json({ success: false, message: 'Name and specialization required' });
    const doc = db.addDoctor({
        name, specialization, experience: experience || '—',
        qualification: qualification || '—', email: email || '',
        phone: phone || '', availability: availability || 'Mon–Fri',
        timings: timings || '9:00 AM – 5:00 PM',
        fee: Number(fee) || 500, rating: Number(rating) || 4.5,
        reviews: 0, available: true,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0096c7&color=fff&size=200`
    });
    res.json({ success: true, doctor: doc });
});

app.put('/admin/api/doctors/:id', (req, res) => {
    const updated = db.updateDoctor(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, doctor: updated });
});

app.delete('/admin/api/doctors/:id', (req, res) => {
    const ok = db.deleteDoctor(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
});

// ─── Appointments ──────────────────────────────────────────
app.get('/admin/api/appointments', (req, res) => {
    res.json({ success: true, appointments: db.appointments });
});

app.put('/admin/api/appointments/:id/status', (req, res) => {
    const { status } = req.body;
    const updated = db.updateAppointmentStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, appointment: updated });
});

app.delete('/admin/api/appointments/:id', (req, res) => {
    const ok = db.deleteAppointment(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
});

// ─── Messages ──────────────────────────────────────────────
app.get('/admin/api/messages', (req, res) => {
    res.json({ success: true, messages: db.messages });
});

app.put('/admin/api/messages/:id/read', (req, res) => {
    const msg = db.markMessageRead(req.params.id);
    if (!msg) return res.status(404).json({ success: false });
    res.json({ success: true, message: msg });
});

// ─── Serve admin index for all admin/* routes ──────────────
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/admin/*', (req, res) => {
    const file = req.path.replace('/admin/', '');
    const filePath = path.join(__dirname, 'public', file);
    res.sendFile(filePath, (err) => {
        if (err) res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
});

app.listen(PORT, () => {
    console.log(`\n🏥 HMS Admin Panel running at → http://localhost:${PORT}/admin`);
    console.log(`   Login: heena@admin.com / 1234\n`);
});

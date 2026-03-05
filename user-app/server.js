// ============================================================
// user-app/server.js - Patient Portal Server (Port 3000)
// ============================================================
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../shared/data');

const app = express();
const PORT = 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Auth Routes ──────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.getUserByEmail(email);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    if (user.password !== password) return res.status(401).json({ success: false, message: 'Invalid password' });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser, token: 'demo-token-' + user.id });
});

// ─── Patient Profile Update ───────────────────────────────────
app.put('/api/patients/:id', (req, res) => {
    const { name, phone, dob, bloodGroup, gender, address, emergencyContact } = req.body;
    const updated = db.updateUser(req.params.id, { name, phone, dob, bloodGroup, gender, address, emergencyContact });
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
    const { password: _, ...safeUser } = updated;
    res.json({ success: true, user: safeUser });
});

app.post('/api/auth/update-profile', (req, res) => {
    const { userId, name, phone, dob, bloodGroup, address } = req.body;
    const updated = db.updateUser(userId, { name, phone, dob, bloodGroup, address });
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
    const { password: _, ...safeUser } = updated;
    res.json({ success: true, user: safeUser });
});

// ─── Doctor Routes ────────────────────────────────────────────
app.get('/api/doctors', (req, res) => {
    res.json({ success: true, doctors: db.doctors });
});

app.get('/api/doctors/:id', (req, res) => {
    const doc = db.getDoctorById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor: doc });
});

// ─── Appointment Routes ───────────────────────────────────────
app.get('/api/appointments', (req, res) => {
    const id = req.query.userId || req.query.patientId;
    const data = id
        ? db.appointments.filter(a => a.userId === id || a.patientId === id)
        : db.appointments;
    res.json({ success: true, appointments: data });
});

app.post('/api/appointments', (req, res) => {
    const { userId, patientId, patientName, patientEmail, doctorId, date, time, reason } = req.body;
    const doctor = db.getDoctorById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    if (!date) return res.status(400).json({ success: false, message: 'Please select a date' });
    const ap = db.addAppointment({
        userId: userId || patientId,
        patientId: userId || patientId,
        patientName, patientEmail,
        doctorId, doctorName: doctor.name,
        specialization: doctor.specialization,
        date, time, reason
    });
    res.json({ success: true, appointment: ap });
});

app.delete('/api/appointments/:id', (req, res) => {
    const ok = db.deleteAppointment(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
});

// ─── Prescriptions ────────────────────────────────────────────
app.get('/api/prescriptions', (req, res) => {
    const id = req.query.userId || req.query.patientId;
    const rxs = id
        ? db.prescriptions.filter(p => p.userId === id || p.patientId === id)
        : db.prescriptions;
    res.json({ success: true, prescriptions: rxs });
});

app.get('/api/prescriptions/:patientId', (req, res) => {
    const rxs = db.prescriptions.filter(
        p => p.patientId === req.params.patientId || p.userId === req.params.patientId
    );
    res.json({ success: true, prescriptions: rxs });
});

// ─── Messages ─────────────────────────────────────────────────
app.post('/api/messages', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, message: 'All fields required' });
    const msg = db.addMessage({ name, email, subject: subject || 'General Inquiry', message });
    res.json({ success: true, message: 'Message sent successfully', data: msg });
});

// ─── Serve HTML pages; fallback to index ─────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🏥 HMS Patient Portal running at → http://localhost:${PORT}`);
    console.log(`   Login: heena@user.com / 1234\n`);
});

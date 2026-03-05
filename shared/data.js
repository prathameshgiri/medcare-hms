// ============================================================
// shared/data.js  –  File-based shared data store
// Both user-app and admin-app read/write the SAME db.json
// so changes made in one process show up in the other instantly.
// ============================================================
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_FILE = path.join(__dirname, 'db.json');

// ── Read the JSON file fresh on every call ─────────────────────
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    console.error('❌ Cannot read db.json:', e.message);
    return { users: [], admins: [], doctors: [], appointments: [], messages: [], prescriptions: [] };
  }
}

// ── Write the full object back to disk ─────────────────────────
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ── Proxy-like accessors so existing code (db.users, etc.) works
// We re-export live getters instead of static arrays.
module.exports = {

  // ── Collections (read fresh every time) ──────────────────────
  get users() { return readDB().users; },
  get admins() { return readDB().admins; },
  get doctors() { return readDB().doctors; },
  get appointments() { return readDB().appointments; },
  get messages() { return readDB().messages; },
  get prescriptions() { return readDB().prescriptions; },

  // ── User helpers ──────────────────────────────────────────────
  getUserByEmail(email) {
    return readDB().users.find(u => u.email === email);
  },
  getUserById(id) {
    return readDB().users.find(u => u.id === id);
  },
  updateUser(id, data) {
    const db = readDB();
    const i = db.users.findIndex(u => u.id === id);
    if (i === -1) return null;
    db.users[i] = { ...db.users[i], ...data };
    writeDB(db);
    return db.users[i];
  },

  // ── Admin helpers ─────────────────────────────────────────────
  getAdminByEmail(email) {
    return readDB().admins.find(a => a.email === email);
  },

  // ── Doctor helpers ────────────────────────────────────────────
  getDoctorById(id) {
    return readDB().doctors.find(d => d.id === id);
  },
  addDoctor(doc) {
    const db = readDB();
    doc.id = 'd' + uuidv4().slice(0, 8);
    db.doctors.push(doc);
    writeDB(db);
    return doc;
  },
  updateDoctor(id, data) {
    const db = readDB();
    const i = db.doctors.findIndex(d => d.id === id);
    if (i === -1) return null;
    db.doctors[i] = { ...db.doctors[i], ...data };
    writeDB(db);
    return db.doctors[i];
  },
  deleteDoctor(id) {
    const db = readDB();
    const i = db.doctors.findIndex(d => d.id === id);
    if (i === -1) return false;
    db.doctors.splice(i, 1);
    writeDB(db);
    return true;
  },

  // ── Appointment helpers ───────────────────────────────────────
  addAppointment(data) {
    const db = readDB();
    const ap = {
      id: 'ap' + uuidv4().slice(0, 8),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...data
    };
    db.appointments.push(ap);
    writeDB(db);
    return ap;
  },
  updateAppointmentStatus(id, status) {
    const db = readDB();
    const i = db.appointments.findIndex(a => a.id === id);
    if (i === -1) return null;
    db.appointments[i].status = status;
    writeDB(db);
    return db.appointments[i];
  },
  deleteAppointment(id) {
    const db = readDB();
    const i = db.appointments.findIndex(a => a.id === id);
    if (i === -1) return false;
    db.appointments.splice(i, 1);
    writeDB(db);
    return true;
  },

  // ── Message helpers ───────────────────────────────────────────
  addMessage(data) {
    const db = readDB();
    const msg = {
      id: 'm' + uuidv4().slice(0, 8),
      status: 'unread',
      read: false,
      createdAt: new Date().toISOString(),
      ...data
    };
    db.messages.push(msg);
    writeDB(db);
    return msg;
  },
  markMessageRead(id) {
    const db = readDB();
    const i = db.messages.findIndex(m => m.id === id);
    if (i === -1) return null;
    db.messages[i].status = 'read';
    db.messages[i].read = true;
    writeDB(db);
    return db.messages[i];
  },

  // ── Stats ─────────────────────────────────────────────────────
  getStats() {
    const db = readDB();
    return {
      totalPatients: db.users.length,
      totalAppointments: db.appointments.length,
      activeDoctors: db.doctors.filter(d => d.available).length,
      pendingAppointments: db.appointments.filter(a => a.status === 'Pending').length,
      unreadMessages: db.messages.filter(m => !m.read || m.status === 'unread').length
    };
  }
};

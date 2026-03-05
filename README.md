# 🏥 MedCare HMS — Hospital Management System

<div align="center">

![MedCare HMS](https://img.shields.io/badge/MedCare-HMS-0096c7?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTI0IDEwdjI4TTEwIDI0aDI4IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**A full-featured Hospital Management System with a modern patient portal and a real-time admin panel.**

*College Project — Developed for Heena Bagwan*

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Login Credentials](#-login-credentials)
- [How to Use](#-how-to-use)
- [Screenshots](#-screenshots)
- [Developer](#-developer)

---

## 🌟 About the Project

**MedCare HMS** is a complete Hospital Management System built as a college project. It consists of two separate web applications:

1. **Patient Portal** (`localhost:3000`) — A modern, website-style interface where patients can:
   - Browse doctors by specialization
   - Book and manage appointments
   - View prescriptions
   - Send messages to the hospital
   - Manage their profile

2. **Admin Panel** (`localhost:3001/admin`) — A professional dashboard for hospital administrators to:
   - View and approve/reject appointments in **real-time**
   - Manage doctors (add, edit, delete)
   - Read and respond to patient messages in **real-time**
   - Monitor key hospital statistics

Both portals share the **same persistent data store**, so when a patient books an appointment, the admin sees it appear on their dashboard within 5 seconds — **no page refresh needed**.

---

## ✨ Features

### 👤 Patient Portal
| Feature | Description |
|---------|-------------|
| 🏠 **Homepage** | Modern landing page with specialties, doctors, features & contact |
| 🔐 **Login** | Secure patient login with session persistence |
| 📅 **Appointments** | Book, view & cancel appointments with animated hero section |
| 👨‍⚕️ **Find Doctors** | Search & filter doctors by name and specialization |
| 💊 **Prescriptions** | View all prescriptions with medicine details |
| 📨 **Contact** | Send messages to the hospital with pre-filled user info |
| 👤 **Profile** | Edit personal info (name, phone, DOB, blood group, address) |

### 🔧 Admin Panel
| Feature | Description |
|---------|-------------|
| 📊 **Live Dashboard** | Real-time stats — patients, doctors, appointments, messages |
| ⏳ **Pending Approvals** | Yellow alert card with inline ✅ Confirm / ❌ Reject buttons |
| 📋 **Appointments** | Full appointment table with approve/reject/delete; live polling |
| 👨‍⚕️ **Doctors** | Add, edit, toggle availability, delete doctors |
| 👥 **Patients** | View all registered patients |
| 📨 **Messages** | Read patient messages, mark as read; live unread badge |
| 🟢 **LIVE Badge** | Pulsing indicator showing the admin panel is polling for updates |

### 🔄 Real-time Sync
- The patient portal and admin panel share a **single JSON file** (`shared/db.json`) as the data store
- Both Node.js servers read/write the same file — **true live sync across processes**
- Admin dashboard auto-refreshes every **5 seconds** with toast notifications for new events

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js + Express.js |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript |
| **Data Storage** | Shared JSON file (`shared/db.json`) |
| **Fonts** | Google Fonts — Inter |
| **Icons** | Inline SVG |
| **Process Manager** | `concurrently` (runs both servers together) |

---

## 📁 Project Structure

```
hospital-management/
│
├── shared/
│   ├── data.js          # File-backed data layer (read/write db.json)
│   └── db.json          # Shared persistent database (JSON file)
│
├── user-app/            # Patient Portal — Port 3000
│   ├── server.js        # Express server for patient API
│   └── public/
│       ├── index.html       # Homepage
│       ├── login.html       # Patient login
│       ├── appointments.html
│       ├── doctors.html
│       ├── prescriptions.html
│       ├── contact.html
│       ├── profile.html
│       ├── dashboard.html   # Redirects to appointments
│       ├── css/
│       │   └── style.css    # Main website stylesheet
│       └── js/
│           └── auth.js      # Shared auth helpers + navbar renderer
│
├── admin-app/           # Admin Panel — Port 3001
│   ├── server.js        # Express server for admin API
│   └── public/
│       ├── index.html       # Admin login
│       ├── dashboard.html   # Live dashboard with pending approvals
│       ├── appointments.html
│       ├── doctors.html
│       ├── patients.html
│       ├── messages.html
│       ├── css/
│       │   └── admin.css    # Admin panel stylesheet
│       └── js/
│           └── auth.js      # Admin auth helpers
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** v16 or higher — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation

1. **Clone or download the project:**
   ```bash
   git clone <repo-url>
   cd hospital-management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start both servers:**
   ```bash
   npm start
   ```
   This runs both the patient portal and admin panel simultaneously using `concurrently`.

4. **Open in browser:**
   | Portal | URL |
   |--------|-----|
   | 🏥 Patient Portal | http://localhost:3000 |
   | 🔧 Admin Panel | http://localhost:3001/admin |

---

## 🔑 Login Credentials

### Patient Portal (`localhost:3000`)

| Field | Value |
|-------|-------|
| **Email** | `heena@user.com` |
| **Password** | `1234` |

### Admin Panel (`localhost:3001/admin`)

| Field | Value |
|-------|-------|
| **Email** | `heena@admin.com` |
| **Password** | `1234` |

> **Note:** Data is stored in `shared/db.json`. Any changes (new appointments, messages, etc.) are persisted between server restarts.

---

## 📖 How to Use

### As a Patient

1. Go to **http://localhost:3000** and explore the homepage
2. Click **Sign In** and log in with the patient credentials above
3. You'll land on the **My Appointments** page
4. Click **+ Book Appointment** → select a doctor, date, time and reason → **Confirm Booking**
5. The appointment appears in your list with **Pending** status
6. *(Admin must approve it — see below)*
7. Once approved, the status updates to **Approved** ✅

### As an Admin

1. Go to **http://localhost:3001/admin** and log in with admin credentials
2. The **Dashboard** auto-refreshes every 5 seconds
3. When a patient books → a **yellow "Pending Approvals"** card appears
4. Click **✅ Confirm** to approve or **❌ Reject** to decline — right from the dashboard
5. Go to **Messages** to read and respond to patient contact forms
6. Manage doctors in the **Doctors** section

---

## 🖥 Screenshots

| Page | Description |
|------|-------------|
| Patient Homepage | Modern website with hero, specialties, doctors, CTA |
| Patient Appointments | Animated hero with stat cards + appointment list |
| Admin Dashboard | Live stats, pending approvals, messages feed |
| Admin Appointments | Full table with approve/reject actions |

---

## 👨‍💻 Developer

<div align="center">

### Prathamesh Giri

*Full Stack Web Developer*

[![Portfolio](https://img.shields.io/badge/Portfolio-prathameshgiri.in-0096c7?style=for-the-badge&logo=google-chrome&logoColor=white)](https://prathameshgiri.in/)
[![Projects](https://img.shields.io/badge/Projects-build.prathameshgiri.in-2a9d8f?style=for-the-badge&logo=github&logoColor=white)](https://build.prathameshgiri.in/)

</div>

| | |
|--|--|
| 🌐 **Website** | [prathameshgiri.in](https://prathameshgiri.in/) |
| 🚀 **Build Portfolio** | [build.prathameshgiri.in](https://build.prathameshgiri.in/) |

---

### 🎓 Project Information

| | |
|--|--|
| **Project Type** | College Final Project |
| **Developed For** | Heena Bagwan |
| **Developed By** | Prathamesh Giri |
| **Category** | Hospital Management System |

---

<div align="center">

Made by **[Prathamesh Giri](https://prathameshgiri.in/)** for **Heena Bagwan**

*MedCare HMS — Your Health, Our Priority*

</div>

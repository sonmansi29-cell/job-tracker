# 💼 Job Tracker

A full-stack job application tracking system built with React and Django. Keep all your job applications organized in one place.

---

## 🎯 About This Project

I created this tool to manage my own job search. When you're applying to dozens of positions, keeping track of where you applied, interview dates, and company research becomes overwhelming. This dashboard solves that problem.

---

## ✨ Features

### 📊 Dashboard
- View all job applications at a glance
- See statistics for each status category
- Visual donut chart showing your status breakdown

### 📝 Job Management
- Add new job applications in seconds
- Edit or delete existing entries
- Track status: Applied → Interview → Offer → Rejected

### ⏰ D-Day Tracker
- Set countdown timers for important dates
- Color-coded urgency (urgent, warning, normal)
- Never miss an interview or deadline

### 📋 Notes
- Write preparation notes for each interview
- Export notes as text files
- Notes save automatically to your browser

### 🔐 Account
- Secure JWT authentication
- Update profile anytime
- Password reset functionality

---

## 🛠 Tech Stack

**Frontend:** React, React Router, React ChartJS

**Backend:** Django, Django REST Framework, SQLite

**Auth:** JWT (JSON Web Tokens)

---

## 🚀 Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Server runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm start
```

App opens at `http://localhost:3000`

---

## 📁 Project Structure

```
job-tracker/
├── backend/
│   ├── backend/        # Django settings
│   ├── jobs/           # Job models & views
│   └── manage.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/ # DonutChart, NotesPanel, Toast
│   │   ├── pages/      # Login, Dashboard, Settings, etc.
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/token/` | POST | Get access & refresh tokens |
| `/api/token/refresh/` | POST | Refresh access token |
| `/api/register/` | POST | Create new account |

### Jobs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/job-apps/` | GET | List all applications |
| `/api/job-apps/` | POST | Add new application |
| `/api/job-apps/{id}/` | PUT | Update application |
| `/api/job-apps/{id}/` | DELETE | Remove application |

### User
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profile/` | GET | Get profile |
| `/api/profile/` | PUT | Update profile |
| `/api/profile/` | DELETE | Delete account |

---

## 🎨 Screenshots

### Dashboard
Your main hub showing all applications and statistics.

### Add Job
Quick form to add new applications to your tracker.

### D-Days
Countdown tiles for upcoming interviews and deadlines.

### Settings
Manage your profile and account preferences.

---

## 🔒 Security Features

- Passwords hashed securely with Django hasher
- JWT tokens for API authentication
- Protected routes redirect to login
- CORS configured for safe frontend-backend communication

---

## ⚠️ Current Limitations

- Data stored locally on your device
- No email notifications yet
- No export to PDF or CSV (yet)
- Single user per installation

---

**Good luck with your job search!** 🍀

Built with ❤️ using React + Django


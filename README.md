# 🎬 CineScope Capstone

## Movies & Webseries Review and Rating Platform

CineScope is a full-stack web application that allows users to discover movies and webseries, view content details, rate titles, and share reviews.

The project is developed as a capstone project with a modern frontend, RESTful backend APIs, database integration, and secure user authentication.

---

## 🚀 Phase 1 MVP

The current Phase 1 implementation includes:

- 👤 User Registration
- 🔐 User Login
- 🔑 JWT Authentication
- 🎬 Movies & Webseries Content Management
- ⭐ Rating System
- 📝 Review System
- 📋 Display Reviews
- 🗄️ Database Integration
- 🌐 REST API
- 🎨 Dark-themed CineScope UI
- 🔗 Frontend and Backend Integration

---

## 🛠️ Technology Stack

### Frontend

- React.js
- JavaScript
- Vite
- CSS
- Axios

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

### Database

- Relational Database
- SQLAlchemy ORM

### Development Tools

- Visual Studio Code
- Git
- GitHub
- FastAPI Swagger UI

---

## 📂 Project Structure

```text
CineScope-Capstone/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── content.py
│   │   │   ├── dependencies.py
│   │   │   ├── ratings.py
│   │   │   └── reviews.py
│   │   │
│   │   ├── core/
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   │
│   │   ├── models/
│   │   │   ├── content.py
│   │   │   ├── content_genre.py
│   │   │   ├── genre.py
│   │   │   ├── rating.py
│   │   │   ├── review.py
│   │   │   ├── user.py
│   │   │   └── watchlist.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── content.py
│   │   │   ├── rating.py
│   │   │   └── review.py
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── content_service.py
│   │   │   ├── rating_service.py
│   │   │   └── review_service.py
│   │   │
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md

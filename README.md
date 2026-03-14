# MedicPulse Hospital Appointment Management System

MedicPulse is a hospital appointment management platform designed to streamline interactions between patients, doctors, and administrators.

The system allows appointment booking, doctor schedule management, consultation tracking, and hospital analytics through a role-based dashboard system.

The project uses **React + TypeScript for the frontend**, **FastAPI for the backend**, and **MongoDB as the database**.

---

## System Portals

### Patient Portal

Patients can manage their appointments and personal records.

Features:
- Patient dashboard
- Book doctor appointments
- View upcoming appointments
- Visit history
- Profile management
- Notifications

---

### Doctor Portal

Doctors can manage consultations and patient records.

Features:
- Doctor dashboard
- Daily schedule
- Patient list
- Consultation notes
- Prescription interface
- Availability management

---

### Admin Portal

Administrators manage the hospital system.

Features:
- Admin dashboard
- Doctor management
- Patient management
- Appointment management
- Doctor schedule configuration
- Hospital analytics

---

## Technology Stack

### Frontend
- React
- TypeScript
- React Router
- Modern CSS UI components

### Backend
- FastAPI
- Python
- JWT Authentication
- REST API Architecture

### Database
- MongoDB

---

## Project Structure

hospital_project
│
├── frontend
│ └── src
│ ├── components
│ ├── pages
│ │ ├── public
│ │ ├── patient
│ │ ├── doctor
│ │ └── admin
│ ├── services
│ ├── styles
│ └── App.tsx
│
├── backend
│ └── app
│ ├── main.py
│ ├── routes
│ │ ├── auth.py
│ │ ├── doctors.py
│ │ ├── patients.py
│ │ └── appointments.py
│ ├── models
│ ├── services
│ └── utils
│
├── database
│ └── mongodb.py
│
├── README.md
└── requirements.txt

---

## System Architecture

Frontend (React + TypeScript)
│
│ REST API
▼
Backend (FastAPI)
│
│ Database Queries
▼
MongoDB Database

---

## Backend API Endpoints

### Authentication

POST /api/auth/register
POST /api/auth/login


### Patients


GET /api/patients
GET /api/patients/{id}
POST /api/patients


### Doctors


GET /api/doctors
GET /api/doctors/{id}


### Appointments


POST /api/appointments
GET /api/appointments


### Doctor Slots


POST /api/doctor-slots
GET /api/doctor-slots


---

## Appointment Booking Logic

The system uses a slot-based appointment system.

1. Doctors define available time slots.
2. Patients select available slots.
3. The system prevents duplicate bookings.
4. Once booked, the slot becomes unavailable.

---

## How to Run the Project

### Backend Setup

Install dependencies


pip install fastapi uvicorn pymongo python-jose passlib

Run backend server
uvicorn app.main:app --reload

Backend runs at
http://127.0.0.1:8000


---

### Frontend Setup

Go to frontend folder
cd frontend

Install dependencies
npm install

Start frontend server
npm run dev

Frontend runs at
http://localhost:5173

---

## Future Enhancements

- Smart appointment prioritization
- Doctor workload analytics
- PDF prescription generation
- Real-time notifications
- Telemedicine integration

---

## Contributors
  
Deepti Sree — Landing Pages  
Revathi — Patient Portal  
Chilakamma — Appointment UI  
Mounika — Doctor Portal  
Sathish — Admin Portal
Lokeshwar Reddy — Backend and System Architecture

# Hospital Appointment & Records System

## 1. Project Title
**Hospital Appointment & Records System**

---

## 2. Problem Statement
Hospitals often manage appointments manually or using fragmented systems. This can lead to scheduling conflicts, inefficient patient management, and difficulty tracking visit history.

Patients frequently face issues such as long waiting times, lack of clarity in appointment availability, and difficulty accessing their previous visit information.

This system provides a digital hospital management solution where patients can easily book appointments, doctors can manage their schedules, and administrators can monitor hospital activity through dashboards and analytics.

---

## 3. Objectives

The primary objectives of the system are:

- Provide a digital platform for patients to register and book appointments
- Enable doctors to manage appointments and view patient visit history
- Allow administrators to manage doctors and monitor system activity
- Improve appointment scheduling efficiency
- Provide analytics dashboards for hospital insights
- Enable scalable frontend architecture using React for dynamic functionality
- Support API-driven communication between frontend and backend systems
---

## 4. User Roles

The system supports three main user roles:

### Patient
- Register and create an account
- Login to the system
- View available doctors
- Book appointments based on available time slots
- View visit history

### Doctor
- Login to the system
- View scheduled appointments
- Manage working schedule
- Access patient visit history
- Apply for leave on specific days

### Admin
- Register doctors in the system
- Manage doctor profiles
- Approve or reject doctor leave requests
- Cancel appointment slots when doctors are unavailable
- View system analytics dashboards

---

## 5. Appointment Scheduling Logic

- Each doctor has fixed working hours defined by the hospital.
- Within those hours, appointments are divided into time slots based on the average consultation duration per patient.
- Patients can:
  - Select a doctor
  - View available slots
  - Book an appointment.

### Special Cases

- If a doctor applies for leave, the request must be approved by the admin.
- Once approved:
  - The admin can cancel all appointment slots for that doctor on that day.
  - Patients with booked appointments may be notified or rescheduled.

---

## 6. Key Features

### Patient Features
- Patient registration and authentication
- Doctor browsing
- Appointment booking
- Appointment status tracking
- Visit history viewing

### Doctor Features
- Secure doctor login
- Appointment schedule view
- Patient visit history
- Leave request submission

### Admin Features
- Doctor registration and management
- Leave request approval system
- Appointment slot cancellation
- Hospital activity analytics

### Dashboard Features
- Total number of patients
- Total number of doctors
- Number of appointments per day
- Doctor-wise appointment statistics
- Graphical charts for hospital activity

---

## 7. Technologies Used

### Frontend
- React.js
- TypeScript

### Backend
- Python
- Flask
Handles:
  - Authentication
  - API services
  - Appointment management logic
  - Data processing

### Database
- MongoDB
Stores:
  - Patient records
  - Doctor profiles
  - Appointment details
  - Visit history


---

## 8. System Architecture Overview

1. **Frontend Layer**
  Implemented using React.js, which provides:
  - Component-based UI
  - Dynamic page rendering
  - API integration with backend services

2. **Backend Layer**
   - Flask server processes requests.
   - Handles authentication, appointment logic, and API responses.

3. **Database Layer**
   - MongoDB stores:
     - patient records
     - doctor profiles
     - appointment data
     - visit history

---

## 9. Future Enhancements

Potential improvements to the system include:

- Online prescription management
- SMS or email appointment notifications
- Online payment for appointments
- Telemedicine consultation support
- AI-based appointment optimization

---

## 10. Expected Outcome

The system will provide a functional hospital appointment management prototype where patients can easily book appointments, doctors can manage schedules, and administrators can monitor hospital activity through an analytics dashboard.

This project demonstrates the practical application of web technologies for real-world healthcare workflow management.


# 11. Repository Structure

hospital_project
│
├── frontend
│   ├── css
│   ├── js
│   ├── components
│   └── pages
│
├── backend
│   ├── app.py           # Application Entry points
│   ├── config/          # Configurations
│   ├── routes/          # API Blueprints
│   ├── models/          # Schema definitions
│   └── utils/           # Shared helpers
│
├── database
│   └── db.py            # MongoDB connection
│
├── README.md
└── .gitignore
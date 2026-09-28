# ComplaintEase

A full-stack complaint management system.

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT auth
- **Frontend**: React (Vite), React Router, Axios

## Features
- User registration & login (JWT-based)
- Users can file complaints and see only their own
- Admins can see all complaints, update status, and add remarks
- Complaint owners can delete their own complaint while it's still "Pending"

## Project structure
```
ComplaintEase/
├── backend/     - Express REST API
└── frontend/    - React (Vite) client
```

## Screenshots
### Login Page
![Admin Login Page](screenshots/adminLoginPage.png)
![User Login Page](screenshots/UserLoginPage.png)

### Dashboard
![Admin Dashboard Page](screenshots/AdminDashboard.png)
![User Dashboard Page](screenshots/UserDashboard.png)

### All Complaints
![All Complaints](screenshots/AllComplaints.png)


### My Complaints
![My Complaints](screenshots/MyComplaints.png)

### Profile & Settings
![Profile & Settings](screenshots/Profile&Settings.png)

See the setup guide provided alongside this project for step-by-step run instructions.

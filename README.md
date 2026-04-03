# Car Rental Agency

A full-stack web application for managing car rentals. Agencies can list and manage their fleet, customers can browse and book vehicles.

**Live Demo:** https://car-rental-agency-sage.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | MySQL (Aiven cloud) |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (frontend), Render (backend) |

---

## Features

**Customers**
- Register and log in
- Browse all available cars (public, no login required)
- Book a car by selecting start date and number of days
- View booking history with total cost

**Agencies**
- Register and log in
- Add new vehicles to their fleet (model, registration number, seating capacity, rent/day)
- Edit and delete their vehicles
- View all bookings made by customers for their fleet with revenue tracking

---

## Project Structure

```
Car Agency/
├── Backend/
│   ├── config/
│   │   └── db.js              # MySQL connection pool (SSL enabled)
│   ├── middleware/
│   │   └── auth.js            # JWT verify + role guard
│   ├── routes/
│   │   ├── authRoutes.js      # Register, Login
│   │   ├── carRoutes.js       # CRUD for cars
│   │   └── bookingRoutes.js   # Rent car, view bookings
│   ├── schema.sql             # Database schema
│   ├── index.js               # Express app entry point
│   └── .env                   # Environment variables
│
└── Frontend/
    ├── src/
    │   ├── components/        # Navbar, Toast, CarCard, EditCarModal, ProtectedRoute
    │   ├── context/           # AuthContext (global user state)
    │   ├── pages/             # Home, Login, Register, AvailableCars, AddCar, BookedCars, MyBookings
    │   ├── routes/            # AppRoutes.jsx
    │   └── services/          # authService.js, carService.js (API calls)
    └── .env                   # VITE_API_URL
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MySQL 8+ running locally

### 1. Clone the repo

```bash
git clone <your-repo-url>
```

### 2. Set up the database

Connect to your local MySQL and run the schema:

```bash
mysql -u root -p < Backend/schema.sql
```

### 3. Configure Backend

Create `Backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=car_rental_agency
JWT_SECRET=your_secret_key
ALLOWED_ORIGINS=http://localhost:5173
```

### 4. Start the Backend

```bash
cd Backend
npm install
npm run dev
```

### 5. Configure Frontend

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 6. Start the Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Database Schema

```sql
users     — id, name, email, password, role (customer | agency)
cars      — id, agency_id, model, number, capacity, rent, image
bookings  — id, car_id, customer_id, start_date, days, total_rent
```

---

## Deployment

### Backend → Render

1. Push `Backend/` to GitHub
2. New Web Service on Render → connect repo
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add environment variables:

```env
DB_HOST=your-aiven-host
DB_PORT=16506
DB_USER=avnadmin
DB_PASS=your_db_password
DB_NAME=defaultdb
JWT_SECRET=your_secret_key
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend → Vercel

1. Push `Frontend/` to GitHub
2. New Project on Vercel → connect repo
3. Add environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com
```

### Database → Aiven MySQL

1. Create a MySQL service on [console.aiven.io](https://console.aiven.io)
2. Run the schema on the remote DB:

```bash
& "C:\Program Files\MySQL\MySQL Server 9.6\bin\mysql.exe" --user=avnadmin --password=YOUR_PASS --host=YOUR_HOST --port=16506 --ssl-mode=REQUIRED defaultdb < Backend/schema.sql
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register customer or agency |
| POST | `/api/auth/login` | Public | Login, returns JWT |

### Cars
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/cars` | Public | Get all available cars |
| GET | `/api/cars/my-cars` | Agency | Get agency's own cars |
| POST | `/api/cars/add` | Agency | Add a new car |
| PUT | `/api/cars/edit/:id` | Agency | Edit a car |
| DELETE | `/api/cars/delete/:id` | Agency | Delete a car |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bookings/rent` | Customer | Book a car |
| GET | `/api/bookings/my-bookings` | Customer | Get customer's bookings |
| GET | `/api/bookings/agency` | Agency | Get all bookings for agency's fleet |

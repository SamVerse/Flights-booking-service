
# 🎫 Flight Booking Service - `flight-booking-service`

## Overview
The **Flight Booking Service** is responsible for the end-to-end process of **booking flights**, managing **seats**, **transactions**, and ensuring **data consistency** using real-world techniques such as **race condition handling**, **ACID properties**, **transactions**, and **idempotency**.

This service communicates with the [Flights Service](https://github.com/SamVerse/Airport-service-backend) to fetch and validate flight details.

---

## ✨ Features

- Book flights
- Handle seat availability with race condition protection
- Enforce ACID principles using Sequelize transactions
- Implement idempotent API methods (to handle retry/payment edge cases)
- Cron jobs to auto-expire stale bookings
- Detailed error handling with status codes and custom messages
- Winston-based logging system

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- SQL (MySQL/PostgreSQL)
- Axios (for inter-service communication)
- Cron (for periodic tasks)
- Winston (logging)
- MVC + Service-Repository Pattern

---

## 🧠 Real-World Engineering Concepts Implemented

- Microservices architecture
- Race condition handling for concurrent seat bookings
- Idempotency in payments
- Cron jobs for data cleanup
- Error handling middleware
- Logging via Winston

---

## 📁 Folder Structure

```
flight-booking-service/
├── controllers/
├── services/
├── repositories/
├── models/
├── routes/
├── middlewares/
├── jobs/
└── config/
```

---

## 🔌 Inter-Service Communication

The booking service interacts with the [Flights Service](https://github.com/SamVerse/Airport-service-backend) to fetch flight and airport data. Axios is used for internal HTTP API calls.

---

## 📜 Setup Instructions

```bash
# Clone the repo
git clone https://github.com/SamVerse/Flights-booking-service.git

# Install dependencies
cd flight-booking-service
npm install

# Setup .env file
cp .env.example .env

# Run migrations
npx sequelize db:migrate

# Start server
npm start
```

---

## 🧪 Testing

All endpoints can be tested using Postman. Each critical flow is documented and tested thoroughly.

---

## 🔗 Related Service

📡 Works with: [Flights Service](https://github.com/SamVerse/Airport-service-backend)

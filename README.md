# 🚀 AlturaWing Quiz

### Leadership Case Study & Interactive Assessment Platform

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-Backend-lightgrey)
![SQLite](https://img.shields.io/badge/Database-SQLite-blue)
![Deployed](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-Educational-orange)

---

## 🌐 Live Application

**Production URL:**
👉 [https://alturawing.tech](https://alturawing.tech)

Deployed on DigitalOcean with Nginx reverse proxy and HTTPS (Let’s Encrypt).

---

## 📌 Project Overview

AlturaWing Quiz is a full-stack educational web application built around a structured leadership case study on **Ratan Tata**, including insights from the **Tata Nano** initiative and global expansion strategy.

The platform combines:

* A leadership case study
* A 10-question analytical quiz
* Real-time evaluation
* Persistent result storage
* Administrative analytics dashboard

Designed and deployed for a live academic presentation handling concurrent users.

---

## 🧠 Core Capabilities

### 🎓 Educational Layer

* Case study content with contextual leadership framing
* Embedded multimedia references
* Structured assessment model

### 📝 Quiz Engine

* 10 MCQs (case-based + strategic leadership)
* Server-side grading logic
* Detailed per-question review
* Percentage scoring
* UUID-based result tracking

### 📊 Admin Analytics Dashboard

* Total submissions
* Average score
* Highest & lowest score
* Question-wise accuracy analysis
* Individual response inspection
* Data-driven insight visualization

---

## 🖥️ Application Screens

### 🏠 Landing Page

<img width="1919" height="964" alt="image" src="https://github.com/user-attachments/assets/8242b1df-3ed0-4b47-a1dd-5cde4bf9f62d" />

<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/61833270-8f91-4956-bd85-a4ec8a851e92" />

<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/7c0cb58e-9775-4ec3-87ad-a12b3c9781d7" />

### 📝 Quiz Interface

<img width="676" height="889" alt="image" src="https://github.com/user-attachments/assets/f0c0fe2e-4533-4ee2-abf9-b527753035b0" />

<img width="941" height="895" alt="image" src="https://github.com/user-attachments/assets/c79ef291-42a0-4540-b5cb-eb4524b9872d" />

<img width="926" height="898" alt="image" src="https://github.com/user-attachments/assets/0aa6a643-989d-4e25-987d-360248b7727c" />

<img width="924" height="903" alt="image" src="https://github.com/user-attachments/assets/f8bd5b36-e09b-47b0-a976-9bf713a7d4a5" />

### 📊 Admin Dashboard

<img width="1011" height="848" alt="image" src="https://github.com/user-attachments/assets/4d5a409f-1dbd-482a-a73c-9cb218315e23" />

<img width="956" height="901" alt="image" src="https://github.com/user-attachments/assets/341d70ee-e1aa-4d99-9c13-164a90ce7df6" />

---

## 🏗 System Architecture

```
Client (Browser)
      ↓
HTTPS (Nginx Reverse Proxy)
      ↓
Node.js (Express API)
      ↓
SQLite (WAL mode enabled)
```

---

## 🛠 Tech Stack

### Backend

* Node.js 18
* Express.js
* better-sqlite3
* UUID
* dotenv

### Database

* SQLite
* WAL mode enabled for concurrent write performance

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### Production Infrastructure

* Ubuntu (DigitalOcean Droplet)
* Nginx Reverse Proxy
* PM2 process management with auto-restart and background daemonization
* Let’s Encrypt SSL

---

## ⚙️ Local Development Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/AstroAirafar/alturawingquiz.git
cd alturawingquiz
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

```
PORT=3000
ADMIN_PASSWORD=your_secure_password
```

### 4️⃣ Start Application

```bash
npm start
```

Visit:

```
http://localhost:3000
```

---

## 🔐 Security Design

* Environment-based admin password configuration
* Token-based admin authentication middleware for protected API routes
* Server-side input validation and basic payload checks
* SQLite WAL mode enabled for improved concurrency and durability
* HTTPS enforced in production (HTTP → HTTPS 301 redirect via Nginx)
* .env excluded from version control via .gitignore

---

## 📈 Performance & Load Testing

Synthetic benchmarking performed using `autocannon`.

**Environment:**
DigitalOcean Droplet — 1 vCPU, 1GB RAM

### Read-heavy endpoint (`/api/quiz`)

**Direct Node (localhost):**

* ~1,300–1,400 requests/sec sustained
* p99 latency <75ms under 50 concurrent connections
* 0% error rate

**Production path (HTTPS via Nginx):**

* ~300 requests/sec sustained
* <1% timeout rate under 50 concurrent connections
* Avg latency ~116ms

---

## Concurrency Model

The system is optimized for:

* Read-heavy traffic
* Low-frequency write operations

The application was successfully used in a live academic presentation environment with concurrent users and operated without performance issues.

---

## 📊 Data Model

### responses Table

| Field        | Type                   | Description              |
| ------------ | ---------------------- | ------------------------ |
| id           | TEXT (UUID v4)         | Unique submission ID     |
| user_name    | TEXT                   | Participant name         |
| answers      | TEXT (JSON-serialized) | Serialized answer object |
| score        | INTEGER                | Correct answer count     |
| total        | INTEGER                | Total questions          |
| submitted_at | TEXT                   | Timestamp                |

---

## 🚀 Production Deployment Summary

Deployed on Ubuntu (DigitalOcean Droplet) with Nginx reverse proxy, PM2 process supervision, Let's Encrypt SSL, DNS configuration, firewall hardening, and pre-deployment load testing.

---

## 📁 Repository Structure

```
/public
  index.html
  quiz.html
  result.html
  admin.html
  /css
    style.css
  /images
server.js
package.json
package-lock.json
.gitignore
.env.example
README.md
```
---

## 🎯 Engineering Highlights

* Server-side grading logic
* Dynamic analytics computation
* Stateless API design
* Token-based admin authentication middleware
* Clean separation of frontend and backend logic
* Production-ready deployment workflow

---

## 📚 Educational Objectives

The platform evaluates understanding of:

* Transformational leadership
* Ethical governance
* Crisis management
* Strategic globalization
* Innovation under constraints

---

## 📜 License

Licensed under the MIT License.

---

## 👤 Author

Developed by AlturaWing  
GitHub: https://github.com/AstroAirafar

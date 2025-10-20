# 🌐 Portfolio

A **full-stack personal portfolio website** built with **Next.js**, **Express.js**, and **Prisma**.  
It includes secure authentication, a private dashboard, blog & project management, and a dynamic public-facing portfolio.

---

## 🚀 Project Overview

This project serves as a **personal developer portfolio** with both public and private sections.

### 🎯 Core Objectives

- **Public Site** – Visitors can explore the portfolio, blogs, and projects.
- **Private Dashboard** – Owner can log in securely and manage content (blogs, projects, profile).
- **Static + Dynamic Rendering** – Using Next.js **SSG**, **ISR**, and **SSR** for optimal performance.
- **Responsive UI** – Works seamlessly on desktop, tablet, and mobile.

---

## 🧩 Tech Stack

| Layer              | Technology                                                                   |
| ------------------ | ---------------------------------------------------------------------------- |
| **Frontend**       | [Next.js 14+ (App Router)](https://nextjs.org)                               |
| **Styling**        | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Language**       | TypeScript                                                                   |
| **Backend**        | [Express.js](https://expressjs.com)                                          |
| **Database**       | PostgreSQL with [Prisma ORM](https://www.prisma.io)                          |
| **Authentication** | JWT + bcrypt (secure password hashing)                                       |
| **Notifications**  | [Sonner](https://sonner.emilkowal.ski) or react-hot-toast                    |
| **Deployment**     | Vercel (Frontend) & Render/Heroku (Backend)                                  |

---

## ✨ Features

### 🔓 Public Pages

- **Home / About Me** – Displays bio, skills, experience, and contact info.
- **Projects Showcase** – Lists all personal projects with live and source links.
- **Blog System** – Dynamic blogs with individual post pages.
- **SEO + ISR** – Pre-rendered with incremental static regeneration for performance.

### 🔒 Private (Admin Dashboard)

- **Authentication (JWT-based)** – Only the portfolio owner can access the dashboard.
- **Blog Management (CRUD)**
- **Project Management**
- **Profile Editor**
- **Analytics Section**

---

## 🧠 System Architecture

```bash
frontend/ (Next.js)
│
├── app/
│   ├── (public)        # About, Projects, Blogs
│   ├── dashboard/      # Admin dashboard (private routes)
│   ├── api/            # API routes (NextAuth, etc.)
│
├── components/         # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── modules/        # Domain-specific components
│
├── lib/                # Utilities (auth, fetchers, etc.)
├── prisma/             # Schema & client setup
└── public/             # Static assets

```

## 🧱 Installation & Setup

# 1️⃣ Clone the repository

git clone https://github.com/yourusername/b5a7-portfolio.git
cd b5a7-portfolio

# 2️⃣ Install dependencies

npm install

or

yarn install

## 3️⃣ Setup environment variables

### Create a .env file in both frontend and backend folders:

```bash
### .env (Frontend)

NEXT_PUBLIC_API_BASE=http://localhost:5000/api
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

```bash
# .env (Backend)

DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4️⃣ Setup Prisma

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5️⃣ Run both servers

```bash
# Backend

npm run dev

# http://localhost:5000

# Frontend

npm run dev

# http://localhost:3000
```

## 🔐 Authentication Flow

```bash
1️⃣ The admin logs in via email/password or Google OAuth.
2️⃣ Backend validates credentials using bcrypt.compare.
3️⃣ JWT is issued and stored client-side via cookies/session.
4️⃣ Authenticated requests include JWT for dashboard actions.
```

## 🧠 Bonus Implementations

```bash
✅ Rich Text Editor using React Quill for blogs.
✅ Dynamic About Panel (SSG + randomized covers).
✅ Lazy Image Loading and Smooth Transitions.
✅ Strict Error Handling & Form Validation.
✅ Toast notifications (Sonner).
✅ Responsive Dashboard with shadcn/ui.

```

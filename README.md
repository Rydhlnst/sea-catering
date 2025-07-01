# 🥗 SEA Catering – Healthy Meal Subscription Platform

SEA Catering is a modern catering subscription platform for delivering fresh and healthy meals with customizable options and admin dashboard.

---

## 🚀 Features

- 🍱 Personalized meal subscriptions (Diet, Protein, Royal)
- 📆 Choose delivery days and meal times
- 📦 Real-time subscription management (pause, resume, cancel)
- 👨‍🍳 Admin dashboard for managing plans and users
- 🔐 Secure authentication via Google and GitHub
- 📱 Fully responsive UI (mobile-first)

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, TypeScript, ShadCN UI
- **Backend:** Next.js (Server Actions + API routes)
- **Database:** MongoDB with Mongoose
- **Authentication:** Auth.js (OAuth with Google & GitHub)
- **Deployment:** Vercel

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/seacatering.git
cd seacatering

npm install

cp .env.example .env

# .env.example

DATABASE_URL=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

npm run dev
Visit http://localhost:3000

# Create an Admin Account
- Login to your MongoDB Atlas or Compass.
- Go to the users collection.
- Find the user you want to promote and update the role to "admin".
{
  "email": "admin@seacatering.com",
  "role": "admin"
}


# Folder Structure
.
├── app/                      # App Router structure
├── components/              # UI components
├── lib/                     # Utilities, auth, database
├── models/                  # Mongoose models
├── public/                  # Static assets
├── .env.example             # Example environment variables
├── next.config.js
└── README.md

MIT 
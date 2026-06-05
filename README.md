# Connectify 🚀

Connectify is a modern, real-time chat application designed with a sleek dark theme and glassmorphic UI. It features real-time instant messaging, online/offline status tracking, user search, and secure cookie-based cross-domain authentication.

## 🔗 Live Deployments

*   **Frontend (Vercel):** [https://connectify-ayush.vercel.app](https://connectify-ayush.vercel.app)
*   **Backend (Render):** [https://connectify-ozds.onrender.com](https://connectify-ozds.onrender.com)

---

## ✨ Features

*   💬 **Real-time Messaging:** Messages are sent and received instantly using WebSockets via `Socket.io`.
*   🟢 **Online Status Indicator:** Real-time visibility of online and offline users.
*   🔍 **User Search:** Search and connect with new users instantly.
*   🔒 **Secure Authentication:** JWT-based login and signup using secure, HttpOnly, SameSite cross-domain cookies.
*   🎨 **Sleek UI/UX:** Responsive layout with vibrant colors, micro-animations, and glassmorphic aesthetics built using React and TailwindCSS.

---

## 🛠️ Tech Stack

### Frontend
*   **Core:** React 19, JavaScript
*   **Styling:** TailwindCSS
*   **State Management:** Zustand
*   **Routing:** React Router DOM
*   **WebSockets:** Socket.io-client
*   **HTTP Requests:** Axios

### Backend
*   **Core:** Node.js, Express
*   **Database:** MongoDB (via Mongoose)
*   **Authentication:** JWT, bcryptjs, cookie-parser
*   **WebSockets:** Socket.io

---

## 📂 Project Structure

```text
├── backend/                  # Express server & WebSocket handlers
│   ├── Controllers/          # Request handlers
│   ├── DB/                   # MongoDB connection logic
│   ├── Models/               # Mongoose schemas
│   ├── routes/               # Express API endpoints
│   ├── socket/               # Socket.io setup & tracking
│   ├── utils/                # JWT cookie helper utilities
│   └── index.js              # Server entry point
│
├── frontend/                 # Vite + React client app
│   ├── src/
│   │   ├── components/       # Shared React components (ChatWindow, Sidebar, etc.)
│   │   ├── pages/            # Page components (LoginPage, RegisterPage, etc.)
│   │   ├── store/            # Zustand state stores (Auth, Chat, Socket)
│   │   └── App.jsx           # Main React App router component
│   ├── vercel.json           # Vercel SPA redirect config
│   └── vite.config.js        # Vite & local proxy configuration
```

---

## 🚀 Running Locally

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone https://github.com/Ayushsoni9125/Connectify.git
cd Connectify
```

### 2. Configure Environment Variables

Create a `.env` file in the **root** folder:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Create a `.env` file in the **frontend** folder:
```env
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Install & Start Backend
From the root directory:
```bash
npm install
npm start
```
*The server will start running on port `3000`.*

### 4. Install & Start Frontend
From the root directory, open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 🛡️ License

Distributed under the ISC License. See `LICENSE` for more information.

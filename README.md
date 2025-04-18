# CRM Application

A modern and responsive CRM (Customer Relationship Management) system built with **React (TypeScript)** for the frontend and **Node.js**, **Express**, and **MongoDB** (with **Mongoose**) for the backend. This CRM allows businesses to manage leads, contacts, services, calls, meetings, and user accounts efficiently. It includes an admin dashboard with user control features, route authentication, and session management via **MongoStore**.

## 🔧 Features

- 🧑‍💼 **Admin Dashboard**  
  manage user limits, and control access permissions.

- 📇 **Leads and Contacts Management**  
  Add, update, and track your business leads and contact details.

- 💼 **Services Page**  
  Displays travel-related essential services with responsive image zoom-in hover effects.

- 📞 **Calls & Meetings**  
  Schedule and record call and meeting details to manage client interactions.

- 🔐 **Authentication**  
  Secure route protection using JWT & session-based authentication stored in MongoDB.
  Facebook & Instagram Graph API

Your CRM supports Meta’s **Graph API** to fetch and manage:

- Facebook Page leads (leadgen forms)
- Instagram Direct Messages (DMs)
- Comments on posts
- Insights and analytics for posts or stories

### Requirements:
- A Facebook Developer App
- Approved permissions (e.g. `pages_show_list`, `leads_retrieval`, `instagram_basic`, `pages_messaging`)
- Long-lived Page Access Tokens

- 🧾 **Contact Form**  
  Functional "Contact Us" form that collects user data: name, email, subject, and message.

- 📱 **Responsive Design**  
  Optimized for all screen sizes. Special handling of image visibility on smaller devices.

## 🧱 Tech Stack

**Frontend:**
- React (TypeScript)
- Tailwind CSS
- Material UI

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- MongoStore for sessions

**Deployment:**
- Frontend: Vercel
- Backend: (Customize if you're using platforms like Render, Railway, or your own VPS)




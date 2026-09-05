# 📚 Viyazham Publication

Welcome to **Viyazham Publication** — a modern digital book publishing website designed to showcase, explore, and manage books online.

## 🌟 About the Project

Viyazham Publication provides a simple and attractive platform where readers can explore published books and administrators can upload and manage books.

The website includes book information such as:

- 📖 Book title
- ✍️ Author
- 🏷️ Category
- 🌐 Language
- 📄 Number of pages
- 💰 Book cost
- 📝 Description
- 🖼️ Book cover
- 📁 Book file

---

## ✨ Features

### 👤 User Features

- 🏠 Attractive home page
- 📚 Explore published books
- 🔍 Search books
- 🏷️ Filter books by category
- 📖 View complete book details
- 💰 View book price
- 🌐 View language and page information
- 📱 Responsive design

### 🔐 Admin Features

- 🔑 Admin login
- ➕ Add new books
- 🖼️ Upload book covers
- 📄 Upload PDF, DOC and DOCX files
- ✏️ Edit uploaded book information
- 🗑️ Delete books
- 👁️ View published books
- 📋 Manage uploaded books from the admin dashboard

### ⌨️ Tamil Support

The book upload page includes a built-in Tamil keyboard that allows administrators to enter:

- Tamil book titles
- Tamil author names
- Tamil categories
- Tamil descriptions

---

## 🛠️ Technologies Used

This project is built using:

- ⚛️ React
- ⚡ Vite
- 🟨 JavaScript
- 🧭 React Router
- 🎨 CSS
- 🧩 Lucide React Icons
- 💾 Browser LocalStorage

---

## 📁 Project Structure

```text
viyazham-1/
│
├── public/
│
├── src/
│   ├── components/
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Books.jsx
│   │   ├── BookDetails.jsx
│   │   ├── Authors.jsx
│   │   ├── About.jsx
│   │   ├── Admin.jsx
│   │   ├── AdminLogin.jsx
│   │   └── AddBook.jsx
│   │
│   ├── services/
│   │   └── booksService.js
│   │
│   ├── data/
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── package-lock.json
├── index.html
├── .gitignore
└── README.md
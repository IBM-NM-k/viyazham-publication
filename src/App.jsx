import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import BookReader from "./pages/BookReader.jsx";
import Authors from "./pages/Authors.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminLogin from "./pages/AdminLogin.jsx";
import UserAuth from "./pages/UserAuth.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Admin from "./pages/Admin.jsx";
import AddBook from "./pages/AddBook.jsx";


function App() {
  return (
    <Routes>

      {/* =================================================
          MAIN WEBSITE LAYOUT
      ================================================= */}

      <Route element={<Layout />}>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =================================================
            BOOKS / EXPLORE

            This is the ONE books page.

            Header → Books
            Home → Explore Books
            Search → Books

            All go to /books
        ================================================= */}

        <Route
          path="/books"
          element={<Explore />}
        />


        {/* =================================================
            BOOK DETAILS
        ================================================= */}

        <Route
          path="/books/:bookId"
          element={<BookDetails />}
        />


        {/* =================================================
            BOOK READER
        ================================================= */}

        <Route
          path="/books/:bookId/read"
          element={<BookReader />}
        />


        {/* =================================================
            AUTHORS
        ================================================= */}

        <Route
          path="/authors"
          element={<Authors />}
        />


        {/* =================================================
            ABOUT
        ================================================= */}

        <Route
          path="/about"
          element={<About />}
        />


        {/* =================================================
            USER LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<UserAuth />}
        />


        {/* =================================================
            USER UPDATES (shown after user login)
        ================================================= */}

        <Route
          path="/user-updates"
          element={<UserDashboard />}
        />


        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* =================================================
            ADMIN DASHBOARD
        ================================================= */}

        <Route
          path="/admin"
          element={<Admin />}
        />


        {/* =================================================
            ADD / UPLOAD BOOK
        ================================================= */}

        <Route
          path="/admin/books/add"
          element={<AddBook />}
        />


        {/* =================================================
            404 PAGE
        ================================================= */}

        <Route
          path="/not-found"
          element={<NotFound />}
        />


        {/* ANY UNKNOWN URL */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Route>

    </Routes>
  );
}

export default App;

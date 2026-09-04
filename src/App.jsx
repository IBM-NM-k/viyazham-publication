import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import BookReader from "./pages/BookReader.jsx";
import Authors from "./pages/Authors.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";

import UserAuth from "./pages/UserAuth.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import Admin from "./pages/Admin.jsx";
import AddBook from "./pages/AddBook.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
function App() {
  return (
    <Routes>

      {/* PUBLIC WEBSITE */}

      <Route element={<Layout />}>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/books"
          element={<Explore />}
        />

        <Route
          path="/books/:bookId"
          element={<BookDetails />}
        />

        <Route
          path="/books/:bookId/read"
          element={<BookReader />}
        />

        <Route
          path="/authors"
          element={<Authors />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/not-found"
          element={<NotFound />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />

      </Route>


      {/* USER LOGIN */}

      <Route
        path="/login"
        element={<UserAuth />}
      />

<Route
  path="/auth/callback"
  element={<AuthCallback />}
/> 
      {/* RESET PASSWORD */}

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* USER DASHBOARD */}

      <Route
        path="/userdashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />


      {/* ADMIN DASHBOARD */}

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <Admin />
          </AdminProtectedRoute>
        }
      />


      {/* ADD BOOK */}

      <Route
        path="/admin/books/add"
        element={
          <AdminProtectedRoute>
            <AddBook />
          </AdminProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
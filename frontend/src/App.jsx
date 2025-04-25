import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import Login from "./pages/LoginPage"
import Register from "./pages/RegisterPage"
import Footer from "./components/Footer"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminCategories from "./pages/admin/AdminCategories"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminProtectedRoutes from "./components/AdminRoute"

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoutes>
                <AdminDashboard />
              </AdminProtectedRoutes>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminProtectedRoutes>
                <AdminProducts />
              </AdminProtectedRoutes>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminProtectedRoutes>
                <AdminCategories />
              </AdminProtectedRoutes>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoutes>
                <AdminUsers />
              </AdminProtectedRoutes>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

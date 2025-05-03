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
import AdminOrders from "./pages/admin/AdminOrder"
import AdminProtectedRoutes from "./components/AdminRoute"
import AdminLayout from "./components/admin/AdminLayout"

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
              <Footer />
            </>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoutes>
              <AdminLayout />
            </AdminProtectedRoutes>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App

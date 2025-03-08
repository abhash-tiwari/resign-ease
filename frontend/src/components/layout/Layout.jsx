import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../services/auth";
import Notifications from "../common/Notifications";

const Layout = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = isAdmin
    ? [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/resignations", label: "Resignations" },
        { to: "/admin/exit-responses", label: "Exit Responses" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAdmin && <Notifications />}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Resignation Management System</h1>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navLinks.map(({ to, label }) => (
                  <Link key={to} to={to} className="nav-link hover:text-blue-500">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

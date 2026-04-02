import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (path, label) => (
    <Link
      to={path}
      onClick={() => setMenuOpen(false)}
      className={`text-sm font-medium transition-colors ${
        isActive(path)
          ? "text-primary"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">CarRental</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLink("/", "Home")}
            {navLink("/cars", "Browse Cars")}
            {user?.role === "agency" && (
              <>
                {navLink("/add-car", "Manage Fleet")}
                {navLink("/bookings", "Bookings")}
              </>
            )}
            {user?.role === "customer" && navLink("/my-bookings", "My Bookings")}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </Link>
                <Link to="/register-customer" className="btn-primary">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{user.name[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name.split(" ")[0]}</span>
                  <span className="badge bg-primary/10 text-primary capitalize">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors px-2 py-1"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-1">
          {[
            { path: "/", label: "Home" },
            { path: "/cars", label: "Browse Cars" },
            ...(user?.role === "agency" ? [
              { path: "/add-car", label: "Manage Fleet" },
              { path: "/bookings", label: "Bookings" },
            ] : []),
            ...(user?.role === "customer" ? [
              { path: "/my-bookings", label: "My Bookings" },
            ] : []),
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(path)
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="mt-2 pt-3 border-t border-gray-100">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline w-full justify-center">
                  Sign In
                </Link>
                <Link to="/register-customer" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center">
                  Get Started
                </Link>
                <Link to="/register-agency" onClick={() => setMenuOpen(false)} className="text-center text-sm text-gray-500 hover:text-gray-700 py-1">
                  Register as Agency
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{user.name[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="text-sm font-medium text-red-500">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

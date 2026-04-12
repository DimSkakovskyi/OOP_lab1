import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Payment System
        </Link>

        <nav className="nav-links">
          {isAuthenticated && user?.role === 'CLIENT' && <Link to="/accounts">Accounts</Link>}
          {isAuthenticated && user?.role === 'ADMIN' && <Link to="/admin/accounts">Admin</Link>}
        </nav>

        <div className="nav-right">
          {isAuthenticated ? (
            <>
              <span>{user?.login}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
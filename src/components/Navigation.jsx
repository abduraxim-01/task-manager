import { useAuth } from '../context/AuthContext';
import { LogOut, Layout } from 'lucide-react';
import './Components.css';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="nav-brand">
        <Layout className="nav-icon" />
        <h1>Task Manager</h1>
      </div>
      <div className="nav-user">
        <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <span className="user-name">{user?.name}</span>
        <button onClick={logout} className="logout-btn" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navigation;

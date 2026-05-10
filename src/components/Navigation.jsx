import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Layout, Sun, Moon, Bell } from 'lucide-react';
import './Components.css';

const Navigation = ({ tasks = [] }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifications = () => {
    const now = new Date();
    // set time to 00:00:00 for accurate day comparison
    now.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      if (task.status === 'Done' || !task.deadline) return false;
      const deadline = new Date(task.deadline);
      // set time to 00:00:00
      deadline.setHours(0, 0, 0, 0);
      
      const diffTime = deadline - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Due today or overdue
      return diffDays <= 1;
    });
  };

  const notifications = getNotifications();

  return (
    <header className="navbar">
      <div className="nav-brand">
        <Layout className="nav-icon" />
        <h1>Task Manager</h1>
      </div>
      <div className="nav-user">
        <div className="notification-wrapper" ref={notificationRef}>
          <button 
            className="icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <h4>Muddat haqida ogohlantirishlar</h4>
              {notifications.length === 0 ? (
                <div className="notification-empty">Yaqinlashayotgan muddatlar yo'q</div>
              ) : (
                <div className="notification-list">
                  {notifications.map(task => (
                    <div key={task.id} className="notification-item">
                      <div className="notification-title">{task.title}</div>
                      <div className="notification-date">Muddati: {new Date(task.deadline).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button onClick={toggleTheme} className="theme-toggle" title={`${theme === 'dark' ? 'Yorug' : 'Tungi'} rejimga o'tish`}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="avatar">{user?.username?.charAt(0).toUpperCase()}</div>
        <span className="user-name">{user?.username}</span>
        <button onClick={logout} className="logout-btn" title="Chiqish">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navigation;

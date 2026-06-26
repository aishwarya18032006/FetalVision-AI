import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUploadCloud, FiClock, FiLogOut, FiUser } from 'react-icons/fi';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/app', icon: FiHome, label: 'Dashboard' },
    { path: '/app/upload', icon: FiUploadCloud, label: 'Analyze Image' },
    { path: '/app/history', icon: FiClock, label: 'History' },
  ];

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo text-gradient">
            FetalVision AI
          </h1>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              <FiUser />
            </div>
            <div className="sidebar-user-info">
              <p>{user.name || 'Doctor'}</p>
              <span>{user.role || 'Member'}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="sidebar-logout"
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Mobile Header */}
        <header className="mobile-header">
          <h1 className="mobile-logo">FetalVision AI</h1>
          <button onClick={handleLogout} className="mobile-logout">
            <FiLogOut style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

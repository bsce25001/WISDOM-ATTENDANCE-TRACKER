import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { label: 'Students', path: '/admin/students', icon: '👩‍🎓' },
  { label: 'Events', path: '/admin/events', icon: '📅' },
  { label: 'Attendance', path: '/admin/attendance', icon: '✅' },
  { label: 'Statistics', path: '/admin/statistics', icon: '📈' },
];

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1e1e2e 0%, #16213e 100%)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        overflowY: 'auto',
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{
          padding: '28px 24px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(249,115,22,0.4)',
          }}>
            <span style={{ color: '#fff', fontSize: '20px', fontWeight: 900 }}>W</span>
          </div>
          <div>
            <div style={{ color: '#f97316', fontWeight: 800, fontSize: '16px', letterSpacing: '1px' }}>WISDOM</div>
            <div style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '0.5px' }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', marginBottom: '8px', paddingLeft: '12px' }}>
            MENU
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '10px',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive
                  ? 'linear-gradient(135deg, #f97316, #ea580c)'
                  : 'transparent',
                boxShadow: isActive ? '0 4px 12px rgba(249,115,22,0.3)' : 'none',
                transition: 'all 0.2s',
                textDecoration: 'none',
              })}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info at bottom */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>Logged in as</div>
          <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>{user?.name || 'Admin'}</div>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top header */}
        <header style={{
          height: '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <h1 style={{
            fontSize: '17px',
            fontWeight: 700,
            color: '#1e293b',
            letterSpacing: '0.3px',
          }}>
            WISDOM ATTENDANCE TRACKER
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: '#f3f4f6',
              borderRadius: '20px',
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
                  {(user?.name || 'A')[0].toUpperCase()}
                </span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                {user?.name || 'Admin'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 18px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
                transition: 'opacity 0.2s',
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

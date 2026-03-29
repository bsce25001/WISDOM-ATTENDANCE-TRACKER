import React, { useEffect, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    const fetchData = async () => {
      try {
        const [histRes, statsRes] = await Promise.all([
          api.get(`/api/attendance/student/${user._id}`),
          api.get(`/api/attendance/student-stats/${user._id}`).catch(() => ({ data: null })),
        ]);
        const records = Array.isArray(histRes.data) ? histRes.data : histRes.data?.records || histRes.data?.data || [];
        setHistory(records);

        const s = statsRes.data;
        if (s) {
          setSummary({
            totalEvents: s.totalEvents ?? records.length,
            present: s.present ?? records.filter(r => r.status === 'present').length,
            absent: s.absent ?? records.filter(r => r.status === 'absent').length,
          });
        } else {
          const present = records.filter(r => r.status === 'present').length;
          const absent = records.filter(r => r.status === 'absent').length;
          setSummary({ totalEvents: records.length, present, absent });
        }
      } catch {
        toast.error('Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDownloadPDF = async () => {
    try {
      const res = await api.get(`/api/reports/student/${user._id}`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(user.name || 'student').replace(/\s+/g, '_')}_attendance_report.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded!');
    } catch {
      toast.error('Failed to download report');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const pct = summary
    ? summary.totalEvents > 0 ? Math.round((summary.present / summary.totalEvents) * 100) : 0
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Top bar */}
      <header style={{
        background: 'linear-gradient(135deg, #1e1e2e 0%, #16213e 100%)',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(30,30,46,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, color: '#fff', fontSize: '18px',
          }}>W</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px', letterSpacing: '0.3px' }}>
            WISDOM ATTENDANCE TRACKER
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: '#fff', fontSize: '13px',
            }}>
              {(user?.name || 'S')[0].toUpperCase()}
            </div>
            <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600 }}>{user?.name || 'Student'}</span>
          </div>
          <button onClick={handleLogout} style={{
            padding: '8px 18px', background: 'rgba(249,115,22,0.9)', color: '#fff',
            borderRadius: '8px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer',
          }}>Logout</button>
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Welcome */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1e2e 0%, #16213e 100%)',
          borderRadius: '16px', padding: '28px 32px', marginBottom: '28px', color: '#fff',
          boxShadow: '0 4px 20px rgba(30,30,46,0.3)',
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>
            Welcome, {user?.name || 'Student'}! 👋
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Here's your attendance overview.
          </p>
        </div>

        {/* Summary cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              {[
                { label: 'Total Events', value: summary?.totalEvents ?? 0, icon: '📅', color: '#3b82f6', bg: '#eff6ff' },
                { label: 'Present', value: summary?.present ?? 0, icon: '✅', color: '#16a34a', bg: '#f0fdf4' },
                { label: 'Absent', value: summary?.absent ?? 0, icon: '❌', color: '#dc2626', bg: '#fef2f2' },
                { label: 'Attendance %', value: `${pct}%`, icon: '📊', color: pct >= 75 ? '#16a34a' : pct >= 50 ? '#ca8a04' : '#dc2626', bg: pct >= 75 ? '#f0fdf4' : pct >= 50 ? '#fef9c3' : '#fef2f2' },
              ].map((c) => (
                <div key={c.label} style={{
                  background: '#fff', borderRadius: '14px', padding: '20px 24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px', background: c.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                  }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: c.color }}>{c.value}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{c.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* History table */}
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{
                padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Attendance History</h2>
                <button
                  onClick={handleDownloadPDF}
                  style={{
                    padding: '8px 18px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
                    border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                  }}
                >
                  📥 Download My Report
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                      {['#', 'Event Title', 'Date', 'Status'].map((h) => (
                        <th key={h} style={{
                          padding: '12px 16px', textAlign: 'left', fontSize: '12px',
                          fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '14px' }}>
                          No attendance records found.
                        </td>
                      </tr>
                    ) : history.map((r, i) => {
                      const eventTitle = r.eventId?.title || r.event?.title || r.eventTitle || 'Unknown Event';
                      const eventDate = r.eventId?.date || r.event?.date || r.date;
                      return (
                        <tr key={r._id || i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '13px' }}>{i + 1}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{eventTitle}</td>
                          <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>
                            {eventDate ? new Date(eventDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 700,
                              background: r.status === 'present' ? '#dcfce7' : '#fee2e2',
                              color: r.status === 'present' ? '#16a34a' : '#dc2626',
                            }}>
                              {r.status === 'present' ? '✓ Present' : '✕ Absent'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

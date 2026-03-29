import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      border: `1px solid #f1f5f9`,
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '14px',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '26px',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, marginTop: '2px' }}>{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, events: 0, present: 0, absent: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [studentsRes, eventsRes, attendanceRes] = await Promise.all([
          api.get('/api/students'),
          api.get('/api/events'),
          api.get('/api/attendance/stats'),
        ]);
        const students = studentsRes.data;
        const events = eventsRes.data;
        const attendanceStats = attendanceRes.data;

        setStats({
          students: Array.isArray(students) ? students.length : (students?.total || 0),
          events: Array.isArray(events) ? events.length : (events?.total || 0),
          present: attendanceStats?.overallPresent ?? attendanceStats?.totalPresent ?? attendanceStats?.present ?? 0,
          absent: attendanceStats?.overallAbsent ?? attendanceStats?.totalAbsent ?? attendanceStats?.absent ?? 0,
        });

        const eventsArr = Array.isArray(events) ? events : (events?.data || []);
        setRecentEvents(eventsArr.slice(-5).reverse());
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const cards = [
    { icon: '👩‍🎓', label: 'Total Students', value: stats.students, color: '#3b82f6', bg: '#eff6ff' },
    { icon: '📅', label: 'Total Events', value: stats.events, color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: '✅', label: 'Total Present', value: stats.present, color: '#16a34a', bg: '#f0fdf4' },
    { icon: '❌', label: 'Total Absent', value: stats.absent, color: '#dc2626', bg: '#fef2f2' },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1e2e 0%, #16213e 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '28px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 4px 20px rgba(30,30,46,0.3)',
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 900,
          flexShrink: 0,
          boxShadow: '0 4px 14px rgba(249,115,22,0.4)',
        }}>W</div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>
            Welcome to WISDOM ATTENDANCE TRACKER
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Manage students, events, and attendance from your admin panel.</p>
        </div>
      </div>

      {/* Stats cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '28px',
          }}>
            {cards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          {/* Recent events */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
              📅 Recent Events
            </h2>
            {recentEvents.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>No events found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentEvents.map((ev) => (
                  <div key={ev._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9',
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      flexShrink: 0,
                    }}>📅</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{ev.title}</div>
                      {ev.date && (
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          {new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import api from '../../api/axios';

const PIE_COLORS = ['#16a34a', '#dc2626'];

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          api.get('/api/attendance/stats'),
          api.get('/api/students'),
        ]);
        setStats(statsRes.data);
        setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : studentsRes.data?.data || []);
      } catch {
        toast.error('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDownloadPDF = async (studentId, studentName) => {
    try {
      const res = await api.get(`/api/reports/student/${studentId}`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${studentName.replace(/\s+/g, '_')}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded!');
    } catch {
      toast.error('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading statistics...</div>
    );
  }

  const totalEvents = stats?.totalEvents ?? stats?.eventStats?.length ?? 0;
  const totalPresent = stats?.totalPresent ?? stats?.present ?? 0;
  const totalAbsent = stats?.totalAbsent ?? stats?.absent ?? 0;
  const totalRecords = totalPresent + totalAbsent;
  const avgPct = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

  const barData = (stats?.eventStats || stats?.byEvent || []).map((e) => ({
    name: (e.eventTitle || e.title || e.name || '').substring(0, 14),
    Present: e.present ?? e.presentCount ?? 0,
    Absent: e.absent ?? e.absentCount ?? 0,
  }));

  const pieData = [
    { name: 'Present', value: totalPresent },
    { name: 'Absent', value: totalAbsent },
  ];

  const studentStats = (stats?.studentStats || stats?.byStudent || []);

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '24px' }}>
        📈 Statistics & Reports
      </h1>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {[
          { label: 'Total Events', value: totalEvents, icon: '📅', color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Avg Attendance', value: `${avgPct}%`, icon: '📊', color: '#f97316', bg: '#fff7ed' },
          { label: 'Total Present', value: totalPresent, icon: '✅', color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Total Absent', value: totalAbsent, icon: '❌', color: '#dc2626', bg: '#fef2f2' },
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

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Bar chart */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>
            Attendance per Event
          </h2>
          {barData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: '14px' }}>No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Present" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>
            Overall Present vs Absent
          </h2>
          {totalRecords === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: '14px' }}>No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Student attendance table */}
      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Student Attendance Summary</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                {['Student Name', 'Events Attended', 'Total Events', 'Percentage', 'Report'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: '12px',
                    fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentStats.length > 0 ? studentStats.map((s, i) => {
                const pct = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
                return (
                  <tr key={s.studentId || s._id || i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{s.name || s.studentName}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>{s.present ?? s.attended ?? 0}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>{s.total ?? totalEvents}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 700,
                        background: pct >= 75 ? '#dcfce7' : pct >= 50 ? '#fef9c3' : '#fee2e2',
                        color: pct >= 75 ? '#16a34a' : pct >= 50 ? '#ca8a04' : '#dc2626',
                      }}>
                        {pct}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleDownloadPDF(s.studentId || s._id, s.name || s.studentName || 'student')}
                        style={{
                          padding: '6px 14px', background: '#3b82f6', color: '#fff',
                          borderRadius: '7px', fontWeight: 600, fontSize: '12px',
                          cursor: 'pointer', border: 'none',
                        }}
                      >
                        📥 PDF
                      </button>
                    </td>
                  </tr>
                );
              }) : students.map((s, i) => (
                <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{s.name}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>—</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>{totalEvents}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, background: '#f3f4f6', color: '#6b7280' }}>
                      —
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleDownloadPDF(s._id, s.name)}
                      style={{
                        padding: '6px 14px', background: '#3b82f6', color: '#fff',
                        borderRadius: '7px', fontWeight: 600, fontSize: '12px',
                        cursor: 'pointer', border: 'none',
                      }}
                    >
                      📥 PDF
                    </button>
                  </td>
                </tr>
              ))}
              {studentStats.length === 0 && students.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '14px' }}>
                    No student data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

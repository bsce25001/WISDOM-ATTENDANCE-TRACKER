import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function Attendance() {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [evRes, stRes] = await Promise.all([
          api.get('/api/events'),
          api.get('/api/students'),
        ]);
        setEvents(Array.isArray(evRes.data) ? evRes.data : evRes.data?.data || []);
        setStudents(Array.isArray(stRes.data) ? stRes.data : stRes.data?.data || []);
      } catch {
        toast.error('Failed to load data');
      }
    };
    fetchInit();
  }, []);

  const fetchAttendance = useCallback(async (eventId) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/attendance/event/${eventId}`);
      const records = Array.isArray(res.data) ? res.data : res.data?.records || res.data?.data || [];
      const map = {};
      records.forEach((r) => {
        const sid = r.studentId?._id || r.studentId || r.student?._id || r.student;
        if (sid) map[sid] = r.status;
      });
      setAttendance(map);
    } catch {
      setAttendance({});
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEventChange = (e) => {
    const val = e.target.value;
    setSelectedEvent(val);
    if (val) fetchAttendance(val);
    else setAttendance({});
  };

  const toggleStatus = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? '' : status,
    }));
  };

  const handleSaveAll = async () => {
    if (!selectedEvent) {
      toast.error('Please select an event first');
      return;
    }
    setSaving(true);
    try {
      const records = students.map((s) => ({
        studentId: s._id,
        status: attendance[s._id] || 'absent',
      }));
      await api.post('/api/attendance/mark-bulk', {
        eventId: selectedEvent,
        records,
      });
      toast.success('Attendance saved successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const btnBase = {
    padding: '6px 16px', borderRadius: '8px', fontWeight: 700,
    fontSize: '13px', transition: 'all 0.15s', cursor: 'pointer', border: 'none',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b' }}>✅ Mark Attendance</h1>
        {selectedEvent && (
          <button onClick={handleSaveAll} disabled={saving} style={{
            padding: '10px 24px',
            background: saving ? '#94a3b8' : 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '14px',
            boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
            cursor: saving ? 'not-allowed' : 'pointer', border: 'none',
          }}>
            {saving ? 'Saving...' : '💾 Save All'}
          </button>
        )}
      </div>

      {/* Event Selector */}
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px',
      }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '10px' }}>
          Select Event
        </label>
        <select
          value={selectedEvent}
          onChange={handleEventChange}
          style={{
            width: '100%', maxWidth: '400px', padding: '12px 16px',
            border: '1.5px solid #e5e7eb', borderRadius: '10px',
            fontSize: '15px', color: '#1e293b', background: '#f8fafc',
            cursor: 'pointer',
          }}
        >
          <option value="">— Choose an event —</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.title} {ev.date ? `(${new Date(ev.date).toLocaleDateString()})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Students List */}
      {selectedEvent && (
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
              Students ({students.length})
            </h2>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>
                ✅ Present: {Object.values(attendance).filter(v => v === 'present').length}
              </span>
              <span style={{ color: '#dc2626', fontWeight: 700 }}>
                ❌ Absent: {Object.values(attendance).filter(v => v === 'absent').length}
              </span>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading attendance...</div>
          ) : students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '14px' }}>No students found.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                    {['#', 'Student Name', 'Email', 'Present', 'Absent'].map((h) => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left', fontSize: '12px',
                        fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => {
                    const status = attendance[s._id] || '';
                    return (
                      <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '13px' }}>{i + 1}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{s.name}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>{s.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => toggleStatus(s._id, 'present')}
                            style={{
                              ...btnBase,
                              background: status === 'present' ? '#16a34a' : '#f0fdf4',
                              color: status === 'present' ? '#fff' : '#16a34a',
                              border: `2px solid ${status === 'present' ? '#16a34a' : '#bbf7d0'}`,
                            }}
                          >
                            ✓ Present
                          </button>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => toggleStatus(s._id, 'absent')}
                            style={{
                              ...btnBase,
                              background: status === 'absent' ? '#dc2626' : '#fef2f2',
                              color: status === 'absent' ? '#fff' : '#dc2626',
                              border: `2px solid ${status === 'absent' ? '#dc2626' : '#fecaca'}`,
                            }}
                          >
                            ✕ Absent
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!selectedEvent && (
        <div style={{
          background: '#fff', borderRadius: '16px', padding: '60px 24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
          <p style={{ color: '#9ca3af', fontSize: '16px', fontWeight: 500 }}>
            Select an event to start marking attendance
          </p>
        </div>
      )}
    </div>
  );
}

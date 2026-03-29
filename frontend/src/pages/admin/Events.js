import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const emptyForm = { title: '', description: '', date: '' };

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/events');
      setEvents(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      title: ev.title || '',
      description: ev.description || '',
      date: ev.date ? ev.date.slice(0, 10) : '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.date) {
      setFormError('Title and date are required.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/api/events/${editing._id}`, form);
        toast.success('Event updated successfully');
      } else {
        await api.post('/api/events', form);
        toast.success('Event added successfully');
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/events/${deleteTarget._id}`);
      toast.success('Event deleted');
      setDeleteTarget(null);
      fetchEvents();
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
    borderRadius: '8px', fontSize: '14px', color: '#1e293b', background: '#f8fafc',
  };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '5px' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b' }}>📅 Events Management</h1>
        <button onClick={openAdd} style={{
          padding: '10px 22px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
          color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '14px',
          boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
        }}>
          + Add Event
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                  {['Title', 'Description', 'Date', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left', fontSize: '12px',
                      fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '14px' }}>
                      No events found.
                    </td>
                  </tr>
                ) : events.map((ev, i) => (
                  <tr key={ev._id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{ev.title}</td>
                    <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '14px', maxWidth: '280px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.description || '—'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '4px 12px', background: '#eff6ff', borderRadius: '20px',
                        color: '#2563eb', fontWeight: 600, fontSize: '13px',
                      }}>
                        📅 {formatDate(ev.date)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(ev)} style={{
                          padding: '6px 14px', background: '#3b82f6', color: '#fff',
                          borderRadius: '7px', fontWeight: 600, fontSize: '12px',
                        }}>Edit</button>
                        <button onClick={() => setDeleteTarget(ev)} style={{
                          padding: '6px 14px', background: '#ef4444', color: '#fff',
                          borderRadius: '7px', fontWeight: 600, fontSize: '12px',
                        }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px',
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '32px', width: '100%',
            maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '24px' }}>
              {editing ? 'Edit Event' : 'Add Event'}
            </h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event title" />
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Event description"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Date *</label>
                  <input style={inputStyle} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>

              {formError && (
                <div style={{ marginTop: '16px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '13px' }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  padding: '10px 22px', background: '#f3f4f6', color: '#374151',
                  borderRadius: '9px', fontWeight: 600, fontSize: '14px',
                }}>Cancel</button>
                <button type="submit" disabled={saving} style={{
                  padding: '10px 22px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: '#fff', borderRadius: '9px', fontWeight: 700, fontSize: '14px',
                  opacity: saving ? 0.7 : 1,
                }}>
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '32px', width: '100%',
            maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗑️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Delete Event</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteTarget(null)} style={{
                padding: '10px 22px', background: '#f3f4f6', color: '#374151', borderRadius: '9px', fontWeight: 600, fontSize: '14px',
              }}>Cancel</button>
              <button onClick={handleDelete} style={{
                padding: '10px 22px', background: '#ef4444', color: '#fff', borderRadius: '9px', fontWeight: 700, fontSize: '14px',
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const emptyForm = {
  name: '', email: '', password: '', phone: '', address: '',
  bloodGroup: '', status: 'active', college: '', degree: '',
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/api/students');
      setStudents(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      name: s.name || '', email: s.email || '', password: '',
      phone: s.phone || '', address: s.address || '',
      bloodGroup: s.bloodGroup || '', status: s.status || 'active',
      college: s.college || '', degree: s.degree || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and email are required.');
      return;
    }
    if (!editing && !form.password.trim()) {
      setFormError('Password is required for new students.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (editing && !payload.password) delete payload.password;
      if (editing) {
        await api.put(`/api/students/${editing._id}`, payload);
        toast.success('Student updated successfully');
      } else {
        await api.post('/api/students', payload);
        toast.success('Student added successfully');
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to save student');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/students/${deleteTarget._id}`);
      toast.success('Student deleted');
      setDeleteTarget(null);
      fetchStudents();
    } catch {
      toast.error('Failed to delete student');
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
    borderRadius: '8px', fontSize: '14px', color: '#1e293b', background: '#f8fafc',
  };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '5px' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b' }}>👩‍🎓 Students Management</h1>
        <button onClick={openAdd} style={{
          padding: '10px 22px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
          color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '14px',
          boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
        }}>
          + Add Student
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍  Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, maxWidth: '360px' }}
        />
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
                  {['Name', 'Email', 'Phone', 'College', 'Degree', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left', fontSize: '12px',
                      fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '14px' }}>
                      No students found.
                    </td>
                  </tr>
                ) : filtered.map((s, i) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{s.name}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>{s.email}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>{s.phone || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>{s.college || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '14px' }}>{s.degree || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                        background: s.status === 'active' ? '#dcfce7' : '#fee2e2',
                        color: s.status === 'active' ? '#16a34a' : '#dc2626',
                      }}>
                        {s.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(s)} style={{
                          padding: '6px 14px', background: '#3b82f6', color: '#fff',
                          borderRadius: '7px', fontWeight: 600, fontSize: '12px',
                        }}>Edit</button>
                        <button onClick={() => setDeleteTarget(s)} style={{
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
            maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '24px' }}>
              {editing ? 'Edit Student' : 'Add Student'}
            </h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input style={inputStyle} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email address" />
                </div>
                <div>
                  <label style={labelStyle}>{editing ? 'New Password (optional)' : 'Password *'}</label>
                  <input style={inputStyle} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Address</label>
                  <input style={inputStyle} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Address" />
                </div>
                <div>
                  <label style={labelStyle}>Blood Group</label>
                  <select style={inputStyle} value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>College</label>
                  <input style={inputStyle} value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} placeholder="College name" />
                </div>
                <div>
                  <label style={labelStyle}>Degree</label>
                  <input style={inputStyle} value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} placeholder="Degree / Program" />
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
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Student'}
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
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Delete Student</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
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

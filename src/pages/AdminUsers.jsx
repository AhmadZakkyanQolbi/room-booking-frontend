import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser, getDepartments } from '../api/api';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaUsers, FaUserCheck, FaUserCog } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'User',
    departmentId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usersResult = await getUsers();
      if (usersResult.success) {
        setUsers(usersResult.data);
      }

      const deptResult = await getDepartments();
      if (deptResult.success) {
        setDepartments(deptResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      let result;
      if (editingUser) {
        const updateData = {
          fullName: form.fullName,
          role: form.role,
          departmentId: form.departmentId ? parseInt(form.departmentId) : null,
        };
        if (form.password && form.password.trim() !== '') {
          updateData.password = form.password;
        }
        result = await updateUser(editingUser.userId, updateData);
      } else {
        const createData = {
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          role: form.role,
          departmentId: form.departmentId ? parseInt(form.departmentId) : null,
        };
        result = await createUser(createData);
      }

      if (result.success) {
        setMessage(editingUser ? '✅ User berhasil diupdate!' : '✅ User berhasil ditambahkan!');
        setShowModal(false);
        resetForm();
        loadData();
      } else {
        setMessage('❌ ' + (result.message || 'Gagal menyimpan user'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('❌ ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return;
    setLoading(true);
    try {
      const result = await deleteUser(id);
      if (result.success) {
        setMessage('✅ User berhasil dihapus!');
        loadData();
      } else {
        setMessage('❌ ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('❌ ' + error.message);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ email: '', password: '', fullName: '', role: 'User', departmentId: '' });
    setEditingUser(null);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      email: user.email,
      password: '',
      fullName: user.fullName,
      role: user.role,
      departmentId: user.departmentId || ''
    });
    setShowModal(true);
  };

  const roleColors = {
    Admin: 'bg-purple-100 text-purple-700',
    User: 'bg-blue-100 text-blue-700'
  };

  const roleIcons = {
    Admin: <FaUserCog className="text-purple-600" />,
    User: <FaUserCheck className="text-blue-600" />
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/25">
            <FaUsers />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">👥 Manajemen User</h2>
            <p className="text-xs text-gray-400">Total: {users.length} user terdaftar</p>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
        >
          <FaPlus /> Tambah User
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl mb-6 backdrop-blur-sm border ${
          message.includes('✅') 
            ? 'bg-green-50/80 border-green-200 text-green-700' 
            : 'bg-red-50/80 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{message.includes('✅') ? '✅' : '❌'}</span>
            <span>{message.replace('✅ ', '').replace('❌ ', '')}</span>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <th className="text-left p-4 text-sm font-semibold text-gray-600">User</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Role</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">Departemen</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200 group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 flex-shrink-0">
                        {user.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{user.fullName}</p>
                        <p className="text-xs text-gray-400 md:hidden">{user.email}</p>
                        <p className="text-xs text-gray-400 lg:hidden">{user.departmentName || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm hidden md:table-cell">{user.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>
                      {roleIcons[user.role] || <FaUserCheck className="text-gray-400" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm hidden lg:table-cell">{user.departmentName || '-'}</td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition group-hover:scale-110"
                        title="Edit User"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition group-hover:scale-110"
                        title="Hapus User"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {editingUser ? '✏️ Edit User' : '➕ Tambah User'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-lg">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">📧 Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white/50"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  🔒 {editingUser ? 'Password (wajib di isi)' : 'Password'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white/50"
                  required={!editingUser}
                  minLength={6}
                />
                {!editingUser && <p className="text-xs text-gray-400 mt-1">Minimal 6 karakter</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">👤 Nama Lengkap</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">🎯 Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white/50"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">🏢 Departemen</label>
                <select
                  value={form.departmentId}
                  onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white/50"
                >
                  <option value="">Pilih Departemen</option>
                  {departments.map((dept) => (
                    <option key={dept.departmentId} value={dept.departmentId}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Memproses...
                  </>
                ) : (
                  editingUser ? 'Update User' : 'Tambah User'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="text-center mt-6 text-[10px] md:text-xs text-gray-400">
        <p>© 2026 <span className="text-gray-600 font-medium">Tiga Serangkai Group</span> • Room Booking System</p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;
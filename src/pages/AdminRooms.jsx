import React, { useState, useEffect } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../api/api';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5196';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState({
    roomName: '',
    capacity: '',
    facilities: '',
    image: null
  });
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const result = await getRooms();
    if (result.success) {
      setRooms(result.data);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!form.image && !editingRoom) {
      setMessage('❌ Silakan pilih gambar untuk ruangan');
      return;
    }

    const formData = new FormData();
    formData.append('roomName', form.roomName);
    formData.append('capacity', form.capacity);
    formData.append('facilities', form.facilities);
    if (form.image) {
      formData.append('image', form.image);
    }

    let result;
    if (editingRoom) {
      result = await updateRoom(editingRoom.roomId, formData);
    } else {
      result = await createRoom(formData);
    }

    if (result.success) {
      setMessage(editingRoom ? '✅ Ruangan berhasil diupdate!' : '✅ Ruangan berhasil ditambahkan!');
      setShowModal(false);
      resetForm();
      loadRooms();
    } else {
      setMessage('❌ ' + (result.message || 'Gagal menyimpan ruangan'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus ruangan ini?')) return;
    const result = await deleteRoom(id);
    if (result.success) {
      setMessage('✅ Ruangan berhasil dihapus!');
      loadRooms();
    } else {
      setMessage('❌ ' + result.message);
    }
  };

  const resetForm = () => {
    setForm({ roomName: '', capacity: '', facilities: '', image: null });
    setEditingRoom(null);
    setPreviewImage(null);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setForm({
      roomName: room.roomName,
      capacity: room.capacity,
      facilities: room.facilities || '',
      image: null
    });
    setPreviewImage(room.imageUrl ? `${API_BASE_URL}${room.imageUrl}` : null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🏢 Manajemen Ruangan</h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          <FaPlus /> Tambah Ruangan
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Gambar</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Nama Ruangan</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Kapasitas</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Fasilitas</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.roomId} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <img
                    src={room.imageUrl ? `${API_BASE_URL}${room.imageUrl}` : 'https://via.placeholder.com/80x60?text=No+Image'}
                    alt={room.roomName}
                    className="w-20 h-14 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x60?text=No+Image';
                    }}
                  />
                </td>
                <td className="p-4 font-medium text-gray-800">{room.roomName}</td>
                <td className="p-4 text-gray-600">{room.capacity} seats</td>
                <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{room.facilities || '-'}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(room)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(room.roomId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingRoom ? '✏️ Edit Ruangan' : '➕ Tambah Ruangan'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ruangan</label>
                <input
                  type="text"
                  value={form.roomName}
                  onChange={(e) => setForm({ ...form, roomName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fasilitas</label>
                <input
                  type="text"
                  value={form.facilities}
                  onChange={(e) => setForm({ ...form, facilities: e.target.value })}
                  placeholder="Projector, Whiteboard, AC"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Ruangan</label>
                {previewImage && (
                  <div className="mb-2">
                    <img src={previewImage} alt="Preview" className="w-32 h-24 object-cover rounded-lg" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG, WEBP (Max 2MB)</p>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {editingRoom ? 'Update Ruangan' : 'Tambah Ruangan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
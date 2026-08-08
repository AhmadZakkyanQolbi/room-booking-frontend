import React, { useState, useEffect } from 'react';
import { getRooms, createBooking, getCalendar, cancelBooking } from '../api/api';
import StatusBadge from '../components/StatusBadge';
import { FaCalendarPlus, FaClipboardList, FaTrash, FaSpinner } from 'react-icons/fa';

const Bookings = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    roomId: '',
    title: '',
    startTime: '',
    endTime: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const roomsResult = await getRooms();
    if (roomsResult.success) setRooms(roomsResult.data);

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    const bookingsResult = await getCalendar(startDate, endDate);
    if (bookingsResult.success) setBookings(bookingsResult.data);

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const result = await createBooking({
      roomId: parseInt(form.roomId),
      title: form.title,
      startTime: form.startTime,
      endTime: form.endTime
    });

    setSubmitting(false);

    if (result.success) {
      setMessage('✅ Booking berhasil dibuat! Menunggu persetujuan admin.');
      setForm({ roomId: '', title: '', startTime: '', endTime: '' });
      loadData();
    } else {
      setMessage('❌ ' + result.message);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Yakin ingin membatalkan booking ini?')) return;
    const result = await cancelBooking(id);
    if (result.success) {
      setMessage('✅ Booking berhasil dibatalkan');
      loadData();
    } else {
      setMessage('❌ ' + result.message);
    }
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📝 Booking Ruangan
        </h2>
        <p className="text-sm text-gray-500 mt-1">Three Serangkai Group - Pemesanan Ruangan</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Booking */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <FaCalendarPlus className="text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Buat Booking Baru</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                🏢 Ruangan
              </label>
              <select
                value={form.roomId}
                onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white/50"
                required
              >
                <option value="">Pilih Ruangan</option>
                {rooms.map((room) => (
                  <option key={room.roomId} value={room.roomId}>
                    {room.roomName} ({room.capacity} seats)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                📌 Judul
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white/50"
                placeholder="Meeting dengan klien"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  🕐 Mulai
                </label>
                <input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white/50 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  🕐 Selesai
                </label>
                <input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white/50 text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <FaCalendarPlus />
                  Kirim Booking
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/25">
              <FaClipboardList className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Booking Saya</h3>
              <p className="text-xs text-gray-400">Total: {bookings.length} booking</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-500">Belum ada booking</p>
                <p className="text-xs text-gray-400 mt-1">Silakan buat booking baru</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div 
                  key={booking.bookingId} 
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:border-blue-200 bg-white/50"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{booking.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{booking.roomName}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">
                          {new Date(booking.startTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          {' '}
                          {new Date(booking.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          {' - '}
                          {new Date(booking.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <StatusBadge status={booking.status} />
                      {booking.status === 'Pending' && (
                        <button
                          onClick={() => handleCancel(booking.bookingId)}
                          className="text-red-400 hover:text-red-600 transition p-1.5 hover:bg-red-50 rounded-lg"
                          title="Batalkan booking"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-6 text-[10px] md:text-xs text-gray-400">
        <p>© 2026 <span className="text-gray-600 font-medium">Tiga Serangkai Group</span> • Room Booking System</p>
      </div>
    </div>
  );
};

export default Bookings;
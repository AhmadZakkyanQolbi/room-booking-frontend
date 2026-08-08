import React, { useState, useEffect } from 'react';
import { getCalendar, updateBookingStatus } from '../api/api';
import StatusBadge from '../components/StatusBadge';

const AdminBookings = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [rejectReason, setRejectReason] = useState({});
  const [showRejectForm, setShowRejectForm] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
      const result = await getCalendar(startDate, endDate);
      
      console.log('Data booking:', result); 

      if (result.success) {
        setAllBookings(result.data);
        setPendingBookings(result.data.filter(b => b.status === 'Pending'));
      } else {
        setMessage('❌ Gagal load data: ' + result.message);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('❌ Terjadi kesalahan: ' + error.message);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      console.log('Mencoba approve booking ID:', id);
      
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Ada' : 'Tidak ada');
      
      const result = await updateBookingStatus(id, 'Approved');
      console.log('Result approve:', result);
      
      if (result.success) {
        setMessage('✅ Booking berhasil disetujui!');
        loadData();
      } else {
        setMessage('❌ ' + (result.message || 'Gagal approve booking'));
      }
    } catch (error) {
      console.error('Error approve:', error);
      setMessage('❌ ' + error.message);
    }
  };

  const handleReject = async (id) => {
    const reason = rejectReason[id] || '';
    if (!reason.trim()) {
      setMessage('❌ Alasan penolakan wajib diisi');
      return;
    }

    try {
      console.log('Mencoba reject booking ID:', id, 'Reason:', reason);
      
      const result = await updateBookingStatus(id, 'Rejected', reason);
      console.log('Result reject:', result);
      
      if (result.success) {
        setMessage('✅ Booking berhasil ditolak');
        setShowRejectForm({ ...showRejectForm, [id]: false });
        setRejectReason({ ...rejectReason, [id]: '' });
        loadData();
      } else {
        setMessage('❌ ' + (result.message || 'Gagal reject booking'));
      }
    } catch (error) {
      console.error('Error reject:', error);
      setMessage('❌ ' + error.message);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('User role:', user.role);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-500">
        <p>👤 Role: <span className="font-semibold">{user.role || 'Unknown'}</span></p>
        <p>📊 Total Pending: {pendingBookings.length}</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          ⏳ Menunggu Persetujuan ({pendingBookings.length})
        </h3>
        {pendingBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada booking yang menunggu persetujuan</p>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <div key={booking.bookingId} className="border border-gray-100 rounded-lg p-4">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">{booking.title}</p>
                    <div className="text-sm text-gray-500 space-y-1 mt-1">
                      <p>🏠 {booking.roomName}</p>
                      <p>👤 {booking.userFullName || 'Unknown'}</p>
                      <p>📅 {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleApprove(booking.bookingId)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => setShowRejectForm({ ...showRejectForm, [booking.bookingId]: !showRejectForm[booking.bookingId] })}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>

                {showRejectForm[booking.bookingId] && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Alasan penolakan..."
                        value={rejectReason[booking.bookingId] || ''}
                        onChange={(e) => setRejectReason({ ...rejectReason, [booking.bookingId]: e.target.value })}
                        className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => handleReject(booking.bookingId)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                      >
                        Konfirmasi Reject
                      </button>
                      <button
                        onClick={() => {
                          setShowRejectForm({ ...showRejectForm, [booking.bookingId]: false });
                          setRejectReason({ ...rejectReason, [booking.bookingId]: '' });
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">📋 Semua Booking ({allBookings.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Ruangan</th>
                <th className="text-left p-3">Judul</th>
                <th className="text-left p-3">Waktu</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map((booking) => (
                <tr key={booking.bookingId} className="border-b hover:bg-gray-50">
                  <td className="p-3">{booking.bookingId}</td>
                  <td className="p-3">{booking.roomName}</td>
                  <td className="p-3">{booking.title}</td>
                  <td className="p-3 text-xs">
                    {new Date(booking.startTime).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
import React, { useState, useEffect } from 'react';
import { getCalendar } from '../api/api';
import { FaCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Calendar = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const loadData = async () => {
    const now = currentMonth;
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    const result = await getCalendar(startDate, endDate);
    if (result.success) setBookings(result.data);
    setLoading(false);
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const prevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
    setLoading(true);
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
    setLoading(true);
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

  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const getBookingForSlot = (day, hour) => {
    const now = new Date();
    const currentDay = now.getDay();
    const dayIndex = days.indexOf(day);
    let diff = dayIndex - (currentDay === 0 ? 6 : currentDay - 1);
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    targetDate.setHours(0, 0, 0, 0);
    
    const targetDateStr = targetDate.toISOString().split('T')[0];
    const hourNum = parseInt(hour.split(':')[0]);
    
    return bookings.find(b => {
      const start = new Date(b.startTime);
      const startDateStr = start.toISOString().split('T')[0];
      const startHour = start.getHours();
      return startDateStr === targetDateStr && startHour === hourNum;
    });
  };

  const legendItems = [
    { label: 'Approved (Terkunci)', color: '#10B981' },
    { label: 'Pending (Menunggu)', color: '#F59E0B' },
    { label: 'Rejected / Dibatalkan', color: '#EF4444' },
  ];

  const approvedCount = bookings.filter(b => b.status === 'Approved').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const rejectedCount = bookings.filter(b => b.status === 'Rejected' || b.status === 'Cancelled').length;

  return (
    <div className="max-w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📅 Kalender Booking
        </h2>
        <p className="text-sm text-gray-500 mt-1">Three Serangkai Group - Jadwal Ruangan</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-sm border border-white/50">
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          <span className="text-sm font-semibold text-gray-700 mr-2">📌 Legend:</span>
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <FaCircle className="text-[10px] md:text-sm" style={{ color: item.color }} />
              <span className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 md:p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition hover:bg-blue-50 border border-gray-100"
        >
          <FaChevronLeft className="text-blue-600" />
        </button>
        <h3 className="text-base md:text-xl font-semibold text-gray-800">
          {getMonthName(currentMonth)}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 md:p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition hover:bg-blue-50 border border-gray-100"
        >
          <FaChevronRight className="text-blue-600" />
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 md:p-6 shadow-sm border border-white/50 overflow-x-auto">
        <div className="min-w-[600px] md:min-w-0">
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div className="font-bold text-gray-600 p-1 md:p-2 text-center text-[10px] md:text-sm">Waktu</div>
            {days.map(day => (
              <div key={day} className="font-bold text-gray-600 text-center p-1 md:p-2 text-[10px] md:text-sm bg-gray-50 rounded-lg">
                {day}
              </div>
            ))}
          </div>

          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
              <div className="text-[10px] md:text-xs text-gray-400 p-1 md:p-2 text-center flex items-center justify-center font-medium">
                {hour}
              </div>
              {days.map(day => {
                const booking = getBookingForSlot(day, hour);
                return (
                  <div key={`${day}-${hour}`} className="p-0.5 md:p-1 min-h-[30px] md:min-h-[40px]">
                    {booking && (
                      <div
                        className="text-[8px] md:text-xs text-white text-center p-1 rounded-lg truncate shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full flex items-center justify-center"
                        style={{ backgroundColor: booking.colorCode }}
                        title={`${booking.title} - ${booking.roomName} (${booking.status})`}
                      >
                        <span className="hidden sm:inline">{booking.title.substring(0, 10)}</span>
                        <span className="sm:hidden">📌</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mt-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 md:p-4 text-center border-l-4 border-green-500 shadow-sm">
          <p className="text-xl md:text-2xl font-bold text-green-600">{approvedCount}</p>
          <p className="text-[10px] md:text-xs text-gray-500">Approved</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-3 md:p-4 text-center border-l-4 border-yellow-500 shadow-sm">
          <p className="text-xl md:text-2xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-[10px] md:text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-3 md:p-4 text-center border-l-4 border-red-500 shadow-sm">
          <p className="text-xl md:text-2xl font-bold text-red-600">{rejectedCount}</p>
          <p className="text-[10px] md:text-xs text-gray-500">Rejected</p>
        </div>
      </div>

      <div className="text-center mt-6 text-[10px] md:text-xs text-gray-400">
        <p>© 2026 <span className="text-gray-600 font-medium">Three Serangkai Group</span> • Room Booking System</p>
      </div>
    </div>
  );
};

export default Calendar;
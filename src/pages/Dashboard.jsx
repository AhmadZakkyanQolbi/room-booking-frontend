import React, { useState, useEffect } from 'react';
import { getDashboard } from '../api/api';
import { 
  FaCalendarCheck, 
  FaClock, 
  FaDoorOpen, 
  FaUsers,
  FaChartBar,
  FaCircle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    loadData();
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const loadData = async () => {
    const result = await getDashboard();
    if (result.success) setData(result.data);
    setLoading(false);
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

  const stats = [
    { 
      icon: FaCalendarCheck, 
      label: 'Total Booking', 
      value: data?.totalBookings || 0, 
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      change: '+12%',
      trend: 'up'
    },
    { 
      icon: FaClock, 
      label: 'Jam Pemakaian', 
      value: data?.totalHours || 0, 
      color: 'green',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100/50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      change: '+8%',
      trend: 'up'
    },
    { 
      icon: FaDoorOpen, 
      label: 'Ruangan Favorit', 
      value: data?.mostPopularRoom || '-', 
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100/50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      change: '🔥',
      trend: 'hot'
    },
    { 
      icon: FaUsers, 
      label: 'Dept Teraktif', 
      value: data?.mostActiveDepartment || '-', 
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100/50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      change: '🏆',
      trend: 'winner'
    },
  ];

  const departmentData = data?.departmentUsage || [];
  const roomStatuses = data?.roomStatuses || [];
  const inUseRooms = roomStatuses.filter(room => room.isInUse);
  const availableRooms = roomStatuses.filter(room => !room.isInUse);

  const chartColors = [
    'linear-gradient(135deg, #3b82f6, #6366f1)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'linear-gradient(135deg, #ef4444, #f87171)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    'linear-gradient(135deg, #ec4899, #f472b6)',
    'linear-gradient(135deg, #14b8a6, #2dd4bf)',
    'linear-gradient(135deg, #f97316, #fb923c)'
  ];

  return (
    <div className={`transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 Dashboard
          </h2>
          <p className="text-gray-500 text-sm mt-1">Ringkasan pemakaian ruangan hari ini</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className={`group bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-white/50 relative overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1 tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className={`text-2xl ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {stat.trend === 'up' && (
                    <span className="text-green-500 text-xs font-semibold flex items-center gap-1">
                      <FaArrowUp className="text-xs" />
                      {stat.change}
                    </span>
                  )}
                  {stat.trend === 'hot' && (
                    <span className="text-orange-500 text-xs font-semibold animate-pulse">
                      {stat.change} Populer
                    </span>
                  )}
                  {stat.trend === 'winner' && (
                    <span className="text-yellow-500 text-xs font-semibold">
                      {stat.change} Aktif
                    </span>
                  )}
                  <span className="text-xs text-gray-400">vs bulan lalu</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm">
                <FaChartBar />
              </span>
              Grafik Pemakaian per Departemen
            </h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Bulan ini</span>
          </div>
          
          {departmentData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-3">📊</div>
              <p className="text-gray-500">Belum ada data pemakaian</p>
            </div>
          ) : (
            <div className="h-64 flex items-end space-x-3 overflow-x-auto pb-2">
              {departmentData.map((dept, index) => {
                const max = Math.max(...departmentData.map(d => d.bookingCount), 1);
                const height = (dept.bookingCount / max) * 180;
                const color = chartColors[index % chartColors.length];
                const isHighest = dept.bookingCount === Math.max(...departmentData.map(d => d.bookingCount));
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center min-w-[50px] group">
                    <div className="relative">
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-700 group-hover:scale-105 ${isHighest ? 'shadow-lg' : ''}`}
                        style={{ 
                          height: `${Math.max(height, 8)}px`,
                          background: color,
                          minHeight: '8px',
                          boxShadow: isHighest ? '0 4px 20px rgba(59,130,246,0.3)' : 'none'
                        }}
                      >
                        <div className="text-center text-xs font-bold text-white -mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {dept.bookingCount}
                        </div>
                      </div>
                      {isHighest && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                          <span className="text-[10px] font-bold text-yellow-500">⭐</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-xs font-medium text-gray-600 text-center truncate w-full group-hover:text-blue-600 transition-colors">
                      {dept.departmentName}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Room Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50">
          <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm">
              <FaCircle />
            </span>
            Status Ruangan Hari Ini
          </h3>
          
          <div className="space-y-4">
            {inUseRooms.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <p className="text-sm font-semibold text-red-600">
                    IN USE ({inUseRooms.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {inUseRooms.map((room, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-red-50/50 rounded-xl border-l-4 border-red-500 hover:shadow-md transition-all duration-300 group"
                    >
                      <span className="font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                        {room.roomName}
                      </span>
                      <span className="text-sm text-gray-600 bg-white/70 px-3 py-1 rounded-full">
                        {room.startTime ? new Date(room.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}
                        {' - '}
                        {room.endTime ? new Date(room.endTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {availableRooms.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 mt-4">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p className="text-sm font-semibold text-green-600">
                    AVAILABLE ({availableRooms.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {availableRooms.map((room, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-50/50 rounded-xl border-l-4 border-green-500 hover:shadow-md transition-all duration-300 group"
                    >
                      <span className="font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                        {room.roomName}
                      </span>
                      <span className="text-sm text-green-600 font-medium bg-white/70 px-4 py-1 rounded-full">
                        ✅ Available
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {roomStatuses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-3">🏠</div>
                <p className="text-gray-500">Tidak ada data ruangan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 shadow-sm border border-white/50">
        <div className="flex flex-wrap justify-around items-center gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{data?.totalBookings || 0}</p>
            <p className="text-xs text-gray-500">Total Booking</p>
          </div>
          <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{data?.totalHours || 0}</p>
            <p className="text-xs text-gray-500">Total Jam</p>
          </div>
          <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{inUseRooms.length}</p>
            <p className="text-xs text-gray-500">Ruangan Dipakai</p>
          </div>
          <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{availableRooms.length}</p>
            <p className="text-xs text-gray-500">Ruangan Tersedia</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
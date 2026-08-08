import React, { useState } from 'react';
import AdminBookings from './AdminBookings';
import AdminRooms from './AdminRooms';
import AdminUsers from './AdminUsers';
import { FaClipboardList, FaBuilding, FaUsers, FaShieldAlt } from 'react-icons/fa';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const tabs = [
    { id: 'bookings', icon: FaClipboardList, label: 'Booking', color: 'blue' },
    { id: 'rooms', icon: FaBuilding, label: 'Ruangan', color: 'green' },
    { id: 'users', icon: FaUsers, label: 'Users', color: 'purple' },
  ];

  const getTabColor = (tabId) => {
    const colors = {
      bookings: 'from-blue-500 to-blue-600',
      rooms: 'from-emerald-500 to-emerald-600',
      users: 'from-purple-500 to-purple-600',
    };
    return colors[tabId] || 'from-gray-500 to-gray-600';
  };

  const getTabIconBg = (tabId) => {
    const colors = {
      bookings: 'bg-blue-100 text-blue-600',
      rooms: 'bg-emerald-100 text-emerald-600',
      users: 'bg-purple-100 text-purple-600',
    };
    return colors[tabId] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="max-w-full">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/25">
            <FaShieldAlt />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Three Serangkai Group - Manajemen Sistem</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-white/50 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap flex-1 md:flex-none justify-center ${
                  isActive
                    ? `bg-gradient-to-r ${getTabColor(tab.id)} text-white shadow-lg shadow-${tab.color}-500/25`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`text-sm ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="text-sm">{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse ml-1"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="animate-fadeIn">
        {activeTab === 'bookings' && <AdminBookings />}
        {activeTab === 'rooms' && <AdminRooms />}
        {activeTab === 'users' && <AdminUsers />}
      </div>

      <div className="text-center mt-8 text-[10px] md:text-xs text-gray-400">
        <p>© 2026 <span className="text-gray-600 font-medium">Three Serangkai Group</span> • Room Booking System</p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Admin;
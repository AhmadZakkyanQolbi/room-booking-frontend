import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarCheck, 
  FaUserShield, 
  FaFileExcel, 
  FaSignOutAlt,
  FaCalendarAlt,
  FaUsers,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../api/api';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/bookings', icon: FaCalendarCheck, label: 'Booking' },
    { path: '/calendar', icon: FaCalendarAlt, label: 'Kalender' },
  ];

  if (isAdmin) {
    menuItems.push({ path: '/admin', icon: FaUserShield, label: 'Admin Panel' });
    menuItems.push({ path: '/users', icon: FaUsers, label: 'Users' });
    menuItems.push({ path: '/export', icon: FaFileExcel, label: 'Export Excel' });
  }

  const handleLogout = () => {
    logoutUser();
    logout();
    if (onClose) onClose();
  };

  return (
    <aside className="h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 flex flex-col shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-500/25">
            📅
          </div>
          <div>
            <h1 className="text-xl font-bold">Room<span className="text-blue-400">Booking</span></h1>
            <p className="text-[10px] text-gray-400">Tiga Serangkai Group</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white transition p-1"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/20 border border-blue-500/30 text-white shadow-lg shadow-blue-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-8 bg-blue-500 rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 pt-4 mt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.fullName || 'User'}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full inline-block ${
              isAdmin ? 'bg-purple-500/30 text-purple-300' : 'bg-blue-500/30 text-blue-300'
            }`}>
              {user?.role || 'User'}
            </span>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-gray-400 hover:text-red-400 transition p-1"
          >
            <FaSignOutAlt className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
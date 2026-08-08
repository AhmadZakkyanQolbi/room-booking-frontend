import React from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick, isMobile }) => {
  const { user } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <FaBars className="w-5 h-5" />
            </button>
          )}

          {isMobile && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">Room<span className="text-blue-600">Booking</span></span>
            </div>
          )}

          {!isMobile && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Selamat datang, <span className="text-blue-600">{user?.fullName || 'User'}</span> 👋
              </h2>
              <p className="text-xs text-gray-400 hidden md:block">Tiga Serangkai Group</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">

          {!isMobile && (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-700">{user?.fullName || 'User'}</p>
                <p className="text-[10px] text-gray-400">{user?.role || 'User'}</p>
              </div>
            </div>
          )}

          {isMobile && (
            <button className="p-1">
              <FaUserCircle className="w-7 h-7 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
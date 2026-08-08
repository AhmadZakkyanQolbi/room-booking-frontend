import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarCheck, 
  FaBuilding, 
  FaUsers, 
  FaArrowRight, 
  FaClock,
  FaHome,
  FaImage,
  FaClipboardList,
  FaSignInAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaChair
} from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { getCalendar, getRooms } from '../api/api';

const API_BASE_URL = 'http://localhost:5196';

const LandingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [imageErrors, setImageErrors] = useState({});
  const [error, setError] = useState(null);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('[LandingPage] Fetching rooms...');
        const roomsResult = await getRooms();
        console.log('[LandingPage] Rooms result:', roomsResult);
        
        if (roomsResult.success) {
          console.log('[LandingPage] Rooms data:', roomsResult.data);
          console.log('[LandingPage] Number of rooms:', roomsResult.data?.length || 0);
          setRooms(roomsResult.data || []);
        } else {
          console.error('[LandingPage] Failed to fetch rooms:', roomsResult.message);
          setError('Gagal memuat data ruangan. ' + roomsResult.message);
        }

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
        
        console.log('[LandingPage] Fetching bookings...');
        const bookingsResult = await getCalendar(startDate, endDate);
        console.log('[LandingPage] Bookings result:', bookingsResult);
        
        if (bookingsResult.success) {
          const activeBookings = bookingsResult.data?.filter(
            b => b.status === 'Approved' || b.status === 'Pending'
          ) || [];
          console.log('[LandingPage] Active bookings:', activeBookings.length);
          setBookings(activeBookings);
        } else {
          console.error('[LandingPage] Failed to fetch bookings:', bookingsResult.message);
        }
      } catch (err) {
        console.error('[LandingPage] Unexpected error:', err);
        setError('Terjadi kesalahan saat memuat data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [rooms, bookings]);

  const getStatusBadge = (status) => {
    const styles = {
      Approved: 'bg-emerald-100 text-emerald-700',
      Pending: 'bg-amber-100 text-amber-700',
      Rejected: 'bg-rose-100 text-rose-700',
      Cancelled: 'bg-slate-100 text-slate-700',
    };
    return styles[status] || styles.Cancelled;
  };

  const getStatusText = (status) => {
    const texts = {
      Approved: 'Disetujui',
      Pending: 'Menunggu',
      Rejected: 'Ditolak',
      Cancelled: 'Dibatalkan',
    };
    return texts[status] || status;
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return 'https://via.placeholder.com/600x400/1a3a5c/ffffff?text=Tiga+Serangkai';
    }
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/images/')) {
      return `${API_BASE_URL}${imageUrl}`;
    }
    
    if (imageUrl.startsWith('images/')) {
      return `${API_BASE_URL}/${imageUrl}`;
    }
    
    return `${API_BASE_URL}/images/rooms/${imageUrl}`;
  };

  const handleImageError = (roomId) => {
    console.log(`[Image Error] Failed to load image for room ${roomId}`);
    setImageErrors(prev => ({ ...prev, [roomId]: true }));
  };

  const getFacilitiesArray = (facilities) => {
    if (!facilities) return [];
    return facilities.split(',').map(f => f.trim()).filter(f => f);
  };

  const stats = [
    { icon: FaBuilding, value: rooms.length + '+', label: 'Ruangan Tersedia' },
    { icon: FaUsers, value: '100+', label: 'Pengguna Aktif' },
    { icon: FaCalendarCheck, value: '500+', label: 'Booking Bulanan' },
    { icon: FaClock, value: '24/7', label: 'Akses Penuh' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="w-10 h-10 bg-[#1a3a5c] rounded-xl flex items-center justify-center shadow-lg shadow-[#1a3a5c]/25">
                <span className="text-white text-lg font-bold">TS</span>
              </div>
              <div>
                <span className="text-lg font-bold text-[#1a3a5c]">Tiga Serangkai</span>
                <span className="block text-[10px] font-medium text-slate-500 -mt-0.5">Room Booking System</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <button 
                onClick={() => scrollToSection('home')}
                className={`hover:text-[#1a3a5c] transition-colors ${activeSection === 'home' ? 'text-[#1a3a5c]' : ''}`}
              >
                Beranda
              </button>
              <button 
                onClick={() => scrollToSection('rooms')}
                className={`hover:text-[#1a3a5c] transition-colors ${activeSection === 'rooms' ? 'text-[#1a3a5c]' : ''}`}
              >
                Ruangan ({rooms.length})
              </button>
              <button 
                onClick={() => scrollToSection('bookings')}
                className={`hover:text-[#1a3a5c] transition-colors ${activeSection === 'bookings' ? 'text-[#1a3a5c]' : ''}`}
              >
                Peminjaman ({bookings.length})
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-6 py-2 bg-[#1a3a5c] text-white rounded-lg text-sm font-medium hover:bg-[#264d73] transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              >
                <FaSignInAlt className="text-xs" />
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-[#f0f4f8] via-white to-[#e8edf3]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1a3a5c]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#1a3a5c]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a3a5c]/10 text-[#1a3a5c] rounded-full text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3a5c] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1a3a5c]"></span>
                </span>
                Tiga Serangkai Group
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1a3a5c] leading-tight">
                Solusi Booking
                <span className="block text-[#2a5f8a]">
                  Ruangan Modern
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed">
                Sistem pemesanan ruangan terintegrasi untuk lingkungan kerja 
                Tiga Serangkai Group. Efisien, transparan, dan mudah digunakan.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="group px-8 py-3.5 bg-[#1a3a5c] text-white rounded-lg font-semibold hover:bg-[#264d73] transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Booking Sekarang
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => scrollToSection('rooms')}
                  className="px-8 py-3.5 border-2 border-[#1a3a5c]/20 text-[#1a3a5c] rounded-lg font-semibold hover:border-[#1a3a5c] hover:bg-[#1a3a5c]/5 transition-all duration-300"
                >
                  Lihat Ruangan
                </button>
              </div>

              <div className="mt-8 flex gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <IoMdCheckmarkCircle className="text-emerald-500" />
                  <span>{rooms.length}+ Ruangan</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <IoMdCheckmarkCircle className="text-emerald-500" />
                  <span>Akses 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <IoMdCheckmarkCircle className="text-emerald-500" />
                  <span>Real-time</span>
                </div>
              </div>
            </div>

            <div className="relative animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#1a3a5c]/5 rounded-3xl blur-2xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
                  alt="Office Tiga Serangkai"
                  className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-4 border border-slate-100">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                    <IoMdCheckmarkCircle className="text-emerald-500 text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a3a5c]">Mudah & Cepat</p>
                    <p className="text-xs text-slate-500">Booking dalam 3 langkah</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-[#f0f4f8] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="text-[#1a3a5c] text-2xl" />
                  </div>
                  <p className="text-3xl font-bold text-[#1a3a5c]">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="rooms" className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a3a5c]">
              🏢 Ruangan Tersedia
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              {rooms.length > 0 
                ? `${rooms.length} ruangan tersedia untuk dipesan di lingkungan Tiga Serangkai Group`
                : 'Pilih ruangan meeting yang sesuai dengan kebutuhan Anda di lingkungan Tiga Serangkai Group'
              }
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <FaSpinner className="animate-spin text-[#1a3a5c] text-4xl" />
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <FaExclamationTriangle className="text-rose-500 text-5xl mx-auto mb-4" />
              <p className="text-rose-500 text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-2 bg-[#1a3a5c] text-white rounded-lg hover:bg-[#264d73] transition-colors"
              >
                Refresh Halaman
              </button>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <div className="text-6xl mb-4">🏢</div>
              <p className="text-slate-500 text-lg">Belum ada ruangan yang tersedia</p>
              <p className="text-slate-400 text-sm mt-1">Silakan login untuk menambahkan ruangan</p>
              <Link to="/login" className="inline-block mt-4 px-6 py-2 bg-[#1a3a5c] text-white rounded-lg text-sm font-medium hover:bg-[#264d73] transition-colors">
                Login Sekarang
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, index) => {
                const imageUrl = getImageUrl(room.imageUrl);
                const hasError = imageErrors[room.roomId];
                const facilities = getFacilitiesArray(room.facilities);
                
                return (
                  <div
                    key={room.roomId}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll opacity-0 translate-y-10 border border-slate-100"
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="relative overflow-hidden h-56 bg-slate-100">
                      <img
                        src={hasError ? 'https://via.placeholder.com/600x400/1a3a5c/ffffff?text=Tiga+Serangkai' : imageUrl}
                        alt={room.roomName || 'Ruangan'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        onError={() => handleImageError(room.roomId)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="text-white text-sm">
                          {facilities.slice(0, 3).join(' • ')}
                          {facilities.length > 3 && ' • +' + (facilities.length - 3)}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold text-[#1a3a5c] shadow-sm">
                        <FaChair className="inline mr-1" /> {room.capacity} Kursi
                      </div>
                      {room.imageUrl && !hasError && (
                        <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-medium text-white shadow-sm">
                          ✓ Tersedia
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#1a3a5c]">{room.roomName || 'Ruangan'}</h3>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {facilities.slice(0, 4).map((facility, i) => (
                          <span key={i} className="px-2.5 py-0.5 bg-[#f0f4f8] text-[#1a3a5c] text-xs rounded-lg">
                            {facility}
                          </span>
                        ))}
                        {facilities.length > 4 && (
                          <span className="px-2.5 py-0.5 bg-[#f0f4f8] text-[#1a3a5c] text-xs rounded-lg">
                            +{facilities.length - 4}
                          </span>
                        )}
                      </div>
                      <Link
                        to="/login"
                        className="mt-4 inline-flex items-center text-[#1a3a5c] font-medium hover:text-[#2a5f8a] transition-colors group/link text-sm"
                      >
                        Pesan Sekarang
                        <FaArrowRight className="ml-1 group-hover/link:translate-x-1 transition-transform text-xs" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="bookings" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a3a5c]">
                📋 Peminjaman Ruangan
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                {bookings.length > 0 
                ? `${bookings.length} ruangan sedang digunakan oleh tim Tiga Serangkai Group`
                : 'Ruangan yang sedang digunakan oleh tim Tiga Serangkai Group'
                }
            </p>
            </div>

            {loading ? (
            <div className="flex justify-center py-12">
                <FaSpinner className="animate-spin text-[#1a3a5c] text-4xl" />
            </div>
            ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-[#f8fafc] rounded-2xl border border-slate-200">
                <div className="text-6xl mb-4">🏠</div>
                <p className="text-slate-500 text-lg">Belum ada peminjaman ruangan</p>
                <p className="text-slate-400 text-sm mt-1">Semua ruangan tersedia untuk dipesan</p>
                <Link to="/login" className="inline-block mt-4 px-6 py-2 bg-[#1a3a5c] text-white rounded-lg text-sm font-medium hover:bg-[#264d73] transition-colors">
                Booking Sekarang
                </Link>
            </div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking, index) => {
                // Cari room berdasarkan roomId dari booking
                const room = rooms.find(r => r.roomId === booking.roomId);
                // Dapatkan URL gambar
                const roomImage = room?.imageUrl ? getImageUrl(room.imageUrl) : null;
                // Log untuk debugging
                console.log(`[Booking ${index}] RoomId: ${booking.roomId}, Room:`, room);
                console.log(`[Booking ${index}] Image URL:`, roomImage);
                
                return (
                    <div
                    key={booking.bookingId}
                    className="bg-[#f8fafc] rounded-xl p-5 border border-slate-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-on-scroll opacity-0 translate-y-10"
                    style={{ transitionDelay: `${index * 100}ms` }}
                    >
                    <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1a3a5c] truncate">{booking.title || 'Meeting'}</p>
                        <p className="text-sm text-slate-600">
                            <FaBuilding className="inline mr-1 text-slate-400" />
                            {booking.roomName || room?.roomName || 'Ruangan'}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span>
                            <FaCalendarAlt className="inline mr-1" />
                            {new Date(booking.startTime).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                            </span>
                            <span>
                            🕐 {new Date(booking.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            </span>
                        </div>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusBadge(booking.status)}`}>
                        {getStatusText(booking.status)}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                        <FaUser className="text-[10px]" />
                        </span>
                    </div>
                    </div>
                );
                })}
            </div>
            )}

            <div className="text-center mt-8">
            <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#f0f4f8] text-[#1a3a5c] rounded-lg font-medium hover:bg-[#e5eaf0] transition-colors"
            >
                Masuk untuk Booking <FaArrowRight className="text-sm" />
            </Link>
            </div>
        </div>
      </section>

      <footer className="bg-[#0f283d] text-slate-300 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-slate-700/50">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#1a3a5c] rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg font-bold">TS</span>
                </div>
                <div>
                  <span className="text-white font-bold">Tiga Serangkai</span>
                  <p className="text-xs text-slate-400">Room Booking System</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sistem manajemen pemesanan ruangan untuk lingkungan kerja Tiga Serangkai Group yang modern dan efisien.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Menu</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition">Beranda</button></li>
                <li><button onClick={() => scrollToSection('rooms')} className="hover:text-white transition">Ruangan</button></li>
                <li><button onClick={() => scrollToSection('bookings')} className="hover:text-white transition">Peminjaman</button></li>
                <li><Link to="/login" className="hover:text-white transition">Masuk</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><FaPhone className="text-slate-400" /> (0274) 123456</li>
                <li className="flex items-center gap-2"><FaEnvelope className="text-slate-400" /> info@tigaserangkai.co.id</li>
                <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-slate-400" /> Yogyakarta, Indonesia</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Jam Operasional</h4>
              <ul className="space-y-2 text-sm">
                <li>Senin - Jumat: 08:00 - 17:00</li>
                <li>Sabtu: 08:00 - 12:00</li>
                <li className="text-emerald-400">Minggu: Tutup</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs mt-6 text-slate-400">
            <p>© 2026 <span className="text-white font-medium">Tiga Serangkai Group</span> • Room Booking System v2.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
import React, { useState } from 'react';
import { exportExcel } from '../api/api';
import { FaFileExcel, FaDownload, FaSpinner, FaCalendarAlt } from 'react-icons/fa';

const Export = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = async () => {
    setLoading(true);
    setMessage('');

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setMessage('❌ Tanggal awal tidak boleh lebih besar dari tanggal akhir');
      setLoading(false);
      return;
    }

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const result = await exportExcel(params);

    if (result.success) {
      const blob = new Blob([result.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      let fileName = 'Laporan_Booking';
      if (startDate && endDate) {
        fileName += `_${startDate}_sampai_${endDate}`;
      } else if (startDate) {
        fileName += `_dari_${startDate}`;
      } else if (endDate) {
        fileName += `_sampai_${endDate}`;
      } else {
        fileName += '_semua_data';
      }
      fileName += `_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      const dateText = startDate && endDate 
        ? `periode ${startDate} s/d ${endDate}` 
        : startDate 
          ? `dari ${startDate}` 
          : endDate 
            ? `sampai ${endDate}` 
            : 'semua data';
      setMessage(`✅ File Excel berhasil diunduh! (${dateText})`);
    } else {
      setMessage('❌ ' + (result.message || 'Gagal export Excel'));
    }

    setLoading(false);
  };

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    setMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#1a3a5c] mb-6">📊 Export Laporan</h2>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
        <div className="w-20 h-20 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <FaFileExcel className="text-4xl text-emerald-600" />
        </div>

        <h3 className="text-xl font-semibold text-[#1a3a5c] mb-2 text-center">
          Export Data Booking ke Excel
        </h3>
        <p className="text-slate-500 text-sm mb-6 text-center">
          Download data booking dengan filter tanggal
        </p>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('✅') 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <FaCalendarAlt className="inline mr-1.5 text-slate-400" />
                Dari Tanggal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <FaCalendarAlt className="inline mr-1.5 text-slate-400" />
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-2.5 rounded-lg focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={resetFilter}
              className="text-sm text-slate-500 hover:text-[#1a3a5c] transition-colors"
            >
              Reset Filter
            </button>
            <div className="text-xs text-slate-400">
              {startDate || endDate ? (
                <span>
                  Menampilkan: 
                  {startDate && ` ${startDate}`}
                  {startDate && endDate && ' s/d'}
                  {endDate && ` ${endDate}`}
                </span>
              ) : (
                <span>Semua data</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-3 bg-[#1a3a5c] text-white rounded-lg font-semibold hover:bg-[#264d73] transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <FaDownload />
              Download Excel
            </>
          )}
        </button>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center">
            File akan berisi: ID Booking, Ruangan, User, Departemen, Judul, Waktu, Status
          </p>
          <p className="text-xs text-slate-400 text-center mt-1">
            {startDate || endDate ? 'Data difilter berdasarkan tanggal mulai booking' : 'Mengambil semua data booking'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Export;
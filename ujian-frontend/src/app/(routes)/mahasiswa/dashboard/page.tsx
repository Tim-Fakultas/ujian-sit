
"use client";
import { useState, useEffect } from 'react';


interface Letter {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  status: 'sent' | 'read';
}

interface TitleSubmission {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface DashboardStats {
  pending: number;
  approved: number;
  rejected: number;
}

export default function DashboardPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [titleSubmissions, setTitleSubmissions] = useState<TitleSubmission[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    // Fetch data from API
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Replace with actual API calls
      const mockLetters: Letter[] = [
        { id: '1', title: 'Surat Keterangan Mahasiswa Aktif', type: 'official', createdAt: '2024-01-15', status: 'sent' },
        { id: '2', title: 'Surat Izin Penelitian', type: 'research', createdAt: '2024-01-10', status: 'read' },
      ];
      
      const mockSubmissions: TitleSubmission[] = [
        { id: '1', title: 'Sistem Informasi Akademik', status: 'pending', submittedAt: '2024-01-20' },
        { id: '2', title: 'Aplikasi Mobile Learning', status: 'approved', submittedAt: '2024-01-18' },
        { id: '3', title: 'E-Commerce Platform', status: 'rejected', submittedAt: '2024-01-15' },
      ];

      setLetters(mockLetters);
      setTitleSubmissions(mockSubmissions);
      
      // Calculate stats
      const pending = mockSubmissions.filter(s => s.status === 'pending').length;
      const approved = mockSubmissions.filter(s => s.status === 'approved').length;
      const rejected = mockSubmissions.filter(s => s.status === 'rejected').length;
      
      setStats({ pending, approved, rejected });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-full">
      <h1 className="text-2xl font-bold mb-6">Dashboard Mahasiswa</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800">Sedang Diproses</h3>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800">Diterima</h3>
          <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800">Ditolak</h3>
          <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
        </div>
      </div>

      {/* Letters Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Surat dari Admin</h2>
        <div className="bg-white border rounded-lg overflow-hidden">
          {letters.length > 0 ? (
            <div className="divide-y">
              {letters.map((letter) => (
                <div key={letter.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{letter.title}</h3>
                      <p className="text-sm text-gray-500">Dibuat: {letter.createdAt}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      letter.status === 'read' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {letter.status === 'read' ? 'Dibaca' : 'Baru'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Belum ada surat dari admin
            </div>
          )}
        </div>
      </div>

      {/* Title Submissions Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pengajuan Judul Skripsi</h2>
        <div className="bg-white border rounded-lg overflow-hidden">
          {titleSubmissions.length > 0 ? (
            <div className="divide-y">
              {titleSubmissions.map((submission) => (
                <div key={submission.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{submission.title}</h3>
                      <p className="text-sm text-gray-500">Diajukan: {submission.submittedAt}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status === 'pending' && 'Sedang Diproses'}
                      {submission.status === 'approved' && 'Diterima'}
                      {submission.status === 'rejected' && 'Ditolak'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Belum ada pengajuan judul
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
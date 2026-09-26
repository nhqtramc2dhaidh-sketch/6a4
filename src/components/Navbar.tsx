import React, { useState } from 'react';
import { UserRole, Student } from '../types';
import { CLASS_INFO } from '../data/mockData';
import {
  Sparkles,
  Trophy,
  Award,
  BookOpen,
  CalendarCheck2,
  CalendarDays,
  Bell,
  MessageSquare,
  BarChart3,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  students: Student[];
  unreadNoticesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  selectedStudentId,
  setSelectedStudentId,
  students,
  unreadNoticesCount,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const navItems = [
    { id: 'stickers', label: 'Bảng Sticker', icon: Sparkles },
    { id: 'honors', label: 'Vinh Danh Tuần', icon: Trophy },
    { id: 'grades', label: 'Sổ Điểm Học Tập', icon: Award },
    { id: 'attendance', label: 'Điểm Danh', icon: CalendarCheck2 },
    { id: 'homework', label: 'Bài Tập', icon: BookOpen },
    { id: 'timetable', label: 'Thời Khóa Biểu', icon: CalendarDays },
    { id: 'notices', label: 'Thông Báo', icon: Bell, badge: unreadNoticesCount },
    { id: 'chat', label: 'Sổ Liên Lạc', icon: MessageSquare },
    { id: 'reports', label: 'Báo Cáo', icon: BarChart3 },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setRoleMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Zone 1 & Zone 3 Top Level Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark with school identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('stickers')}
              className="flex items-center gap-2.5 text-left group"
            >
              <span className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 via-indigo-600 to-amber-500 text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
                🎓
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="block text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    {CLASS_INFO.fullTitle}
                  </span>
                  <span className="hidden md:inline-block text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {CLASS_INFO.schoolName}
                  </span>
                </div>
                <span className="hidden sm:block text-xs font-medium text-slate-500">
                  {CLASS_INFO.schoolName} · {CLASS_INFO.slogan}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 3: Role Switcher & Profile View */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role indicator selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all ${
                  currentRole === 'teacher'
                    ? 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                    : currentRole === 'parent'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span className="hidden xs:inline">Vai trò:</span>
                <span className="font-bold">
                  {currentRole === 'teacher'
                    ? 'Cô Quỳnh Trâm (Giáo viên)'
                    : currentRole === 'parent'
                    ? 'Phụ huynh'
                    : 'Học sinh'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Chuyển đổi góc nhìn
                  </div>

                  <button
                    onClick={() => handleRoleSelect('teacher')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                      currentRole === 'teacher' ? 'font-bold text-blue-700 bg-blue-50/60' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">👩‍🏫</span>
                      <div>
                        <div>Cô Quỳnh Trâm (Giáo viên / Admin)</div>
                        <div className="text-[10px] text-slate-400 font-normal">Toàn quyền quản lý lớp, điểm, ảnh</div>
                      </div>
                    </div>
                    {currentRole === 'teacher' && <span className="text-blue-600">✓</span>}
                  </button>

                  <button
                    onClick={() => handleRoleSelect('parent')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                      currentRole === 'parent' ? 'font-bold text-emerald-700 bg-emerald-50/60' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">👨‍👩‍👧</span>
                      <div>
                        <div>Phụ huynh học sinh</div>
                        <div className="text-[10px] text-slate-400 font-normal">Xem điểm, điểm danh & bài tập của con</div>
                      </div>
                    </div>
                    {currentRole === 'parent' && <span className="text-emerald-600">✓</span>}
                  </button>

                  <button
                    onClick={() => handleRoleSelect('student')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                      currentRole === 'student' ? 'font-bold text-amber-700 bg-amber-50/60' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎒</span>
                      <div>
                        <div>Học sinh lớp 6A4</div>
                        <div className="text-[10px] text-slate-400 font-normal">Xem sticker, huy hiệu cá nhân</div>
                      </div>
                    </div>
                    {currentRole === 'student' && <span className="text-amber-600">✓</span>}
                  </button>

                  {/* Student selector if Parent or Student role is selected */}
                  {(currentRole === 'parent' || currentRole === 'student') && (
                    <div className="border-t border-slate-100 mt-2 pt-2 px-3">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        {currentRole === 'parent' ? 'Chọn con em:' : 'Chọn học sinh:'}
                      </label>
                      <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      >
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.group})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick student badge if parent or student */}
            {(currentRole === 'parent' || currentRole === 'student') && selectedStudent && (
              <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                <span className="text-amber-500 font-bold">⭐ {selectedStudent.points}đ</span>
                <span className="truncate max-w-[100px]">{selectedStudent.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400 text-slate-900' : 'bg-red-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

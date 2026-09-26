import React, { useState } from 'react';
import { ClassPhotoConfig, UserRole, Student } from '../types';
import { CLASS_INFO } from '../data/mockData';
import { ClassPhotoEditorModal } from './ClassPhotoEditorModal';
import {
  Sparkles,
  Camera,
  Users,
  Award,
  CheckCircle2,
  BookOpen,
  Heart,
  Phone,
  Mail,
} from 'lucide-react';

interface ClassHeroBannerProps {
  photoConfig: ClassPhotoConfig;
  onUpdatePhotoConfig: (newConfig: ClassPhotoConfig) => void;
  currentRole: UserRole;
  students: Student[];
  totalPlusPointsThisWeek: number;
  attendanceRate: number;
  openAssignmentsCount: number;
}

export const ClassHeroBanner: React.FC<ClassHeroBannerProps> = ({
  photoConfig,
  onUpdatePhotoConfig,
  currentRole,
  students,
  totalPlusPointsThisWeek,
  attendanceRate,
  openAssignmentsCount,
}) => {
  const [editorOpen, setEditorOpen] = useState(false);

  // Decorative frame style map
  const frameBorder =
    photoConfig.frameStyle === 'gold'
      ? 'border-4 border-amber-400 ring-4 ring-amber-200/50 shadow-amber-100 shadow-xl'
      : photoConfig.frameStyle === 'chalk'
      ? 'border-6 border-emerald-900 ring-4 ring-amber-800 shadow-xl'
      : photoConfig.frameStyle === 'rainbow'
      ? 'border-4 border-indigo-400 ring-4 ring-pink-300/50 shadow-purple-100 shadow-xl'
      : photoConfig.frameStyle === 'modern'
      ? 'border-4 border-blue-500 ring-4 ring-blue-100 shadow-xl'
      : 'border-2 border-slate-200 shadow-md';

  const totalClassPoints = students.reduce((acc, s) => acc + s.points, 0);

  return (
    <div className="bg-linear-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200 pt-6 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Class Photo Banner + Teacher Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Class Decorated Photo Card (8 cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative group">
              {/* Photo Container */}
              <div
                className={`relative w-full aspect-16/9 sm:aspect-21/9 rounded-2xl overflow-hidden bg-slate-900 transition-all duration-300 ${frameBorder}`}
              >
                <img
                  src={photoConfig.imageUrl}
                  alt="Ảnh tập thể lớp 6A4"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-101"
                  style={{
                    filter: `brightness(${photoConfig.brightness}%) contrast(${photoConfig.contrast}%)`,
                    transform: `rotate(${photoConfig.rotation}deg)`,
                  }}
                />

                {/* Overlaid Decorative Stickers */}
                {photoConfig.stickers.map((stk) => {
                  const icons: Record<string, string> = {
                    book: '📚',
                    star: '⭐',
                    trophy: '🏆',
                    flower: '🌸',
                    pencil: '✏️',
                    medal: '🥇',
                    bulb: '💡',
                    balloon: '🎈',
                  };
                  return (
                    <div
                      key={stk.id}
                      className="absolute pointer-events-none drop-shadow-md select-none animate-pulse"
                      style={{
                        left: `${stk.x}%`,
                        top: `${stk.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${stk.size}px`,
                      }}
                    >
                      {icons[stk.type] || '⭐'}
                    </div>
                  );
                })}

                {/* Slogan & Banner Text Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-slate-950/90 via-slate-950/50 to-transparent p-4 sm:p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-900 rounded-full font-extrabold text-xs sm:text-sm shadow-md tracking-wide">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{photoConfig.slogan}</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-1 drop-shadow-md">
                      🎓 {CLASS_INFO.fullTitle}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium">
                      {photoConfig.academicYear} · {CLASS_INFO.schoolName}
                    </p>
                  </div>

                  {/* Teacher Quick Button to Edit Class Photo */}
                  {currentRole === 'teacher' && (
                    <button
                      type="button"
                      onClick={() => setEditorOpen(true)}
                      className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-white/95 hover:bg-white text-slate-800 rounded-xl text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                      <Camera className="w-4 h-4 text-blue-600" />
                      <span>Chỉnh sửa ảnh & khung lớp</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Homeroom Teacher & Warm Greeting Card (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="relative">
                  <img
                    src={CLASS_INFO.teacher.avatarUrl}
                    alt={CLASS_INFO.teacher.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md ring-2 ring-blue-100"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px] shadow-xs">
                    <Heart className="w-2.5 h-2.5 fill-current" />
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    Giáo viên chủ nhiệm
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {CLASS_INFO.teacher.name}
                  </h3>
                  <p className="text-xs text-slate-500">{CLASS_INFO.teacher.subject}</p>
                </div>
              </div>

              {/* Message of the week */}
              <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 mb-4">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1 mb-1">
                  <span>💌 Lời nhắn tuần này của {CLASS_INFO.teacher.shortName}:</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed italic">
                  "Tuần này lớp mình hãy cùng phấn đấu nề nếp 15 phút đầu giờ và tích cực phát biểu xây dựng bài để giành nhiều Hoa Điểm Mười nhé các em yêu quý!"
                </p>
              </div>

              {/* Quick Contact */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Điện thoại/Zalo: <strong>{CLASS_INFO.teacher.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{CLASS_INFO.teacher.email}</span>
                </div>
              </div>
            </div>

            {currentRole === 'parent' && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-emerald-700 bg-emerald-50/60 p-2.5 rounded-lg flex items-center gap-2">
                <span>💬 Quý phụ huynh có thể trao đổi trực tiếp với {CLASS_INFO.teacher.shortName} ở mục <strong>Sổ Liên Lạc</strong>.</span>
              </div>
            )}
          </div>
        </div>

        {/* 4 Class KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mt-6">
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Sĩ số lớp 6A4</div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums">
                {students.length} <span className="text-xs font-normal text-slate-400">học sinh</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Tổng điểm thưởng</div>
              <div className="text-lg sm:text-xl font-bold text-amber-600 tabular-nums">
                {totalClassPoints} <span className="text-xs font-normal text-slate-400">sao ⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Chuyên cần hôm nay</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-600 tabular-nums">
                {attendanceRate}% <span className="text-xs font-normal text-slate-400">có mặt</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Bài tập đang giao</div>
              <div className="text-lg sm:text-xl font-bold text-purple-600 tabular-nums">
                {openAssignmentsCount} <span className="text-xs font-normal text-slate-400">bài cần nộp</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Photo Editor Modal */}
      {editorOpen && (
        <ClassPhotoEditorModal
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          config={photoConfig}
          onSave={onUpdatePhotoConfig}
        />
      )}
    </div>
  );
};

import React from 'react';
import { Student, UserRole } from '../types';
import { BADGES_LIST } from '../data/mockData';
import { Plus, Minus, History, Palette, Sparkles, Award } from 'lucide-react';

interface StudentStickerCardProps {
  student: Student;
  currentRole: UserRole;
  onOpenPlus: (student: Student) => void;
  onOpenMinus: (student: Student) => void;
  onOpenCustomize: (student: Student) => void;
  onOpenHistory: (student: Student) => void;
}

const FRAME_CLASSES: Record<string, string> = {
  default: 'border-2 border-slate-200/90 shadow-xs',
  gold_star: 'border-3 border-amber-400 ring-2 ring-amber-200/70 shadow-amber-100 shadow-md',
  rainbow_glow: 'border-3 border-purple-400 ring-2 ring-pink-300 shadow-purple-100 shadow-md',
  chalkboard: 'border-4 border-emerald-800 ring-2 ring-amber-700 shadow-md',
  magic_gem: 'border-3 border-cyan-400 ring-2 ring-blue-200 shadow-cyan-100 shadow-md',
  flower_petal: 'border-3 border-rose-400 ring-2 ring-pink-200 shadow-rose-100 shadow-md',
};

const BG_COLOR_CLASSES: Record<string, string> = {
  blue: 'bg-linear-to-b from-blue-50/80 via-white to-blue-50/30 border-blue-200/70',
  amber: 'bg-linear-to-b from-amber-50/80 via-white to-amber-50/30 border-amber-200/70',
  emerald: 'bg-linear-to-b from-emerald-50/80 via-white to-emerald-50/30 border-emerald-200/70',
  rose: 'bg-linear-to-b from-rose-50/80 via-white to-rose-50/30 border-rose-200/70',
  purple: 'bg-linear-to-b from-purple-50/80 via-white to-purple-50/30 border-purple-200/70',
  cyan: 'bg-linear-to-b from-cyan-50/80 via-white to-cyan-50/30 border-cyan-200/70',
};

export const StudentStickerCard: React.FC<StudentStickerCardProps> = ({
  student,
  currentRole,
  onOpenPlus,
  onOpenMinus,
  onOpenCustomize,
  onOpenHistory,
}) => {
  const bgClass = BG_COLOR_CLASSES[student.stickerBgColor] || BG_COLOR_CLASSES.blue;
  const frameClass = FRAME_CLASSES[student.stickerFrame] || FRAME_CLASSES.default;

  // Resolve student badges
  const studentBadges = student.badges
    .map((bId) => BADGES_LIST.find((b) => b.id === bId))
    .filter(Boolean);

  return (
    <div
      className={`relative rounded-2xl border p-4 sm:p-4.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${bgClass} ${frameClass}`}
    >
      {/* Top row: Group pill & Mascot Accessory */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white/90 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
          🏫 {student.group}
        </span>

        <div className="flex items-center gap-1.5">
          {student.accessory && (
            <span
              className="text-xl drop-shadow-xs select-none hover:scale-125 transition-transform"
              title="Biểu tượng cá nhân"
            >
              {student.accessory}
            </span>
          )}
          {currentRole === 'teacher' && (
            <button
              type="button"
              onClick={() => onOpenCustomize(student)}
              title="Chỉnh sửa sticker & ảnh"
              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-white/80 rounded-lg transition-colors"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Middle: Avatar & Basic Information */}
      <div className="flex items-center gap-3.5 my-1">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-xs border-2 border-white ring-2 ring-slate-100">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              loading="lazy"
            />
          </div>
          {student.points >= 50 && (
            <span
              className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full text-[10px] shadow-xs"
              title="Đạt mốc 50 điểm xuất sắc"
            >
              👑
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate leading-snug">
            {student.name}
          </h3>
          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
            <span>🎂 {student.birthday}</span>
            <span>·</span>
            <span>{student.studentCode}</span>
          </div>

          {/* Student Badges Preview Icons */}
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            {studentBadges.slice(0, 3).map((b) => (
              <span
                key={b!.id}
                title={`${b!.name}: ${b!.description}`}
                className="text-xs bg-white/90 border border-slate-200/80 px-1 py-0.2 rounded-md shadow-2xs cursor-help"
              >
                {b!.icon}
              </span>
            ))}
            {studentBadges.length > 3 && (
              <span className="text-[10px] text-slate-400 font-bold">
                +{studentBadges.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Points & History Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500">Tích lũy:</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-sm shadow-xs tabular-nums">
            ⭐ {student.points}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenHistory(student)}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-blue-50/80 transition-colors"
        >
          <History className="w-3 h-3" />
          <span>Lịch sử</span>
        </button>
      </div>

      {/* Direct Quick Action Buttons (➕ and ➖) */}
      {currentRole === 'teacher' ? (
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200/60">
          <button
            type="button"
            onClick={() => onOpenPlus(student)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all hover:scale-102 active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Cộng điểm</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenMinus(student)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all hover:scale-102 active:scale-98"
          >
            <Minus className="w-4 h-4 stroke-[3]" />
            <span>Trừ điểm</span>
          </button>
        </div>
      ) : (
        <div className="mt-3 pt-2 border-t border-slate-200/60 text-center">
          <span className="text-[11px] text-slate-500 italic">
            {student.note || 'Học sinh tích cực lớp 6A4'}
          </span>
        </div>
      )}
    </div>
  );
};

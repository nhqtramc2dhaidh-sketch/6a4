import React, { useState } from 'react';
import { Student } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Plus, Minus, X, Check, Sparkles, AlertTriangle } from 'lucide-react';

interface PointActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  mode: 'plus' | 'minus';
  onConfirm: (studentId: string, type: 'plus' | 'minus', point: number, reason: string) => void;
}

const PLUS_REASONS = [
  { reason: 'Phát biểu xây dựng bài', defaultPoints: 2, icon: '⭐' },
  { reason: 'Làm bài tập đầy đủ và chuẩn bị bài chu đáo', defaultPoints: 2, icon: '📚' },
  { reason: 'Có tiến bộ vượt bậc trong học tập', defaultPoints: 5, icon: '🚀' },
  { reason: 'Tận tình giúp đỡ bạn bè cùng tiến bộ', defaultPoints: 2, icon: '🤝' },
  { reason: 'Hăng hái tham gia hoạt động lớp và phong trào', defaultPoints: 5, icon: '🏆' },
  { reason: 'Làm việc tốt, nhặt được của rơi trả người đánh mất', defaultPoints: 10, icon: '💖' },
  { reason: 'Đạt điểm 10 trong bài kiểm tra', defaultPoints: 5, icon: '💯' },
  { reason: 'Trực nhật lớp sạch sẽ, trách nhiệm', defaultPoints: 2, icon: '🧹' },
];

const MINUS_REASONS = [
  { reason: 'Đi học muộn / Vào lớp muộn', defaultPoints: 1, icon: '⏰' },
  { reason: 'Chưa làm bài tập về nhà', defaultPoints: 2, icon: '⚠️' },
  { reason: 'Quên sách vở / Đồ dùng học tập', defaultPoints: 1, icon: '🎒' },
  { reason: 'Mất trật tự trong giờ học', defaultPoints: 1, icon: '🗣️' },
  { reason: 'Vi phạm nội quy lớp học', defaultPoints: 2, icon: '🚫' },
  { reason: 'Không thực hiện nhiệm vụ trực nhật được giao', defaultPoints: 2, icon: '🧹' },
];

export const PointActionModal: React.FC<PointActionModalProps> = ({
  isOpen,
  onClose,
  student,
  mode,
  onConfirm,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<number>(mode === 'plus' ? 2 : 1);
  const [reason, setReason] = useState<string>(
    mode === 'plus' ? 'Phát biểu xây dựng bài' : 'Mất trật tự trong giờ học'
  );
  const [customReason, setCustomReason] = useState<string>('');
  const [isCustomReason, setIsCustomReason] = useState(false);

  if (!isOpen || !student) return null;

  const pointOptions = mode === 'plus' ? [1, 2, 5, 10] : [1, 2, 5];

  const handleSelectReason = (r: string, p: number) => {
    setReason(r);
    setSelectedPoint(p);
    setIsCustomReason(false);
  };

  const handleConfirm = () => {
    const finalReason = isCustomReason && customReason.trim() ? customReason.trim() : reason;
    const finalPoint = Math.max(1, selectedPoint);

    if (mode === 'plus') {
      sound.playPlusPoint();
      // Trigger joyful celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#38BDF8', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6'],
      });
    } else {
      sound.playMinusPoint();
    }

    onConfirm(student.id, mode, finalPoint, finalReason);
    onClose();
  };

  const afterPoints =
    mode === 'plus'
      ? student.points + selectedPoint
      : Math.max(0, student.points - selectedPoint);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className={`px-5 py-4 flex items-center justify-between text-white ${
            mode === 'plus'
              ? 'bg-linear-to-r from-blue-600 via-indigo-600 to-amber-500'
              : 'bg-linear-to-r from-rose-600 to-amber-600'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white">
              {mode === 'plus' ? <Plus className="w-5 h-5 stroke-[3]" /> : <Minus className="w-5 h-5 stroke-[3]" />}
            </span>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {mode === 'plus' ? 'Cộng Điểm Thưởng Khích Lệ' : 'Trừ Điểm Nhắc Nhở Nề Nếp'}
              </h3>
              <p className="text-xs text-white/80">
                {student.name} · {student.group}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Student Quick Pill & Points Preview */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-12 h-12 rounded-xl bg-white border border-slate-200 object-cover"
              />
              <div>
                <div className="font-bold text-sm text-slate-900">{student.name}</div>
                <div className="text-xs text-slate-500">Mã số: {student.studentCode}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">Điểm hiện tại ➔ Sau thao tác:</div>
              <div className="flex items-center justify-end gap-1.5 text-sm font-extrabold">
                <span className="text-slate-600 tabular-nums">{student.points}</span>
                <span className="text-slate-400">➔</span>
                <span
                  className={`tabular-nums text-base font-black ${
                    mode === 'plus' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {afterPoints} ⭐
                </span>
              </div>
            </div>
          </div>

          {/* Point Selection Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Chọn mức điểm:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {pointOptions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPoint(p)}
                  className={`py-2 px-3 rounded-xl font-extrabold text-sm sm:text-base border transition-all ${
                    selectedPoint === p
                      ? mode === 'plus'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                        : 'bg-rose-600 text-white border-rose-600 shadow-md scale-102'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {mode === 'plus' ? `+${p}` : `-${p}`}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Reasons List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Lý do thực hiện:
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {(mode === 'plus' ? PLUS_REASONS : MINUS_REASONS).map((item) => {
                const isSelected = !isCustomReason && reason === item.reason;
                return (
                  <button
                    key={item.reason}
                    type="button"
                    onClick={() => handleSelectReason(item.reason, item.defaultPoints)}
                    className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isSelected
                        ? mode === 'plus'
                          ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-400'
                          : 'border-rose-500 bg-rose-50 text-rose-900 font-bold ring-1 ring-rose-400'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.reason}</span>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-2 ${
                        mode === 'plus' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {mode === 'plus' ? `+${item.defaultPoints}` : `-${item.defaultPoints}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Reason Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setIsCustomReason(!isCustomReason)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <span>{isCustomReason ? '− Sử dụng lý do có sẵn' : '+ Nhập lý do khác...'}</span>
            </button>
            {isCustomReason && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Ghi rõ lý do cụ thể..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 hover:scale-102 active:scale-98 ${
              mode === 'plus' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>
              Xác nhận {mode === 'plus' ? `+${selectedPoint}` : `-${selectedPoint}`} điểm
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

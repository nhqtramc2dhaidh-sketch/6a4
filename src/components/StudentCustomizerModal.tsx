import React, { useState } from 'react';
import { Student, StickerFrame, StickerBgColor } from '../types';
import { BADGES_LIST } from '../data/mockData';
import { sound } from '../utils/audio';
import { X, Check, Upload, Palette, Sparkles, Award } from 'lucide-react';

interface StudentCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (updatedStudent: Student) => void;
}

const FRAME_OPTIONS: { id: StickerFrame; label: string; previewClass: string }[] = [
  { id: 'default', label: 'Cơ bản nhẹ nhàng', previewClass: 'border-2 border-slate-300' },
  { id: 'gold_star', label: 'Viền Vàng Hoàng Gia 🌟', previewClass: 'border-4 border-amber-400 ring-2 ring-amber-200' },
  { id: 'rainbow_glow', label: 'Cầu Vồng Tỏa Sáng 🌈', previewClass: 'border-4 border-purple-400 ring-2 ring-pink-300' },
  { id: 'chalkboard', label: 'Bảng Phấn Học Trò 🏫', previewClass: 'border-4 border-emerald-800 ring-2 ring-amber-700' },
  { id: 'magic_gem', label: 'Bảo Ngọc Pha Lê 💎', previewClass: 'border-4 border-cyan-400 ring-2 ring-blue-200' },
  { id: 'flower_petal', label: 'Cánh Hoa Điểm Mười 🌸', previewClass: 'border-4 border-rose-400 ring-2 ring-pink-200' },
];

const BG_COLOR_OPTIONS: { id: StickerBgColor; label: string; bgClass: string }[] = [
  { id: 'blue', label: 'Xanh lam tri thức', bgClass: 'bg-blue-50 border-blue-200' },
  { id: 'amber', label: 'Vàng nắng ấm áp', bgClass: 'bg-amber-50 border-amber-200' },
  { id: 'emerald', label: 'Xanh ngọc tươi sáng', bgClass: 'bg-emerald-50 border-emerald-200' },
  { id: 'rose', label: 'Hồng ngọt ngào', bgClass: 'bg-rose-50 border-rose-200' },
  { id: 'purple', label: 'Tím mộng mơ', bgClass: 'bg-purple-50 border-purple-200' },
  { id: 'cyan', label: 'Xanh lơ biển khơi', bgClass: 'bg-cyan-50 border-cyan-200' },
];

const ACCESSORY_OPTIONS = [
  { icon: '⭐', label: 'Ngôi sao' },
  { icon: '🎓', label: 'Mũ cử nhân' },
  { icon: '🚀', label: 'Tên lửa' },
  { icon: '👑', label: 'Vương miện' },
  { icon: '🍀', label: 'Cỏ may mắn' },
  { icon: '🌸', label: 'Hoa đào' },
  { icon: '📚', label: 'Sách vở' },
  { icon: '💡', label: 'Bóng đèn sáng tạo' },
  { icon: '🎨', label: 'Bảng màu' },
  { icon: '⚽', label: 'Bóng đá' },
];

export const StudentCustomizerModal: React.FC<StudentCustomizerModalProps> = ({
  isOpen,
  onClose,
  student,
  onSave,
}) => {
  const [formState, setFormState] = useState<Student | null>(student ? { ...student } : null);

  if (!isOpen || !student || !formState) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormState((prev) => (prev ? { ...prev, avatarUrl: event.target!.result as string } : null));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleBadge = (badgeId: string) => {
    setFormState((prev) => {
      if (!prev) return null;
      const exists = prev.badges.includes(badgeId);
      const newBadges = exists
        ? prev.badges.filter((b) => b !== badgeId)
        : [...prev.badges, badgeId];

      if (!exists) {
        sound.playBadgeUnlocked();
      }

      return {
        ...prev,
        badges: newBadges,
      };
    });
  };

  const handleSave = () => {
    if (formState) {
      onSave(formState);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                Tùy Biến Sticker Học Sinh
              </h3>
              <p className="text-xs text-slate-500">
                {student.name} · {student.group} · {student.studentCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Live Preview of Sticker Card */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-100/70 rounded-2xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Xem trước Sticker học sinh
            </div>

            <div
              className={`relative w-44 rounded-2xl p-3 text-center transition-all shadow-md ${
                BG_COLOR_OPTIONS.find((b) => b.id === formState.stickerBgColor)?.bgClass || 'bg-white'
              }`}
            >
              {/* Accessory icon at top right */}
              {formState.accessory && (
                <div className="absolute top-2 right-2 text-xl drop-shadow-sm select-none">
                  {formState.accessory}
                </div>
              )}

              {/* Avatar with selected frame */}
              <div className="flex justify-center mb-2">
                <div
                  className={`w-20 h-20 rounded-full overflow-hidden bg-white shadow-xs transition-all ${
                    FRAME_OPTIONS.find((f) => f.id === formState.stickerFrame)?.previewClass || 'border-2 border-slate-300'
                  }`}
                >
                  <img
                    src={formState.avatarUrl}
                    alt={formState.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="font-bold text-xs text-slate-900 truncate">{formState.name}</div>
              <div className="text-[10px] text-slate-500 font-medium">{formState.group}</div>

              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-slate-950 font-extrabold text-xs rounded-full shadow-xs">
                <span>⭐ {formState.points}</span>
              </div>

              {/* Active Badges */}
              <div className="flex items-center justify-center gap-1 mt-2 flex-wrap min-h-[20px]">
                {formState.badges.map((bId) => {
                  const b = BADGES_LIST.find((item) => item.id === bId);
                  return b ? (
                    <span key={b.id} title={b.name} className="text-sm">
                      {b.icon}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            {/* Upload Student Photo Button */}
            <div className="mt-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-blue-500 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Tải ảnh học sinh lên từ máy</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Section 1: Choose Frame */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>1. Chọn Khung Sticker:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FRAME_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormState((prev) => (prev ? { ...prev, stickerFrame: f.id } : null))}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    formState.stickerFrame === f.id
                      ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-400'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{f.label}</span>
                    {formState.stickerFrame === f.id && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Choose Background Color */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Đổi Màu Nền Thẻ Sticker:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BG_COLOR_OPTIONS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() =>
                    setFormState((prev) => (prev ? { ...prev, stickerBgColor: bg.id } : null))
                  }
                  className={`p-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                    bg.bgClass
                  } ${
                    formState.stickerBgColor === bg.id
                      ? 'ring-2 ring-blue-600 font-bold shadow-xs'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="text-[11px] block truncate">{bg.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Accessory / Mascot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Phụ Kiện Biểu Tượng:
            </label>
            <div className="flex flex-wrap gap-2">
              {ACCESSORY_OPTIONS.map((acc) => (
                <button
                  key={acc.icon}
                  type="button"
                  onClick={() =>
                    setFormState((prev) => (prev ? { ...prev, accessory: acc.icon } : null))
                  }
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all ${
                    formState.accessory === acc.icon
                      ? 'border-amber-500 bg-amber-100 ring-2 ring-amber-400 scale-110 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                  title={acc.label}
                >
                  {acc.icon}
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => (prev ? { ...prev, accessory: undefined } : null))
                }
                className="px-2.5 h-10 rounded-xl text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-500"
              >
                Không dùng
              </button>
            </div>
          </div>

          {/* Section 4: Badges Management */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>4. Trao Tặng Huy Hiệu Vinh Danh:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BADGES_LIST.map((badge) => {
                const hasBadge = formState.badges.includes(badge.id);
                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => toggleBadge(badge.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      hasBadge
                        ? 'border-amber-400 bg-amber-50/80 ring-1 ring-amber-400'
                        : 'border-slate-200 bg-white hover:border-slate-300 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{badge.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {badge.name}
                        </span>
                        {hasBadge && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-200/80 px-1.5 py-0.2 rounded-md">
                            Đã trao ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {badge.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
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
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Lưu Thay Đổi Sticker</span>
          </button>
        </div>
      </div>
    </div>
  );
};

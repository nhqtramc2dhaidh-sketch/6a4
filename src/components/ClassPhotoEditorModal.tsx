import React, { useState } from 'react';
import { ClassPhotoConfig } from '../types';
import { CLASS_INFO } from '../data/mockData';
import {
  X,
  Upload,
  RotateCw,
  SunMedium,
  Contrast,
  SlidersHorizontal,
  Check,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface ClassPhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ClassPhotoConfig;
  onSave: (newConfig: ClassPhotoConfig) => void;
}

const STICKER_OPTIONS = [
  { type: 'book', icon: '📚', label: 'Sách vở' },
  { type: 'star', icon: '⭐', label: 'Ngôi sao' },
  { type: 'trophy', icon: '🏆', label: 'Huy chương' },
  { type: 'flower', icon: '🌸', label: 'Hoa điểm 10' },
  { type: 'pencil', icon: '✏️', label: 'Bút chì' },
  { type: 'medal', icon: '🥇', label: 'Huy chương vàng' },
  { type: 'bulb', icon: '💡', label: 'Ý tưởng' },
  { type: 'balloon', icon: '🎈', label: 'Bóng bay' },
];

const FRAME_OPTIONS = [
  { id: 'gold', name: 'Vàng hoàng kim', borderClass: 'border-4 border-amber-400 shadow-amber-200/50 ring-4 ring-amber-300/40' },
  { id: 'chalk', name: 'Bảng phấn lớp học', borderClass: 'border-8 border-emerald-900 bg-emerald-950/20 ring-4 ring-amber-700/60' },
  { id: 'rainbow', name: 'Cầu vồng tỏa sáng', borderClass: 'border-4 border-indigo-400 ring-4 ring-pink-400/50 shadow-lg shadow-purple-200' },
  { id: 'modern', name: 'Hiện đại thanh lịch', borderClass: 'border-4 border-blue-500 ring-4 ring-blue-100' },
  { id: 'simple', name: 'Viền trắng tối giản', borderClass: 'border-4 border-white shadow-md' },
];

export const ClassPhotoEditorModal: React.FC<ClassPhotoEditorModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [localConfig, setLocalConfig] = useState<ClassPhotoConfig>({ ...config });
  const [activeTab, setActiveTab] = useState<'adjust' | 'frame' | 'stickers' | 'text'>('adjust');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLocalConfig((prev) => ({
            ...prev,
            imageUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotate = () => {
    setLocalConfig((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const handleReset = () => {
    setLocalConfig({
      imageUrl: CLASS_INFO.classBannerUrl,
      slogan: 'Lớp 6A4 Đoàn Kết - Chăm Ngoan - Tự Tin',
      academicYear: 'Năm học 2026 - 2027',
      frameStyle: 'gold',
      brightness: 100,
      contrast: 100,
      rotation: 0,
      stickers: [
        { id: 'stk-1', type: 'book', x: 8, y: 15, size: 40 },
        { id: 'stk-2', type: 'star', x: 88, y: 14, size: 44 },
        { id: 'stk-3', type: 'flower', x: 92, y: 78, size: 38 },
      ],
    });
  };

  const toggleSticker = (type: string) => {
    const exists = localConfig.stickers.find((s) => s.type === type);
    if (exists) {
      setLocalConfig((prev) => ({
        ...prev,
        stickers: prev.stickers.filter((s) => s.type !== type),
      }));
    } else {
      // Add at random pleasant corner
      const corners = [
        { x: 10, y: 20 },
        { x: 88, y: 20 },
        { x: 12, y: 75 },
        { x: 88, y: 75 },
        { x: 50, y: 15 },
      ];
      const slot = corners[localConfig.stickers.length % corners.length];
      const newStk = {
        id: `stk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        x: slot.x,
        y: slot.y,
        size: 40,
      };
      setLocalConfig((prev) => ({
        ...prev,
        stickers: [...prev.stickers, newStk],
      }));
    }
  };

  const currentFrameClass =
    FRAME_OPTIONS.find((f) => f.id === localConfig.frameStyle)?.borderClass || 'border-4 border-amber-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Xưởng Chỉnh Sửa Ảnh & Khung Lớp 6A4
              </h2>
              <p className="text-xs text-slate-500">
                Tải ảnh lớp từ máy, xoay góc, chỉnh sáng tối, thêm khung và sticker sinh động
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 self-start flex items-center justify-between w-full">
              <span>Xem trước ảnh lớp thời gian thực</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Đặt lại gốc
              </button>
            </div>

            {/* Simulated Frame & Canvas */}
            <div
              className={`relative w-full aspect-16/9 rounded-xl overflow-hidden shadow-md transition-all ${currentFrameClass}`}
              style={{
                backgroundColor: '#1E293B',
              }}
            >
              <img
                src={localConfig.imageUrl}
                alt="Ảnh lớp 6A4"
                className="w-full h-full object-cover transition-transform duration-300"
                style={{
                  filter: `brightness(${localConfig.brightness}%) contrast(${localConfig.contrast}%)`,
                  transform: `rotate(${localConfig.rotation}deg)`,
                }}
              />

              {/* Decorative Stickers Overlay */}
              {localConfig.stickers.map((stk) => {
                const opt = STICKER_OPTIONS.find((o) => o.type === stk.type);
                return (
                  <div
                    key={stk.id}
                    className="absolute pointer-events-none drop-shadow-lg select-none transition-all animate-bounce"
                    style={{
                      left: `${stk.x}%`,
                      top: `${stk.y}%`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: `${stk.size}px`,
                      animationDuration: '3s',
                    }}
                  >
                    {opt?.icon || '⭐'}
                  </div>
                );
              })}

              {/* Slogan Banner Overlay on Image */}
              <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-slate-950/85 via-slate-900/40 to-transparent p-3 sm:p-4 text-center">
                <div className="inline-block px-3 py-1 bg-amber-400 text-slate-900 font-extrabold text-xs sm:text-sm rounded-full shadow-md tracking-wide">
                  {localConfig.slogan || 'Lớp 6A4 Đoàn Kết'}
                </div>
                <div className="text-white/90 text-[11px] sm:text-xs font-semibold mt-1 drop-shadow-sm">
                  {localConfig.academicYear} · {CLASS_INFO.schoolName}
                </div>
              </div>
            </div>

            {/* Quick Upload Trigger */}
            <div className="w-full mt-4 flex items-center gap-2">
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition-colors">
                <Upload className="w-4 h-4" />
                <span>Tải ảnh mới từ máy tính / điện thoại</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={handleRotate}
                title="Xoay 90 độ"
                className="p-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                <span>{localConfig.rotation}°</span>
              </button>
            </div>
          </div>

          {/* Right Editing Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col bg-slate-50 rounded-xl p-4 border border-slate-200">
            {/* Tabs for tools */}
            <div className="flex rounded-lg bg-slate-200/80 p-1 text-xs font-semibold mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('adjust')}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  activeTab === 'adjust' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Màu sắc
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('frame')}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  activeTab === 'frame' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Khung viền
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stickers')}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  activeTab === 'stickers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sticker
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  activeTab === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chữ slogan
              </button>
            </div>

            {/* Tab: Adjust */}
            {activeTab === 'adjust' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <SunMedium className="w-3.5 h-3.5 text-amber-500" /> Độ sáng (Brightness)
                    </span>
                    <span className="tabular-nums font-bold">{localConfig.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={localConfig.brightness}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({ ...prev, brightness: Number(e.target.value) }))
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Contrast className="w-3.5 h-3.5 text-indigo-500" /> Độ tương phản (Contrast)
                    </span>
                    <span className="tabular-nums font-bold">{localConfig.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={localConfig.contrast}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({ ...prev, contrast: Number(e.target.value) }))
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="text-xs font-medium text-slate-600 mb-2">Bộ lọc nhanh:</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setLocalConfig((p) => ({ ...p, brightness: 100, contrast: 100 }))}
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs hover:border-blue-400 font-medium text-slate-700"
                    >
                      Chuẩn gốc
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocalConfig((p) => ({ ...p, brightness: 115, contrast: 110 }))}
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs hover:border-blue-400 font-medium text-slate-700"
                    >
                      Tươi sáng ✨
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocalConfig((p) => ({ ...p, brightness: 105, contrast: 125 }))}
                      className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs hover:border-blue-400 font-medium text-slate-700"
                    >
                      Đậm đà 🎨
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Frame */}
            {activeTab === 'frame' && (
              <div className="space-y-2.5">
                <div className="text-xs text-slate-500 mb-2">
                  Chọn mẫu khung ảnh lớp phong cách học đường:
                </div>
                {FRAME_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setLocalConfig((prev) => ({ ...prev, frameStyle: f.id as any }))}
                    className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      localConfig.frameStyle === f.id
                        ? 'border-blue-500 bg-blue-50 font-bold text-blue-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-xs">{f.name}</span>
                    {localConfig.frameStyle === f.id && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Tab: Stickers */}
            {activeTab === 'stickers' && (
              <div>
                <div className="text-xs text-slate-500 mb-2">
                  Nhấn vào sticker để bật/tắt trang trí trên ảnh lớp:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {STICKER_OPTIONS.map((stk) => {
                    const isSelected = localConfig.stickers.some((s) => s.type === stk.type);
                    return (
                      <button
                        key={stk.type}
                        type="button"
                        onClick={() => toggleSticker(stk.type)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-50 font-bold text-amber-900 ring-1 ring-amber-300'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="text-xl">{stk.icon}</span>
                        <div className="truncate">
                          <div>{stk.label}</div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {isSelected ? 'Đang gắn ✓' : 'Chưa gắn'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Text */}
            {activeTab === 'text' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Khẩu hiệu / Slogan lớp 6A4:
                  </label>
                  <input
                    type="text"
                    value={localConfig.slogan}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({ ...prev, slogan: e.target.value }))
                    }
                    placeholder="Ví dụ: Lớp 6A4 đoàn kết - chăm ngoan"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Năm học:
                  </label>
                  <input
                    type="text"
                    value={localConfig.academicYear}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({ ...prev, academicYear: e.target.value }))
                    }
                    placeholder="Năm học 2026 - 2027"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>

                <div className="pt-2 text-xs text-slate-500">
                  💡 Gợi ý câu nói hay:
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600">
                    <li
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() =>
                        setLocalConfig((p) => ({ ...p, slogan: 'Lớp 6A4 Đoàn Kết - Chăm Ngoan' }))
                      }
                    >
                      "Lớp 6A4 Đoàn Kết - Chăm Ngoan"
                    </li>
                    <li
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() =>
                        setLocalConfig((p) => ({ ...p, slogan: 'Cùng Học Tập - Cùng Tiến Bộ' }))
                      }
                    >
                      "Cùng Học Tập - Cùng Tiến Bộ"
                    </li>
                    <li
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() =>
                        setLocalConfig((p) => ({ ...p, slogan: 'Mỗi Ngày Đến Trường Là Một Niềm Vui' }))
                      }
                    >
                      "Mỗi Ngày Đến Trường Là Một Niềm Vui"
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(localConfig);
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Lưu & Áp Dụng Lên Bảng Lớp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

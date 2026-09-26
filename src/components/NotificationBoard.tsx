import React, { useState } from 'react';
import { ClassNotice, UserRole } from '../types';
import { Bell, Pin, PlusCircle, CheckCheck, Calendar, Users, X } from 'lucide-react';

interface NotificationBoardProps {
  notices: ClassNotice[];
  currentRole: UserRole;
  onAddNotice: (notice: ClassNotice) => void;
  onTogglePin: (noticeId: string) => void;
}

export const NotificationBoard: React.FC<NotificationBoardProps> = ({
  notices,
  currentRole,
  onAddNotice,
  onTogglePin,
}) => {
  const [newNoticeModalOpen, setNewNoticeModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'general' | 'meeting' | 'exam' | 'activity'>('general');
  const [isPinned, setIsPinned] = useState(false);

  // Sorting: Pinned first, then date/order
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newN: ClassNotice = {
      id: `notice-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      date: new Date().toLocaleDateString('vi-VN'),
      isPinned,
      author: 'Cô Nguyễn Hoàng Quỳnh Trâm',
      readsCount: 1,
    };

    onAddNotice(newN);
    setTitle('');
    setContent('');
    setIsPinned(false);
    setNewNoticeModalOpen(false);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'meeting':
        return { label: 'Họp phụ huynh', color: 'bg-rose-100 text-rose-800' };
      case 'activity':
        return { label: 'Hoạt động / Thi đua', color: 'bg-amber-100 text-amber-800' };
      case 'exam':
        return { label: 'Lịch thi & Kiểm tra', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Thông báo chung', color: 'bg-blue-100 text-blue-800' };
    }
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-extrabold mb-2 shadow-2xs">
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>Bảng Tin Lớp Học</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Thông Báo Lớp 6A4
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Các tin tức, thông báo họp phụ huynh và hoạt động phong trào của lớp
          </p>
        </div>

        {currentRole === 'teacher' && (
          <button
            type="button"
            onClick={() => setNewNoticeModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-102 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng thông báo mới</span>
          </button>
        )}
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {sortedNotices.map((n) => {
          const cat = getCategoryBadge(n.category);
          return (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all ${
                n.isPinned
                  ? 'border-amber-300 bg-linear-to-r from-amber-50/50 via-white to-amber-50/20 shadow-xs ring-1 ring-amber-200'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {n.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-2xs">
                      <Pin className="w-3 h-3 fill-current" /> ĐÃ GHIM
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${cat.color}`}>
                    {cat.label}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {n.date}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {n.readsCount} phụ huynh đã xem
                  </span>
                  {currentRole === 'teacher' && (
                    <button
                      type="button"
                      onClick={() => onTogglePin(n.id)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                        n.isPinned
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {n.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {n.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 mt-2 whitespace-pre-line leading-relaxed">
                {n.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Người gửi: <strong>{n.author}</strong></span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCheck className="w-4 h-4" /> Đã gửi SMS/Zalo thông báo
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal create notice */}
      {newNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900">Đăng Thông Báo Lớp Mới</h3>
              <button
                onClick={() => setNewNoticeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề thông báo *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Kế hoạch ngoại khóa / Lịch thi học kỳ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thể loại</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="general">Thông báo chung</option>
                    <option value="meeting">Họp phụ huynh</option>
                    <option value="activity">Hoạt động / Thi đua</option>
                    <option value="exam">Lịch thi & Kiểm tra</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="rounded-sm accent-amber-500 w-4 h-4"
                    />
                    <span>Ghim thông báo quan trọng</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung chi tiết *</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Kính gửi Quý Cha Mẹ Học sinh..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewNoticeModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors"
                >
                  Phát Thông Báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

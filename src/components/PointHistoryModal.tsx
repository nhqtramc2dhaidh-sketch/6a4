import React, { useState } from 'react';
import { Student, RewardPointRecord, UserRole } from '../types';
import { X, Trash2, Edit3, Check, Calendar, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PointHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  history: RewardPointRecord[];
  currentRole: UserRole;
  onDeleteRecord: (recordId: string) => void;
  onEditRecord: (recordId: string, newReason: string, newPoint: number) => void;
}

export const PointHistoryModal: React.FC<PointHistoryModalProps> = ({
  isOpen,
  onClose,
  student,
  history,
  currentRole,
  onDeleteRecord,
  onEditRecord,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editReason, setEditReason] = useState<string>('');
  const [editPoint, setEditPoint] = useState<number>(1);

  if (!isOpen || !student) return null;

  const studentLogs = history.filter((h) => h.studentId === student.id);

  const startEdit = (record: RewardPointRecord) => {
    setEditingId(record.id);
    setEditReason(record.reason);
    setEditPoint(record.point);
  };

  const saveEdit = (id: string) => {
    onEditRecord(id, editReason, editPoint);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <History className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                Nhật Ký Điểm Thưởng & Phạt
              </h3>
              <p className="text-xs text-slate-500">
                {student.name} · {student.group} · Tổng tích lũy: <strong>{student.points} ⭐</strong>
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

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5">
          {studentLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-12 h-12 mx-auto stroke-1 mb-2 opacity-50" />
              <p className="text-sm font-medium">Chưa có lịch sử điểm thưởng/phạt nào.</p>
              <p className="text-xs text-slate-400 mt-1">
                Các lượt cộng điểm và nhắc nhở nề nếp sẽ hiển thị chi tiết tại đây.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentLogs.map((item) => {
                const isEditing = editingId === item.id;
                const isPlus = item.type === 'plus';

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isPlus
                        ? 'border-blue-100 bg-blue-50/40 hover:border-blue-200'
                        : 'border-rose-100 bg-rose-50/40 hover:border-rose-200'
                    }`}
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={editPoint}
                            onChange={(e) => setEditPoint(Number(e.target.value))}
                            className="w-20 text-xs px-2 py-1.5 border border-slate-300 rounded-md font-bold"
                          />
                          <input
                            type="text"
                            value={editReason}
                            onChange={(e) => setEditReason(e.target.value)}
                            className="flex-1 text-xs px-2 py-1.5 border border-slate-300 rounded-md"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 text-xs text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEdit(item.id)}
                            className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Lưu
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isPlus
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {isPlus ? (
                              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-black px-2 py-0.5 rounded-md ${
                                  isPlus
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-rose-600 text-white'
                                }`}
                              >
                                {isPlus ? `+${item.point} điểm` : `-${item.point} điểm`}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {item.date}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-slate-800 mt-1">
                              {item.reason}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Người ghi nhận: {item.teacherName}
                            </p>
                          </div>
                        </div>

                        {/* Teacher actions: Edit & Undo Delete */}
                        {currentRole === 'teacher' && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              title="Sửa lý do / số điểm"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Bạn có chắc chắn muốn xóa bản ghi này? Điểm của ${student.name} sẽ được tự động hoàn lại!`
                                  )
                                ) {
                                  onDeleteRecord(item.id);
                                }
                              }}
                              title="Xóa nhầm thao tác (Hoàn lại điểm)"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Tổng số lượt ghi nhận: {studentLogs.length}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

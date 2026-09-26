import React, { useState } from 'react';
import { Student, UserRole, RewardPointRecord } from '../types';
import { StudentStickerCard } from './StudentStickerCard';
import { PointActionModal } from './PointActionModal';
import { StudentCustomizerModal } from './StudentCustomizerModal';
import { PointHistoryModal } from './PointHistoryModal';
import { getStudentSvgAvatar } from '../data/mockData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Search,
  Users,
  Award,
  PlusCircle,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';

interface StickerBoardProps {
  students: Student[];
  currentRole: UserRole;
  rewardLogs: RewardPointRecord[];
  onAddPoint: (studentId: string, type: 'plus' | 'minus', point: number, reason: string) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onAddStudent: (newStudent: Student) => void;
  onDeleteRecord: (recordId: string) => void;
  onEditRecord: (recordId: string, newReason: string, newPoint: number) => void;
}

export const StickerBoard: React.FC<StickerBoardProps> = ({
  students,
  currentRole,
  rewardLogs,
  onAddPoint,
  onUpdateStudent,
  onAddStudent,
  onDeleteRecord,
  onEditRecord,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'points_desc' | 'name_asc' | 'points_asc'>('points_desc');

  // Modal states
  const [pointModalStudent, setPointModalStudent] = useState<Student | null>(null);
  const [pointModalMode, setPointModalMode] = useState<'plus' | 'minus'>('plus');
  const [customizingStudent, setCustomizingStudent] = useState<Student | null>(null);
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);
  const [newStudentModalOpen, setNewStudentModalOpen] = useState(false);
  const [groupBonusModalOpen, setGroupBonusModalOpen] = useState(false);
  const [groupBonusTarget, setGroupBonusTarget] = useState<'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4'>('Tổ 1');
  const [groupBonusPoints, setGroupBonusPoints] = useState<number>(2);
  const [groupBonusReason, setGroupBonusReason] = useState<string>('Trực nhật tổ xuất sắc');

  // Filter & Sort
  const filteredStudents = students.filter((stu) => {
    const matchesGroup = selectedGroup === 'all' || stu.group === selectedGroup;
    const matchesSearch =
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.studentCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'points_desc') return b.points - a.points;
    if (sortBy === 'points_asc') return a.points - b.points;
    if (sortBy === 'name_asc') {
      const getLastName = (fullName: string) => fullName.trim().split(' ').slice(-1)[0] || '';
      return getLastName(a.name).localeCompare(getLastName(b.name), 'vi');
    }
    return 0;
  });

  // Handler for group bonus
  const handleGroupBonus = () => {
    const groupStudents = students.filter((s) => s.group === groupBonusTarget);
    groupStudents.forEach((s) => {
      onAddPoint(s.id, 'plus', groupBonusPoints, `[Khen thưởng cả ${groupBonusTarget}] ${groupBonusReason}`);
    });
    sound.playBadgeUnlocked();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
    });
    setGroupBonusModalOpen(false);
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-extrabold mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Không gian Gamification Lớp 6A4</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Bảng Sticker Học Sinh Lớp 6A4
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Mỗi học sinh là một thẻ sticker sinh động · Nhấn trực tiếp ➕ để cộng sao hoặc ➖ để nhắc nhở nề nếp
          </p>
        </div>

        {/* Action Controls for Teacher */}
        {currentRole === 'teacher' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setGroupBonusModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold shadow-2xs transition-all hover:scale-102"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>Thưởng cả Tổ ⭐</span>
            </button>

            <button
              type="button"
              onClick={() => setNewStudentModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-102"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm học sinh mới</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Group Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['all', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'].map((grp) => (
              <button
                key={grp}
                type="button"
                onClick={() => setSelectedGroup(grp)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedGroup === grp
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grp === 'all' ? `Tất cả (${students.length} em)` : grp}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="points_desc">⭐ Điểm tích lũy cao nhất</option>
              <option value="points_asc">🌱 Cần khích lệ (Điểm thấp)</option>
              <option value="name_asc">🔤 Tên học sinh A - Z</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm học sinh theo họ tên hoặc mã số (ví dụ: An, Ánh, 6A4-01)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Sticker Grid */}
      {sortedStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Users className="w-12 h-12 mx-auto stroke-1 opacity-40 mb-3" />
          <p className="text-sm font-semibold">Không tìm thấy học sinh nào phù hợp.</p>
          <p className="text-xs text-slate-400 mt-1">
            Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc chọn lại bộ lọc Tổ.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedStudents.map((student) => (
            <StudentStickerCard
              key={student.id}
              student={student}
              currentRole={currentRole}
              onOpenPlus={(stu) => {
                setPointModalStudent(stu);
                setPointModalMode('plus');
              }}
              onOpenMinus={(stu) => {
                setPointModalStudent(stu);
                setPointModalMode('minus');
              }}
              onOpenCustomize={(stu) => setCustomizingStudent(stu)}
              onOpenHistory={(stu) => setHistoryStudent(stu)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {pointModalStudent && (
        <PointActionModal
          isOpen={!!pointModalStudent}
          onClose={() => setPointModalStudent(null)}
          student={pointModalStudent}
          mode={pointModalMode}
          onConfirm={(studentId, type, point, reason) => {
            onAddPoint(studentId, type, point, reason);
          }}
        />
      )}

      {customizingStudent && (
        <StudentCustomizerModal
          isOpen={!!customizingStudent}
          onClose={() => setCustomizingStudent(null)}
          student={customizingStudent}
          onSave={onUpdateStudent}
        />
      )}

      {historyStudent && (
        <PointHistoryModal
          isOpen={!!historyStudent}
          onClose={() => setHistoryStudent(null)}
          student={historyStudent}
          history={rewardLogs}
          currentRole={currentRole}
          onDeleteRecord={onDeleteRecord}
          onEditRecord={onEditRecord}
        />
      )}

      {/* Modal Thưởng Cả Tổ */}
      {groupBonusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Khen Thưởng Đồng Loạt Cả Tổ
                </h3>
                <p className="text-xs text-slate-500">
                  Cộng điểm đồng đều cho tất cả học sinh trong tổ
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chọn Tổ khen thưởng:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGroupBonusTarget(g)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      groupBonusTarget === g
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mức điểm thưởng mỗi em:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 5].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setGroupBonusPoints(p)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      groupBonusPoints === p
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    +{p} điểm ⭐
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lý do khen thưởng:
              </label>
              <input
                type="text"
                value={groupBonusReason}
                onChange={(e) => setGroupBonusReason(e.target.value)}
                placeholder="Ví dụ: Trực nhật tổ sạch sẽ, hoạt động nhóm xuất sắc..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setGroupBonusModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleGroupBonus}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition-colors"
              >
                Thưởng Ngay Cho {groupBonusTarget}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm Học Sinh Mới */}
      {newStudentModalOpen && (
        <NewStudentFormModal
          isOpen={newStudentModalOpen}
          onClose={() => setNewStudentModalOpen(false)}
          existingCount={students.length}
          onAdd={(newStu) => {
            onAddStudent(newStu);
            setNewStudentModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Sub-component for adding new student
const NewStudentFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  existingCount: number;
  onAdd: (student: Student) => void;
}> = ({ isOpen, onClose, existingCount, onAdd }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthday, setBirthday] = useState('01/01/2014');
  const [group, setGroup] = useState<'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4'>('Tổ 1');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('0909.123.456');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `s${String(existingCount + 1).padStart(2, '0')}`;
    const code = `6A4-${String(existingCount + 1).padStart(2, '0')}`;

    const newStudent: Student = {
      id: newId,
      studentCode: code,
      name: name.trim(),
      gender,
      birthday,
      group,
      avatarUrl: getStudentSvgAvatar(name.trim(), gender, existingCount + 1),
      points: 20, // Initial welcome bonus
      stickerFrame: 'default',
      stickerBgColor: 'blue',
      accessory: '⭐',
      badges: ['daily_progress'],
      parentName: parentName.trim() || 'Phụ huynh học sinh',
      parentPhone: parentPhone.trim() || '0909.123.456',
    };

    onAdd(newStudent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-5">
        <h3 className="font-bold text-base text-slate-900 mb-1">Thêm Học Sinh Mới Vào Lớp 6A4</h3>
        <p className="text-xs text-slate-500 mb-4">Hồ sơ sticker điện tử sẽ được tự động kích hoạt</p>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Họ và tên học sinh *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Gia Huy"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ngày sinh</label>
              <input
                type="text"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phân công Tổ</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="Tổ 1">Tổ 1</option>
                <option value="Tổ 2">Tổ 2</option>
                <option value="Tổ 3">Tổ 3</option>
                <option value="Tổ 4">Tổ 4</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">SĐT Phụ huynh</label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="09xx.xxx.xxx"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Họ tên Phụ huynh</label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn Hùng (Bố)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors"
            >
              Lưu Học Sinh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

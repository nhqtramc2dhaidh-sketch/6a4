import React, { useState } from 'react';
import { Student, SubjectScore, UserRole } from '../types';
import { SUBJECTS_LIST } from '../data/mockData';
import { Award, Search, Edit3, Check, Filter, TrendingUp, BarChart2 } from 'lucide-react';

interface GradeManagementProps {
  students: Student[];
  scores: SubjectScore[];
  currentRole: UserRole;
  selectedStudentId: string;
  onUpdateScore: (updatedScore: SubjectScore) => void;
}

export const GradeManagement: React.FC<GradeManagementProps> = ({
  students,
  scores,
  currentRole,
  selectedStudentId,
  onUpdateScore,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Toán');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchName, setSearchName] = useState<string>('');
  const [editingKey, setEditingKey] = useState<string | null>(null); // studentId_subject
  const [editScoreData, setEditScoreData] = useState<SubjectScore | null>(null);

  // If role is parent or student, filter specifically to that student or provide view
  const isIndividualView = currentRole === 'parent' || currentRole === 'student';

  const displayedStudents = students.filter((s) => {
    if (isIndividualView) return s.id === selectedStudentId;
    const matchesGroup = selectedGroup === 'all' || s.group === selectedGroup;
    const matchesName = s.name.toLowerCase().includes(searchName.toLowerCase());
    return matchesGroup && matchesName;
  });

  const getScore = (studentId: string, subject: string): SubjectScore => {
    const found = scores.find((sc) => sc.studentId === studentId && sc.subject === subject);
    if (found) return found;
    return {
      studentId,
      subject,
      tx: [8, 8.5, 9, 8],
      gk: 8.5,
      ck: 9,
      average: 8.6,
    };
  };

  const startEdit = (studentId: string, subject: string) => {
    const current = getScore(studentId, subject);
    setEditScoreData({ ...current });
    setEditingKey(`${studentId}_${subject}`);
  };

  const saveEdit = () => {
    if (editScoreData) {
      // Recalculate average
      const txSum: number = editScoreData.tx.reduce<number>((acc, val) => acc + (val ?? 0), 0);
      const gk = editScoreData.gk ?? 0;
      const ck = editScoreData.ck ?? 0;
      const count = editScoreData.tx.length + 2 + 3; // tx 1x, gk 2x, ck 3x
      const avg = Math.round(((txSum + gk * 2 + ck * 3) / count) * 10) / 10;

      const finalScore = {
        ...editScoreData,
        average: avg,
      };

      onUpdateScore(finalScore);
      setEditingKey(null);
      setEditScoreData(null);
    }
  };

  // Performance classification helper
  const getRank = (avg: number | null) => {
    if (avg === null) return { label: 'Chưa đủ điểm', color: 'text-slate-400 bg-slate-100' };
    if (avg >= 9.0) return { label: 'Xuất sắc 🌟', color: 'text-purple-700 bg-purple-100 font-extrabold' };
    if (avg >= 8.0) return { label: 'Giỏi ⭐', color: 'text-blue-700 bg-blue-100 font-bold' };
    if (avg >= 6.5) return { label: 'Khá 👍', color: 'text-emerald-700 bg-emerald-100 font-medium' };
    if (avg >= 5.0) return { label: 'Đạt', color: 'text-amber-700 bg-amber-100' };
    return { label: 'Cần cố gắng', color: 'text-rose-700 bg-rose-100' };
  };

  // Class subject average
  const subjectScores = scores.filter((sc) => sc.subject === selectedSubject && sc.average !== null);
  const classSubjectAvg =
    subjectScores.length > 0
      ? (subjectScores.reduce((acc, curr) => acc + (curr.average || 0), 0) / subjectScores.length).toFixed(1)
      : '8.3';

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-extrabold mb-2 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Sổ Điểm Điện Tử Theo Thông Tư 22</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý & Theo Dõi Điểm Học Tập - Lớp 6A4
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Điểm ĐĐGtx (hệ số 1), ĐĐGgk (hệ số 2), ĐĐGck (hệ số 3) · Tự động tính điểm trung bình
          </p>
        </div>

        {/* Quick Subject Average KPI */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">ĐTB Môn {selectedSubject} cả lớp</div>
            <div className="text-base sm:text-lg font-black text-blue-700 tabular-nums">
              {classSubjectAvg} / 10
            </div>
          </div>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {SUBJECTS_LIST.map((sub) => (
          <button
            key={sub}
            type="button"
            onClick={() => setSelectedSubject(sub)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSubject === sub
                ? 'bg-blue-600 text-white shadow-xs scale-102'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Filters Bar (Group and Name) */}
      {!isIndividualView && (
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {['all', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGroup(g)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedGroup === g
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g === 'all' ? 'Tất cả các tổ' : g}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Tìm theo tên học sinh..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Grade Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                <th className="py-3.5 px-4 min-w-[180px]">Học sinh</th>
                <th className="py-3.5 px-3 text-center">Tổ</th>
                <th className="py-3.5 px-2 text-center">TX 1</th>
                <th className="py-3.5 px-2 text-center">TX 2</th>
                <th className="py-3.5 px-2 text-center">TX 3</th>
                <th className="py-3.5 px-2 text-center">TX 4</th>
                <th className="py-3.5 px-3 text-center bg-blue-50/50">Giữa kỳ (x2)</th>
                <th className="py-3.5 px-3 text-center bg-amber-50/50">Cuối kỳ (x3)</th>
                <th className="py-3.5 px-3 text-center bg-indigo-50 font-black text-indigo-900">
                  ĐTB Môn
                </th>
                <th className="py-3.5 px-3 text-center">Xếp loại</th>
                {currentRole === 'teacher' && <th className="py-3.5 px-3 text-center w-20">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedStudents.map((student, idx) => {
                const scoreData = getScore(student.id, selectedSubject);
                const isEditing = editingKey === `${student.id}_${selectedSubject}`;
                const rank = getRank(scoreData.average);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-400 tabular-nums">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                        />
                        <div>
                          <div>{student.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {student.studentCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center text-slate-500 font-medium">
                      {student.group}
                    </td>

                    {/* Regular Assessment Scores (TX 1 - 4) */}
                    {[0, 1, 2, 3].map((pos) => (
                      <td key={pos} className="py-3 px-2 text-center tabular-nums font-semibold">
                        {isEditing && editScoreData ? (
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={editScoreData.tx[pos] ?? ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? null : Number(e.target.value);
                              const newTx = [...editScoreData.tx];
                              newTx[pos] = val;
                              setEditScoreData({ ...editScoreData, tx: newTx });
                            }}
                            className="w-12 text-center py-1 px-1 bg-blue-50 border border-blue-300 rounded font-bold"
                          />
                        ) : (
                          scoreData.tx[pos] ?? '-'
                        )}
                      </td>
                    ))}

                    {/* Midterm Score */}
                    <td className="py-3 px-3 text-center tabular-nums font-bold bg-blue-50/30 text-blue-800">
                      {isEditing && editScoreData ? (
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={editScoreData.gk ?? ''}
                          onChange={(e) =>
                            setEditScoreData({
                              ...editScoreData,
                              gk: e.target.value === '' ? null : Number(e.target.value),
                            })
                          }
                          className="w-12 text-center py-1 px-1 bg-white border border-blue-400 rounded font-bold"
                        />
                      ) : (
                        scoreData.gk ?? '-'
                      )}
                    </td>

                    {/* Final Term Score */}
                    <td className="py-3 px-3 text-center tabular-nums font-bold bg-amber-50/30 text-amber-800">
                      {isEditing && editScoreData ? (
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={editScoreData.ck ?? ''}
                          onChange={(e) =>
                            setEditScoreData({
                              ...editScoreData,
                              ck: e.target.value === '' ? null : Number(e.target.value),
                            })
                          }
                          className="w-12 text-center py-1 px-1 bg-white border border-amber-400 rounded font-bold"
                        />
                      ) : (
                        scoreData.ck ?? '-'
                      )}
                    </td>

                    {/* Subject Average */}
                    <td className="py-3 px-3 text-center tabular-nums font-black text-sm bg-indigo-50 text-indigo-700">
                      {scoreData.average ?? '-'}
                    </td>

                    {/* Rank Badge */}
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${rank.color}`}>
                        {rank.label}
                      </span>
                    </td>

                    {/* Teacher Action */}
                    {currentRole === 'teacher' && (
                      <td className="py-3 px-3 text-center">
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="p-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                            title="Lưu điểm"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(student.id, selectedSubject)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Chỉnh sửa điểm"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

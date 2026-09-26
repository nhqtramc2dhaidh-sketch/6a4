import React, { useState } from 'react';
import { Student, AttendanceRecord, AttendanceStatus, UserRole } from '../types';
import {
  CalendarCheck2,
  Check,
  Clock,
  FileText,
  XCircle,
  Calendar,
  Sparkles,
  Users,
} from 'lucide-react';

interface AttendanceTrackerProps {
  students: Student[];
  attendance: AttendanceRecord[];
  currentRole: UserRole;
  selectedStudentId: string;
  onUpdateAttendance: (date: string, records: Record<string, { status: AttendanceStatus; note?: string }>) => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  students,
  attendance,
  currentRole,
  selectedStudentId,
  onUpdateAttendance,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Retrieve or create attendance for the selected date
  const currentDayRecord = attendance.find((a) => a.date === selectedDate);
  const currentRecords = currentDayRecord?.records || {};

  const getStudentStatus = (studentId: string): AttendanceStatus => {
    return currentRecords[studentId]?.status || 'present';
  };

  const getStudentNote = (studentId: string): string => {
    return currentRecords[studentId]?.note || '';
  };

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    if (currentRole !== 'teacher') return;
    const newRecords = {
      ...currentRecords,
      [studentId]: {
        ...currentRecords[studentId],
        status,
      },
    };
    onUpdateAttendance(selectedDate, newRecords);
  };

  const setNote = (studentId: string, note: string) => {
    if (currentRole !== 'teacher') return;
    const newRecords = {
      ...currentRecords,
      [studentId]: {
        ...currentRecords[studentId],
        status: currentRecords[studentId]?.status || 'present',
        note,
      },
    };
    onUpdateAttendance(selectedDate, newRecords);
  };

  const markAllPresent = () => {
    if (currentRole !== 'teacher') return;
    const newRecords: Record<string, { status: AttendanceStatus; note?: string }> = {};
    students.forEach((s) => {
      newRecords[s.id] = { status: 'present' };
    });
    onUpdateAttendance(selectedDate, newRecords);
  };

  // Calculations for summary stats
  const total = students.length;
  let presentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;
  let unexcusedCount = 0;

  students.forEach((s) => {
    const st = getStudentStatus(s.id);
    if (st === 'present') presentCount++;
    if (st === 'late') lateCount++;
    if (st === 'excused') excusedCount++;
    if (st === 'unexcused') unexcusedCount++;
  });

  const rate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 100;

  const isIndividualView = currentRole === 'parent' || currentRole === 'student';
  const displayedStudents = isIndividualView
    ? students.filter((s) => s.id === selectedStudentId)
    : students;

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-extrabold mb-2 shadow-2xs">
            <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sổ Điểm Danh Lớp Học</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Điểm Danh Chuyên Cần Lớp 6A4
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cập nhật tình hình có mặt, đi muộn, nghỉ phép hàng ngày
          </p>
        </div>

        {/* Date Selector & Quick Mark All */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            />
          </div>

          {currentRole === 'teacher' && (
            <button
              type="button"
              onClick={markAllPresent}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-102 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Điểm danh tất cả Có Mặt</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            ✅
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">Có mặt đúng giờ</div>
            <div className="text-base sm:text-lg font-black text-emerald-600 tabular-nums">
              {presentCount} / {total}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            ⏰
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">Đi muộn</div>
            <div className="text-base sm:text-lg font-black text-amber-600 tabular-nums">
              {lateCount} em
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            📌
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">Nghỉ có phép</div>
            <div className="text-base sm:text-lg font-black text-blue-600 tabular-nums">
              {excusedCount} em
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
            ❌
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">Nghỉ không phép</div>
            <div className="text-base sm:text-lg font-black text-rose-600 tabular-nums">
              {unexcusedCount} em
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4 min-w-[180px]">Học sinh</th>
                <th className="py-3 px-3 text-center">Tổ</th>
                <th className="py-3 px-3 text-center">Trạng thái điểm danh</th>
                <th className="py-3 px-4 min-w-[200px]">Ghi chú của giáo viên</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedStudents.map((student, idx) => {
                const status = getStudentStatus(student.id);
                const note = getStudentNote(student.id);

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

                    <td className="py-3 px-3 text-center">
                      {currentRole === 'teacher' ? (
                        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl gap-1">
                          <button
                            type="button"
                            onClick={() => setStatus(student.id, 'present')}
                            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-emerald-700'
                            }`}
                          >
                            ✅ Có mặt
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(student.id, 'late')}
                            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                              status === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-600 hover:text-amber-700'
                            }`}
                          >
                            ⏰ Muộn
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(student.id, 'excused')}
                            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                              status === 'excused'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-blue-700'
                            }`}
                          >
                            📌 Có phép
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(student.id, 'unexcused')}
                            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                              status === 'unexcused'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-rose-700'
                            }`}
                          >
                            ❌ Không phép
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            status === 'present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'late'
                              ? 'bg-amber-100 text-amber-800'
                              : status === 'excused'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {status === 'present'
                            ? '✅ Có mặt đúng giờ'
                            : status === 'late'
                            ? '⏰ Đi muộn'
                            : status === 'excused'
                            ? '📌 Nghỉ có phép'
                            : '❌ Nghỉ không phép'}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {currentRole === 'teacher' ? (
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => setNote(student.id, e.target.value)}
                          placeholder="Lý do đi muộn / xin phép..."
                          className="w-full text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white"
                        />
                      ) : (
                        <span className="text-xs text-slate-500 italic">
                          {note || 'Không có ghi chú'}
                        </span>
                      )}
                    </td>
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

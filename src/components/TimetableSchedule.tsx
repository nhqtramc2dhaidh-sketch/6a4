import React, { useState } from 'react';
import { TimetableSlot, UserRole } from '../types';
import { INITIAL_TIMETABLE, CLASS_INFO } from '../data/mockData';
import { CalendarDays, Clock, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface TimetableScheduleProps {
  currentRole: UserRole;
}

export const TimetableSchedule: React.FC<TimetableScheduleProps> = ({ currentRole }) => {
  const [timetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);

  // Determine current day of week (0: Sun, 1: Mon, ... 6: Sat)
  const dayIndex = new Date().getDay();
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayKey = dayKeys[dayIndex];

  const columns = [
    { key: 'period', label: 'Tiết' },
    { key: 'time', label: 'Thời gian' },
    { key: 'mon', label: 'Thứ Hai', dayKey: 'mon' },
    { key: 'tue', label: 'Thứ Ba', dayKey: 'tue' },
    { key: 'wed', label: 'Thứ Tư', dayKey: 'wed' },
    { key: 'thu', label: 'Thứ Năm', dayKey: 'thu' },
    { key: 'fri', label: 'Thứ Sáu', dayKey: 'fri' },
    { key: 'sat', label: 'Thứ Bảy', dayKey: 'sat' },
  ];

  const examReminders = [
    { date: 'Thứ Hai (28/09)', subject: 'Ngữ văn', topic: 'Kiểm tra 15 phút: Văn bản Thánh Gióng' },
    { date: 'Thứ Ba (29/09)', subject: 'Toán', topic: 'Kiểm tra thường xuyên: Phép tính luỹ thừa' },
    { date: 'Thứ Năm (01/10)', subject: 'KHTN', topic: 'Thực hành: Kính hiển vi quang học' },
  ];

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-extrabold mb-2 shadow-2xs">
            <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
            <span>Kế Hoạch Dạy & Học Tuần</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Thời Khóa Biểu & Lịch Hoạt Động - Lớp 6A4
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {CLASS_INFO.schoolName} · Năm học 2026 - 2027 · Phòng học: 204 (Tầng 2)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3.5 py-2 rounded-xl text-xs font-bold border border-blue-200">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Giờ vào lớp buổi sáng: 07h15</span>
        </div>
      </div>

      {/* Main Timetable Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                {columns.map((col) => {
                  const isToday = col.dayKey === todayKey;
                  return (
                    <th
                      key={col.key}
                      className={`py-3.5 px-3 text-center ${
                        isToday ? 'bg-amber-100 text-amber-900 font-black' : ''
                      }`}
                    >
                      {col.label}
                      {isToday && <span className="block text-[9px] font-normal text-amber-700">Hôm nay</span>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timetable.map((row) => (
                <tr key={row.period} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 text-center font-bold text-slate-400 tabular-nums">
                    Tiết {row.period}
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-400 text-[11px] tabular-nums whitespace-nowrap">
                    {row.time}
                  </td>
                  <td
                    className={`py-3.5 px-3 text-center font-semibold ${
                      todayKey === 'mon' ? 'bg-amber-50/60 font-bold text-amber-900' : 'text-slate-800'
                    }`}
                  >
                    {row.mon}
                  </td>
                  <td
                    className={`py-3.5 px-3 text-center font-semibold ${
                      todayKey === 'tue' ? 'bg-amber-50/60 font-bold text-amber-900' : 'text-slate-800'
                    }`}
                  >
                    {row.tue}
                  </td>
                  <td
                    className={`py-3.5 px-3 text-center font-semibold ${
                      todayKey === 'wed' ? 'bg-amber-50/60 font-bold text-amber-900' : 'text-slate-800'
                    }`}
                  >
                    {row.wed}
                  </td>
                  <td
                    className={`py-3.5 px-3 text-center font-semibold ${
                      todayKey === 'thu' ? 'bg-amber-50/60 font-bold text-amber-900' : 'text-slate-800'
                    }`}
                  >
                    {row.thu}
                  </td>
                  <td
                    className={`py-3.5 px-3 text-center font-semibold ${
                      todayKey === 'fri' ? 'bg-amber-50/60 font-bold text-amber-900' : 'text-slate-800'
                    }`}
                  >
                    {row.fri}
                  </td>
                  <td
                    className={`py-3.5 px-3 text-center font-semibold ${
                      todayKey === 'sat' ? 'bg-amber-50/60 font-bold text-amber-900' : 'text-slate-800'
                    }`}
                  >
                    {row.sat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Exam & Activity Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">
              Lịch Kiểm Tra Định Kỳ Trong Tuần
            </h3>
          </div>
          <div className="space-y-2.5">
            {examReminders.map((ex, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{ex.subject} · {ex.date}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{ex.topic}</div>
                </div>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded-md text-[10px]">
                  15 phút
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">
              Lịch Hoạt Động Ngoại Khóa & Trực Nhật
            </h3>
          </div>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <div className="font-bold text-amber-900">Tổ trực nhật tuần này: Tổ 1</div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Các bạn Tổ 1 có mặt trước 07h00 để lau bảng, kiểm tra khăn trải bàn và bình nước lớp.
              </p>
            </div>
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
              <div className="font-bold text-blue-900">Tiết 5 Thứ Bảy: Sinh hoạt lớp & Tổng kết thi đua</div>
              <p className="text-[11px] text-blue-800 mt-0.5">
                Công bố danh sách học sinh xuất sắc nhận Sticker Vàng của tuần!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

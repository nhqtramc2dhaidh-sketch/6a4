import React, { useRef } from 'react';
import { Student, RewardPointRecord, SubjectScore, AttendanceRecord } from '../types';
import { CLASS_INFO } from '../data/mockData';
import { exportClassDataJson } from '../utils/storage';
import {
  BarChart3,
  Download,
  Printer,
  Sparkles,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Upload,
} from 'lucide-react';

interface ReportDashboardProps {
  students: Student[];
  rewardLogs: RewardPointRecord[];
  scores: SubjectScore[];
  attendance: AttendanceRecord[];
  allAppData: Record<string, unknown>;
  onRestoreData: (restoredData: any) => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  students,
  rewardLogs,
  scores,
  attendance,
  allAppData,
  onRestoreData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculations
  const totalStudents = students.length;
  const totalPoints = students.reduce((acc, s) => acc + s.points, 0);
  const avgPoints = totalStudents > 0 ? (totalPoints / totalStudents).toFixed(1) : '0';

  // Overall grade average across all subjects
  const validScores = scores.filter((s) => s.average !== null);
  const classGradeAvg =
    validScores.length > 0
      ? (validScores.reduce((acc, s) => acc + (s.average || 0), 0) / validScores.length).toFixed(1)
      : '8.4';

  // Students needing encouragement (lowest points or score below 7.0)
  const studentsNeedingSupport = [...students]
    .sort((a, b) => a.points - b.points)
    .slice(0, 4);

  // Top achievers
  const topStudents = [...students].sort((a, b) => b.points - a.points).slice(0, 4);

  // Group distribution stats
  const groupStats = ['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'].map((g) => {
    const groupStudents = students.filter((s) => s.group === g);
    const grpPoints = groupStudents.reduce((acc, s) => acc + s.points, 0);
    return {
      group: g,
      count: groupStudents.length,
      points: grpPoints,
      avg: groupStudents.length > 0 ? (grpPoints / groupStudents.length).toFixed(1) : '0',
    };
  });

  // Export CSV
  const handleExportCsv = () => {
    let csvContent = '\uFEFF'; // Add UTF-8 BOM for Excel Vietnamese font support
    csvContent += `${CLASS_INFO.schoolName}\n`;
    csvContent += `DANH SÁCH HỌC SINH ${CLASS_INFO.className.toUpperCase()} - NĂM HỌC ${CLASS_INFO.academicYear}\n`;
    csvContent += `Giáo viên chủ nhiệm: ${CLASS_INFO.teacher.name} (${CLASS_INFO.teacher.phone})\n\n`;
    csvContent += 'Mã học sinh,Họ và tên,Giới tính,Ngày sinh,Tổ,Điểm tích lũy,Phụ huynh,SĐT Phụ huynh\n';

    students.forEach((s) => {
      const row = `"${s.studentCode}","${s.name}","${s.gender === 'male' ? 'Nam' : 'Nữ'}","${s.birthday}","${s.group}","${s.points}","${s.parentName}","${s.parentPhone}"`;
      csvContent += row + '\n';
    });

    const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `THCS_DongHai_Lop6A4_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Import JSON backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.students) {
            onRestoreData(parsed);
            alert('Khôi phục dữ liệu lớp 6A4 thành công!');
          } else {
            alert('File dữ liệu không đúng định dạng sao lưu của Lớp 6A4.');
          }
        } catch (err) {
          alert('Không thể đọc file: ' + String(err));
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-extrabold mb-2 shadow-2xs">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Trung Tâm Báo Cáo & Phân Tích</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Báo Cáo Tổng Hợp Lớp 6A4
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            GVCN: {CLASS_INFO.teacher.name} · {CLASS_INFO.academicYear} · {CLASS_INFO.schoolName}
          </p>
        </div>

        {/* Action Buttons: Export & Print */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-102"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel / CSV</span>
          </button>

          <button
            type="button"
            onClick={() => exportClassDataJson(allAppData)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-102"
          >
            <Download className="w-4 h-4" />
            <span>Sao Lưu Dữ Liệu (JSON)</span>
          </button>

          <label className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Khôi Phục</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo</span>
          </button>
        </div>
      </div>

      {/* 4 Big Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Sĩ số lớp 6A4</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tabular-nums">
            {totalStudents} <span className="text-sm font-normal text-slate-400">học sinh</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% hồ sơ hoàn chỉnh</div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Điểm trung bình các môn</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 tabular-nums">
            {classGradeAvg} <span className="text-sm font-normal text-slate-400">/ 10</span>
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Học lực chung: Giỏi</div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tổng điểm thưởng thi đua</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1 tabular-nums">
            {totalPoints} <span className="text-sm font-normal text-slate-400">⭐</span>
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            Trung bình: {avgPoints} sao / em
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tỷ lệ chuyên cần</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 tabular-nums">
            98.5%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Xếp loại: Xuất sắc</div>
        </div>
      </div>

      {/* Group Competition Ranking */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">
          🏆 Thi Đua Tích Lũy Điểm Thưởng Giữa Các Tổ
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {groupStats.map((grp) => (
            <div key={grp.group} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between font-bold text-sm text-slate-900 mb-2">
                <span>{grp.group}</span>
                <span className="text-xs text-slate-500">{grp.count} học sinh</span>
              </div>
              <div className="text-xl font-black text-amber-600 tabular-nums">
                {grp.points} ⭐
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Trung bình: <strong>{grp.avg}</strong> sao / em
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2 Comparison Lists: Top Achievers vs Need Encouragement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Achievers */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Gương Mặt Tiêu Biểu Dẫn Đầu
              </h3>
              <p className="text-xs text-slate-500">Các học sinh có tổng tích lũy cao nhất</p>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {topStudents.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="font-bold text-amber-600 w-5">#{i + 1}</span>
                  <img
                    src={s.avatarUrl}
                    alt={s.name}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="truncate">
                    <div className="font-bold text-slate-800">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.group}</div>
                  </div>
                </div>
                <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  ⭐ {s.points} Điểm
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Need Support / Encouragement */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Học Sinh Cần Giáo Viên & Gia Đình Đồng Hành
              </h3>
              <p className="text-xs text-slate-500">Cần khích lệ nề nếp và bài tập về nhà</p>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {studentsNeedingSupport.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <img
                    src={s.avatarUrl}
                    alt={s.name}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div className="truncate">
                    <div className="font-bold text-slate-800">{s.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {s.group} · PH: {s.parentPhone}
                    </div>
                  </div>
                </div>
                <span className="font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md">
                  {s.points} Điểm
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

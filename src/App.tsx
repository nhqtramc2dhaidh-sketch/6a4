/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  Student,
  RewardPointRecord,
  ClassNotice,
  Assignment,
  ChatMessage,
  ClassPhotoConfig,
  SubjectScore,
  AttendanceRecord,
} from './types';
import { loadStoredData, saveToStorage } from './utils/storage';
import { CLASS_INFO } from './data/mockData';
import { Navbar } from './components/Navbar';
import { ClassHeroBanner } from './components/ClassHeroBanner';
import { StickerBoard } from './components/StickerBoard';
import { HonorBoard } from './components/HonorBoard';
import { GradeManagement } from './components/GradeManagement';
import { AttendanceTracker } from './components/AttendanceTracker';
import { AssignmentManager } from './components/AssignmentManager';
import { TimetableSchedule } from './components/TimetableSchedule';
import { NotificationBoard } from './components/NotificationBoard';
import { CommunicationChat } from './components/CommunicationChat';
import { ReportDashboard } from './components/ReportDashboard';

export default function App() {
  const [initialData] = useState(() => loadStoredData());

  const [currentRole, setCurrentRole] = useState<UserRole>('teacher');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('s01');
  const [activeTab, setActiveTab] = useState<string>('stickers');

  // Application Data States
  const [students, setStudents] = useState<Student[]>(initialData.students);
  const [rewardLogs, setRewardLogs] = useState<RewardPointRecord[]>(initialData.rewardLogs);
  const [notices, setNotices] = useState<ClassNotice[]>(initialData.notices);
  const [assignments, setAssignments] = useState<Assignment[]>(initialData.assignments);
  const [chats, setChats] = useState<ChatMessage[]>(initialData.chats);
  const [photoConfig, setPhotoConfig] = useState<ClassPhotoConfig>(initialData.photoConfig);
  const [scores, setScores] = useState<SubjectScore[]>(initialData.scores);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialData.attendance);

  // Sync state changes to localStorage
  useEffect(() => {
    saveToStorage('STUDENTS', students);
  }, [students]);

  useEffect(() => {
    saveToStorage('REWARD_LOGS', rewardLogs);
  }, [rewardLogs]);

  useEffect(() => {
    saveToStorage('NOTICES', notices);
  }, [notices]);

  useEffect(() => {
    saveToStorage('ASSIGNMENTS', assignments);
  }, [assignments]);

  useEffect(() => {
    saveToStorage('CHATS', chats);
  }, [chats]);

  useEffect(() => {
    saveToStorage('PHOTO_CONFIG', photoConfig);
  }, [photoConfig]);

  useEffect(() => {
    saveToStorage('SCORES', scores);
  }, [scores]);

  useEffect(() => {
    saveToStorage('ATTENDANCE', attendance);
  }, [attendance]);

  // Handler: Add or Deduct point
  const handleAddPoint = (studentId: string, type: 'plus' | 'minus', point: number, reason: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const delta = type === 'plus' ? point : -point;
    const newPoints = Math.max(0, student.points + delta);

    // Auto-award "excellence" badge if reaching >= 50 points
    let newBadges = [...student.badges];
    if (newPoints >= 50 && !newBadges.includes('excellence')) {
      newBadges.push('excellence');
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, points: newPoints, badges: newBadges } : s
      )
    );

    const newLog: RewardPointRecord = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId,
      studentName: student.name,
      type,
      point,
      reason,
      date: new Date().toLocaleDateString('vi-VN'),
      createdAt: Date.now(),
      teacherName: CLASS_INFO.teacher.shortName,
    };

    setRewardLogs((prev) => [newLog, ...prev]);
  };

  // Handler: Update Student details
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  // Handler: Add New Student
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  // Handler: Delete / Undo point log with automatic student point adjustment
  const handleDeleteRewardLog = (recordId: string) => {
    const targetLog = rewardLogs.find((l) => l.id === recordId);
    if (!targetLog) return;

    // Reverse points
    const reverseDelta = targetLog.type === 'plus' ? -targetLog.point : targetLog.point;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === targetLog.studentId
          ? { ...s, points: Math.max(0, s.points + reverseDelta) }
          : s
      )
    );

    setRewardLogs((prev) => prev.filter((l) => l.id !== recordId));
  };

  // Handler: Edit point log
  const handleEditRewardLog = (recordId: string, newReason: string, newPoint: number) => {
    const targetLog = rewardLogs.find((l) => l.id === recordId);
    if (!targetLog) return;

    const oldDelta = targetLog.type === 'plus' ? targetLog.point : -targetLog.point;
    const newDelta = targetLog.type === 'plus' ? newPoint : -newPoint;
    const netAdjustment = newDelta - oldDelta;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === targetLog.studentId
          ? { ...s, points: Math.max(0, s.points + netAdjustment) }
          : s
      )
    );

    setRewardLogs((prev) =>
      prev.map((l) => (l.id === recordId ? { ...l, reason: newReason, point: newPoint } : l))
    );
  };

  // Handler: Update score
  const handleUpdateScore = (updatedScore: SubjectScore) => {
    setScores((prev) =>
      prev.map((sc) =>
        sc.studentId === updatedScore.studentId && sc.subject === updatedScore.subject
          ? updatedScore
          : sc
      )
    );
  };

  // Handler: Update Attendance
  const handleUpdateAttendance = (
    date: string,
    records: Record<string, { status: any; note?: string }>
  ) => {
    setAttendance((prev) => {
      const existing = prev.find((a) => a.date === date);
      if (existing) {
        return prev.map((a) => (a.date === date ? { ...a, records } : a));
      }
      return [...prev, { id: `att-${date}`, date, records }];
    });
  };

  // Handler: Homework submission
  const handleSubmitHomework = (assignmentId: string, studentId: string, content: string) => {
    setAssignments((prev) =>
      prev.map((hw) => {
        if (hw.id === assignmentId) {
          const filteredSub = hw.submissions.filter((sub) => sub.studentId !== studentId);
          return {
            ...hw,
            submissions: [
              ...filteredSub,
              {
                studentId,
                submittedAt: new Date().toLocaleString('vi-VN'),
                content,
              },
            ],
          };
        }
        return hw;
      })
    );
  };

  // Handler: Grade homework
  const handleGradeHomework = (
    assignmentId: string,
    studentId: string,
    score: number,
    feedback: string
  ) => {
    setAssignments((prev) =>
      prev.map((hw) => {
        if (hw.id === assignmentId) {
          return {
            ...hw,
            submissions: hw.submissions.map((sub) =>
              sub.studentId === studentId ? { ...sub, score, feedback } : sub
            ),
          };
        }
        return hw;
      })
    );
  };

  // Handler: Notice pin toggle
  const handleTogglePinNotice = (noticeId: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  // Handler: Restore full data
  const handleRestoreData = (restored: any) => {
    if (restored.students) setStudents(restored.students);
    if (restored.rewardLogs) setRewardLogs(restored.rewardLogs);
    if (restored.notices) setNotices(restored.notices);
    if (restored.assignments) setAssignments(restored.assignments);
    if (restored.chats) setChats(restored.chats);
    if (restored.photoConfig) setPhotoConfig(restored.photoConfig);
    if (restored.scores) setScores(restored.scores);
    if (restored.attendance) setAttendance(restored.attendance);
  };

  // Calculate current attendance rate
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAtt = attendance.find((a) => a.date === todayStr);
  let presentToday = 0;
  if (todayAtt) {
    Object.values(todayAtt.records).forEach((r) => {
      if (r.status === 'present' || r.status === 'late') presentToday++;
    });
  }
  const attendanceRate =
    students.length > 0 ? Math.round((presentToday / students.length) * 100) : 100;

  const allAppData = {
    students,
    rewardLogs,
    notices,
    assignments,
    chats,
    photoConfig,
    scores,
    attendance,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        students={students}
        unreadNoticesCount={notices.length}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* Class Hero Banner is shown on Home / Stickers tab */}
        {activeTab === 'stickers' && (
          <ClassHeroBanner
            photoConfig={photoConfig}
            onUpdatePhotoConfig={setPhotoConfig}
            currentRole={currentRole}
            students={students}
            totalPlusPointsThisWeek={rewardLogs.filter((r) => r.type === 'plus').length}
            attendanceRate={attendanceRate}
            openAssignmentsCount={assignments.length}
          />
        )}

        {/* Tab 1: Sticker Board */}
        {activeTab === 'stickers' && (
          <StickerBoard
            students={students}
            currentRole={currentRole}
            rewardLogs={rewardLogs}
            onAddPoint={handleAddPoint}
            onUpdateStudent={handleUpdateStudent}
            onAddStudent={handleAddStudent}
            onDeleteRecord={handleDeleteRewardLog}
            onEditRecord={handleEditRewardLog}
          />
        )}

        {/* Tab 2: Honor Board */}
        {activeTab === 'honors' && <HonorBoard students={students} />}

        {/* Tab 3: Grades Sổ Điểm */}
        {activeTab === 'grades' && (
          <GradeManagement
            students={students}
            scores={scores}
            currentRole={currentRole}
            selectedStudentId={selectedStudentId}
            onUpdateScore={handleUpdateScore}
          />
        )}

        {/* Tab 4: Điểm Danh */}
        {activeTab === 'attendance' && (
          <AttendanceTracker
            students={students}
            attendance={attendance}
            currentRole={currentRole}
            selectedStudentId={selectedStudentId}
            onUpdateAttendance={handleUpdateAttendance}
          />
        )}

        {/* Tab 5: Bài Tập */}
        {activeTab === 'homework' && (
          <AssignmentManager
            assignments={assignments}
            students={students}
            currentRole={currentRole}
            selectedStudentId={selectedStudentId}
            onAddAssignment={(hw) => setAssignments((prev) => [hw, ...prev])}
            onSubmitHomework={handleSubmitHomework}
            onGradeHomework={handleGradeHomework}
          />
        )}

        {/* Tab 6: Thời Khóa Biểu */}
        {activeTab === 'timetable' && <TimetableSchedule currentRole={currentRole} />}

        {/* Tab 7: Thông Báo */}
        {activeTab === 'notices' && (
          <NotificationBoard
            notices={notices}
            currentRole={currentRole}
            onAddNotice={(n) => setNotices((prev) => [n, ...prev])}
            onTogglePin={handleTogglePinNotice}
          />
        )}

        {/* Tab 8: Sổ Liên Lạc / Chat */}
        {activeTab === 'chat' && (
          <CommunicationChat
            students={students}
            currentRole={currentRole}
            selectedStudentId={selectedStudentId}
            chats={chats}
            onSendMessage={(msg) => setChats((prev) => [...prev, msg])}
          />
        )}

        {/* Tab 9: Báo Cáo & Thống Kê */}
        {activeTab === 'reports' && (
          <ReportDashboard
            students={students}
            rewardLogs={rewardLogs}
            scores={scores}
            attendance={attendance}
            allAppData={allAppData}
            onRestoreData={handleRestoreData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-base">🎓</span>
            <span className="font-bold text-slate-700">{CLASS_INFO.fullTitle}</span>
            <span>·</span>
            <span>{CLASS_INFO.academicYear}</span>
            <span>·</span>
            <span className="italic">{CLASS_INFO.slogan}</span>
          </div>

          <div>
            <span>GVCN: <strong>{CLASS_INFO.teacher.name}</strong> · {CLASS_INFO.schoolName}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { Assignment, Student, UserRole } from '../types';
import { BookOpen, PlusCircle, Calendar, Clock, CheckCircle2, AlertCircle, X, Send } from 'lucide-react';

interface AssignmentManagerProps {
  assignments: Assignment[];
  students: Student[];
  currentRole: UserRole;
  selectedStudentId: string;
  onAddAssignment: (assignment: Assignment) => void;
  onSubmitHomework: (assignmentId: string, studentId: string, content: string) => void;
  onGradeHomework: (assignmentId: string, studentId: string, score: number, feedback: string) => void;
}

export const AssignmentManager: React.FC<AssignmentManagerProps> = ({
  assignments,
  students,
  currentRole,
  selectedStudentId,
  onAddAssignment,
  onSubmitHomework,
  onGradeHomework,
}) => {
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(assignments[0] || null);

  // Form for student homework submission
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New assignment form fields
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Ngữ văn');
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('30/09/2026');

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHw: Assignment = {
      id: `hw-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      description: newDescription.trim(),
      deadline: newDeadline,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      assignedBy: 'Cô Quỳnh Trâm',
      submissions: [],
    };

    onAddAssignment(newHw);
    setSelectedAssignment(newHw);
    setNewModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionText.trim()) return;
    onSubmitHomework(selectedAssignment.id, selectedStudentId, submissionText.trim());
    setSubmissionText('');
    setIsSubmitting(false);
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-extrabold mb-2 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Nhiệm Vụ Học Tập</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Bài Tập Về Nhà - Lớp 6A4
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Giao bài tập, theo dõi thời hạn nộp và nhận xét tiến bộ của học sinh
          </p>
        </div>

        {currentRole === 'teacher' && (
          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-102 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Giao bài tập mới</span>
          </button>
        )}
      </div>

      {/* Main 2-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Assignments (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Danh sách bài tập ({assignments.length})
          </div>

          {assignments.map((hw) => {
            const isSelected = selectedAssignment?.id === hw.id;
            const submittedCount = hw.submissions.length;
            const mySubmission = hw.submissions.find((sub) => sub.studentId === selectedStudentId);

            return (
              <div
                key={hw.id}
                onClick={() => setSelectedAssignment(hw)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50/60 shadow-xs ring-1 ring-purple-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800">
                    {hw.subject}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Hạn nộp: {hw.deadline}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{hw.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{hw.description}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Người giao: {hw.assignedBy}</span>
                  {currentRole === 'teacher' ? (
                    <span className="font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                      Đã nộp: {submittedCount}/{students.length} em
                    </span>
                  ) : (
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md ${
                        mySubmission
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {mySubmission ? '✅ Đã nộp bài' : '⏳ Chưa nộp bài'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Assignment Details & Submissions (7 cols) */}
        {selectedAssignment && (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800">
                  Môn: {selectedAssignment.subject}
                </span>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                  ⏰ Hạn nộp: {selectedAssignment.deadline}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {selectedAssignment.title}
              </h3>
              <div className="text-xs text-slate-400 mt-1">
                Đăng ngày {selectedAssignment.createdAt} bởi {selectedAssignment.assignedBy}
              </div>
            </div>

            {/* Description box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                📖 Yêu cầu chi tiết bài làm:
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedAssignment.description}
              </p>
            </div>

            {/* If Student/Parent: Submission interface */}
            {(currentRole === 'student' || currentRole === 'parent') && (
              <div className="border-t border-slate-200 pt-5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Trạng thái nộp bài của {selectedStudent?.name} ({selectedStudent?.group})
                  </span>
                </h4>

                {(() => {
                  const sub = selectedAssignment.submissions.find(
                    (s) => s.studentId === selectedStudentId
                  );
                  if (sub) {
                    return (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-800">✅ Đã nộp thành công!</span>
                          <span className="text-slate-500">{sub.submittedAt}</span>
                        </div>
                        <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-emerald-100">
                          "{sub.content}"
                        </p>
                        {sub.score !== undefined && (
                          <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Điểm đánh giá:</span>
                            <span className="text-sm font-black text-emerald-700 bg-white px-3 py-1 rounded-md border border-emerald-200">
                              ⭐ {sub.score} / 10
                            </span>
                          </div>
                        )}
                        {sub.feedback && (
                          <div className="text-xs text-emerald-800 italic">
                            Lời phê của giáo viên: "{sub.feedback}"
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <form onSubmit={handleStudentSubmit} className="space-y-3">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        Chưa nộp bài. Em hãy hoàn thành bài làm vào vở và tóm tắt kết quả bài làm vào ô dưới đây:
                      </div>
                      <textarea
                        rows={3}
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="Em đã hoàn thành bài tập trang... Kết quả các câu như sau..."
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-800"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Nộp bài cho Cô Quỳnh Trâm</span>
                      </button>
                    </form>
                  );
                })()}
              </div>
            )}

            {/* If Teacher: Full Submissions List */}
            {currentRole === 'teacher' && (
              <div className="border-t border-slate-200 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Danh sách học sinh đã nộp ({selectedAssignment.submissions.length}/{students.length})
                  </h4>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {students.map((student) => {
                    const sub = selectedAssignment.submissions.find(
                      (s) => s.studentId === student.id
                    );
                    return (
                      <div
                        key={student.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          sub
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                          />
                          <div className="truncate">
                            <span className="font-bold text-slate-800">{student.name}</span>
                            <span className="text-[10px] text-slate-400 ml-1.5">
                              ({student.group})
                            </span>
                            {sub && (
                              <p className="text-[11px] text-slate-600 truncate mt-0.5">
                                "{sub.content}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {sub ? (
                            <>
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                                Đã nộp ✓
                              </span>
                              {sub.score ? (
                                <span className="font-black text-xs text-amber-600">
                                  {sub.score}đ
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const scoreStr = prompt(`Nhập điểm cho ${student.name} (0-10):`, '10');
                                    if (scoreStr !== null) {
                                      const sc = Number(scoreStr);
                                      const fb = prompt('Lời nhận xét khích lệ:', 'Bài làm rất tốt!');
                                      onGradeHomework(selectedAssignment.id, student.id, sc, fb || '');
                                    }
                                  }}
                                  className="text-[10px] font-bold text-blue-600 hover:underline"
                                >
                                  Chấm điểm
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Chưa nộp</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal create assignment */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-5">
            <h3 className="font-bold text-base text-slate-900 mb-1">Giao Bài Tập Mới Cho Lớp 6A4</h3>
            <p className="text-xs text-slate-500 mb-4">
              Bài tập sẽ được gửi thông báo ngay tới phụ huynh và học sinh
            </p>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề bài tập *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Soạn bài Đọc hiểu văn bản 'Thánh Gióng'..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Môn học</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="Toán">Toán</option>
                    <option value="Ngữ văn">Ngữ văn</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                    <option value="Lịch sử và Địa lý">Lịch sử và Địa lý</option>
                    <option value="Tin học">Tin học</option>
                    <option value="Công nghệ">Công nghệ</option>
                    <option value="GDCD">GDCD</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hạn nộp</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung hướng dẫn *</label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Ghi rõ số trang SGK, các câu hỏi cần làm, cách thức trình bày..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-colors"
                >
                  Đăng Bài Tập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

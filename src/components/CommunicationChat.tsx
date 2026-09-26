import React, { useState } from 'react';
import { ChatMessage, Student, UserRole } from '../types';
import { CLASS_INFO } from '../data/mockData';
import { MessageSquare, Send, User, CheckCheck, Smile } from 'lucide-react';

interface CommunicationChatProps {
  students: Student[];
  currentRole: UserRole;
  selectedStudentId: string;
  chats: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
}

export const CommunicationChat: React.FC<CommunicationChatProps> = ({
  students,
  currentRole,
  selectedStudentId,
  chats,
  onSendMessage,
}) => {
  // If teacher, can select which student's family thread to view
  const [activeStudentId, setActiveStudentId] = useState<string>(selectedStudentId);
  const [inputText, setInputText] = useState('');

  // Target student for the chat thread
  const targetStudentId = currentRole === 'teacher' ? activeStudentId : selectedStudentId;
  const targetStudent = students.find((s) => s.id === targetStudentId) || students[0];

  const threadMessages = chats.filter((c) => c.studentId === targetStudentId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const senderName =
      currentRole === 'teacher'
        ? CLASS_INFO.teacher.name
        : currentRole === 'parent'
        ? `${targetStudent.parentName} (Phụ huynh em ${targetStudent.name.split(' ').slice(-1)[0]})`
        : targetStudent.name;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentRole === 'teacher' ? 'teacher-tram' : `user-${targetStudentId}`,
      senderName,
      senderRole: currentRole,
      studentId: targetStudentId,
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-extrabold mb-2 shadow-2xs">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span>Sổ Liên Lạc Điện Tử 2 Chiều</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Trao Đổi Trực Tuyến Với {CLASS_INFO.teacher.shortName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kênh kết nối ấm áp, tin cậy giữa Giáo viên chủ nhiệm, Phụ huynh và Học sinh lớp 6A4
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* Left student list (only visible for Teacher role) */}
        {currentRole === 'teacher' && (
          <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50/50 flex flex-col h-full max-h-[600px]">
            <div className="p-3.5 border-b border-slate-200 bg-white">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Hộp thư phụ huynh ({students.length} gia đình)
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {students.map((stu) => {
                const isCurrent = stu.id === activeStudentId;
                const stuLastMsg = chats.filter((c) => c.studentId === stu.id).slice(-1)[0];

                return (
                  <button
                    key={stu.id}
                    type="button"
                    onClick={() => setActiveStudentId(stu.id)}
                    className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${
                      isCurrent ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <img
                      src={stu.avatarUrl}
                      alt={stu.name}
                      className="w-10 h-10 rounded-full border border-slate-200 object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">{stu.name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{stu.group}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {stuLastMsg ? stuLastMsg.content : `PH: ${stu.parentName}`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Right chat message thread (8 or 12 cols) */}
        <div
          className={`${
            currentRole === 'teacher' ? 'lg:col-span-8' : 'lg:col-span-12'
          } flex flex-col h-full max-h-[600px]`}
        >
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  currentRole === 'teacher'
                    ? targetStudent?.avatarUrl
                    : CLASS_INFO.teacher.avatarUrl
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full border border-slate-200 object-cover"
              />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {currentRole === 'teacher'
                    ? `Gia đình em ${targetStudent?.name} (${targetStudent?.group})`
                    : `${CLASS_INFO.teacher.name} (GVCN Lớp 6A4)`}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {currentRole === 'teacher'
                    ? `Phụ huynh: ${targetStudent?.parentName} · SĐT: ${targetStudent?.parentPhone}`
                    : `SĐT/Zalo Cô Trâm: ${CLASS_INFO.teacher.phone}`}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ● Đang trực tuyến
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-50/40">
            {threadMessages.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto stroke-1 opacity-50 mb-2" />
                <p className="text-xs font-semibold">Chưa có tin nhắn nào trong hội thoại này.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Hãy gửi lời chào hoặc thắc mắc về tình hình học tập của em nhé!
                </p>
              </div>
            ) : (
              threadMessages.map((msg) => {
                const isMe =
                  (currentRole === 'teacher' && msg.senderRole === 'teacher') ||
                  (currentRole !== 'teacher' && msg.senderRole !== 'teacher');

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 font-medium mb-1 px-1">
                      {msg.senderName} · {msg.timestamp}
                    </span>
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                currentRole === 'teacher'
                  ? `Nhắn tin cho phụ huynh em ${targetStudent?.name}...`
                  : 'Soạn tin nhắn gửi Cô Quỳnh Trâm...'
              }
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi tin</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

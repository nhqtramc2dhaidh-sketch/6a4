export type UserRole = 'teacher' | 'parent' | 'student';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
  studentId?: string; // If parent or student
  phone?: string;
}

export type StickerFrame = 'default' | 'gold_star' | 'rainbow_glow' | 'chalkboard' | 'magic_gem' | 'flower_petal';
export type StickerBgColor = 'blue' | 'amber' | 'emerald' | 'rose' | 'purple' | 'cyan';

export interface Student {
  id: string;
  studentCode: string;
  name: string;
  gender: 'male' | 'female';
  birthday: string;
  group: 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4';
  avatarUrl: string;
  points: number;
  stickerFrame: StickerFrame;
  stickerBgColor: StickerBgColor;
  accessory?: string; // e.g., '🎓', '⭐', '🚀', '👑', '🍀', '🍎'
  badges: string[]; // Badge IDs
  parentName: string;
  parentPhone: string;
  note?: string;
}

export interface RewardPointRecord {
  id: string;
  studentId: string;
  studentName: string;
  type: 'plus' | 'minus';
  point: number;
  reason: string;
  date: string; // ISO or formatted date
  createdAt: number; // timestamp
  teacherName: string;
}

export interface Badge {
  id: string;
  name: string;
  category: 'learning' | 'skill' | 'effort';
  icon: string;
  description: string;
  requiredPoints?: number;
  color: string;
}

export interface SubjectScore {
  studentId: string;
  subject: string;
  tx: (number | null)[]; // 4 đánh giá thường xuyên
  gk: number | null; // Giữa kỳ
  ck: number | null; // Cuối kỳ
  average: number | null; // Điểm trung bình môn
}

export type AttendanceStatus = 'present' | 'late' | 'excused' | 'unexcused';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  records: {
    [studentId: string]: {
      status: AttendanceStatus;
      note?: string;
    };
  };
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  createdAt: string;
  assignedBy: string;
  submissions: {
    studentId: string;
    submittedAt: string;
    content: string;
    score?: number;
    feedback?: string;
  }[];
}

export interface TimetableSlot {
  period: number; // 1 to 5
  time: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
}

export interface ClassNotice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'meeting' | 'exam' | 'activity';
  date: string;
  isPinned: boolean;
  author: string;
  readsCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  studentId: string; // Conversation context
  content: string;
  timestamp: string;
  imageUrl?: string;
}

export interface ClassPhotoConfig {
  imageUrl: string;
  slogan: string;
  academicYear: string;
  frameStyle: 'gold' | 'chalk' | 'rainbow' | 'modern' | 'simple';
  brightness: number; // 50 to 150
  contrast: number; // 50 to 150
  rotation: number; // 0, 90, 180, 270
  stickers: {
    id: string;
    type: string; // 'book' | 'star' | 'trophy' | 'flower' | 'pencil'
    x: number; // % 0-100
    y: number; // % 0-100
    size: number;
  }[];
}

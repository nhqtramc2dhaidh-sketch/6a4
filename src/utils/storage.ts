import {
  Student,
  RewardPointRecord,
  AttendanceRecord,
  Assignment,
  ClassNotice,
  ChatMessage,
  ClassPhotoConfig,
  SubjectScore,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_REWARD_LOGS,
  INITIAL_NOTICES,
  INITIAL_ASSIGNMENTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_PHOTO_CONFIG,
  SUBJECTS_LIST,
} from '../data/mockData';

const STORAGE_KEYS = {
  STUDENTS: 'class6a4_students_v2',
  REWARD_LOGS: 'class6a4_reward_logs_v2',
  ATTENDANCE: 'class6a4_attendance_v2',
  ASSIGNMENTS: 'class6a4_assignments_v2',
  NOTICES: 'class6a4_notices_v2',
  CHATS: 'class6a4_chats_v2',
  PHOTO_CONFIG: 'class6a4_photo_config_v2',
  SCORES: 'class6a4_scores_v2',
};

// Initial realistic grades generation for 32 students in 8 subjects
export const generateInitialScores = (students: Student[]): SubjectScore[] => {
  const scores: SubjectScore[] = [];

  students.forEach((stu, sIndex) => {
    SUBJECTS_LIST.forEach((sub, subIndex) => {
      // Create realistic grades between 7.0 and 10.0
      const baseScore = 7.5 + ((sIndex * 7 + subIndex * 13) % 25) / 10;
      const tx1 = Math.min(10, Math.max(6, Math.round(baseScore * 10) / 10));
      const tx2 = Math.min(10, Math.max(6, Math.round((baseScore + 0.5) * 10) / 10));
      const tx3 = Math.min(10, Math.max(7, Math.round((baseScore - 0.2) * 10) / 10));
      const tx4 = Math.min(10, Math.max(7, Math.round((baseScore + 0.3) * 10) / 10));
      const gk = Math.min(10, Math.max(6.5, Math.round((baseScore + 0.4) * 10) / 10));
      const ck = Math.min(10, Math.max(7, Math.round((baseScore + 0.2) * 10) / 10));

      // Calculate weighted average: (sum(tx) + gk*2 + ck*3) / (4 + 2 + 3)
      const avg = Math.round(((tx1 + tx2 + tx3 + tx4 + gk * 2 + ck * 3) / 9) * 10) / 10;

      scores.push({
        studentId: stu.id,
        subject: sub,
        tx: [tx1, tx2, tx3, tx4],
        gk,
        ck,
        average: avg,
      });
    });
  });

  return scores;
};

export const loadStoredData = () => {
  try {
    const studentsStr = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const students: Student[] = studentsStr ? JSON.parse(studentsStr) : INITIAL_STUDENTS;

    const rewardLogsStr = localStorage.getItem(STORAGE_KEYS.REWARD_LOGS);
    const rewardLogs: RewardPointRecord[] = rewardLogsStr ? JSON.parse(rewardLogsStr) : INITIAL_REWARD_LOGS;

    const noticesStr = localStorage.getItem(STORAGE_KEYS.NOTICES);
    const notices: ClassNotice[] = noticesStr ? JSON.parse(noticesStr) : INITIAL_NOTICES;

    const assignmentsStr = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    const assignments: Assignment[] = assignmentsStr ? JSON.parse(assignmentsStr) : INITIAL_ASSIGNMENTS;

    const chatsStr = localStorage.getItem(STORAGE_KEYS.CHATS);
    const chats: ChatMessage[] = chatsStr ? JSON.parse(chatsStr) : INITIAL_CHAT_MESSAGES;

    const photoConfigStr = localStorage.getItem(STORAGE_KEYS.PHOTO_CONFIG);
    const photoConfig: ClassPhotoConfig = photoConfigStr ? JSON.parse(photoConfigStr) : INITIAL_PHOTO_CONFIG;

    const scoresStr = localStorage.getItem(STORAGE_KEYS.SCORES);
    const scores: SubjectScore[] = scoresStr ? JSON.parse(scoresStr) : generateInitialScores(students);

    // Initial attendance for today
    const attendanceStr = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    let attendance: AttendanceRecord[] = [];
    if (attendanceStr) {
      attendance = JSON.parse(attendanceStr);
    } else {
      const todayDate = new Date().toISOString().split('T')[0];
      const todayRecords: Record<string, { status: 'present' | 'late' | 'excused' | 'unexcused'; note?: string }> = {};
      students.forEach((s) => {
        todayRecords[s.id] = { status: 'present' };
      });
      // A couple realistic notes
      if (students[4]) todayRecords[students[4].id] = { status: 'late', note: 'Đi muộn 10 phút' };
      if (students[22]) todayRecords[students[22].id] = { status: 'excused', note: 'Gia đình xin phép do sốt' };

      attendance = [
        {
          id: `att-${todayDate}`,
          date: todayDate,
          records: todayRecords,
        },
      ];
    }

    return {
      students,
      rewardLogs,
      notices,
      assignments,
      chats,
      photoConfig,
      scores,
      attendance,
    };
  } catch (err) {
    console.error('Failed reading from local storage:', err);
    return {
      students: INITIAL_STUDENTS,
      rewardLogs: INITIAL_REWARD_LOGS,
      notices: INITIAL_NOTICES,
      assignments: INITIAL_ASSIGNMENTS,
      chats: INITIAL_CHAT_MESSAGES,
      photoConfig: INITIAL_PHOTO_CONFIG,
      scores: generateInitialScores(INITIAL_STUDENTS),
      attendance: [],
    };
  }
};

export const saveToStorage = (key: keyof typeof STORAGE_KEYS, data: unknown) => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  } catch (err) {
    console.warn(`Could not save key ${key} to localStorage:`, err);
  }
};

export const exportClassDataJson = (data: Record<string, unknown>) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `Lop6A4_DuLieu_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

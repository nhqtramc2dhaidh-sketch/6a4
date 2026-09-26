import React from 'react';
import { Student } from '../types';
import { BADGES_LIST, CLASS_INFO } from '../data/mockData';
import { Trophy, Star, Sparkles, TrendingUp, Heart, BookOpen, Award } from 'lucide-react';

interface HonorBoardProps {
  students: Student[];
}

export const HonorBoard: React.FC<HonorBoardProps> = ({ students }) => {
  // Sort students by points
  const topActive = [...students].sort((a, b) => b.points - a.points).slice(0, 3);

  // Hardworking students (having 'hardworking' badge)
  const hardworkingStudents = students
    .filter((s) => s.badges.includes('hardworking'))
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  // Improving stars (having 'improving_star' badge)
  const improvingStudents = students
    .filter((s) => s.badges.includes('improving_star'))
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  // Good friends
  const goodFriends = students
    .filter((s) => s.badges.includes('good_friend'))
    .slice(0, 3);

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-extrabold mb-2 shadow-2xs">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Vinh Danh & Khích Lệ Tinh Thần</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Bảng Vàng Danh Dự Tuần - Lớp 6A4
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {CLASS_INFO.schoolName} · "Mỗi sự cố gắng của các em đều xứng đáng được trân trọng và tỏa sáng"
        </p>
      </div>

      {/* Top Podium for Most Active Students */}
      <div className="bg-linear-to-b from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background stars */}
        <div className="absolute top-4 left-6 text-amber-300 opacity-20 text-4xl select-none">✨</div>
        <div className="absolute bottom-6 right-8 text-amber-300 opacity-20 text-5xl select-none">⭐</div>

        <div className="text-center mb-6 relative z-10">
          <span className="inline-block px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider shadow-md">
            🏆 Ngôi Sao Điểm Thưởng Tuần Này
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
            Top 3 Học Sinh Tích Cực Xuất Sắc Nhất
          </h3>
        </div>

        {/* 3 Podiums */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-end max-w-4xl mx-auto relative z-10">
          {/* #2 Hạng Nhì */}
          {topActive[1] && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center flex flex-col items-center order-2 sm:order-1 hover:bg-white/15 transition-all">
              <span className="w-8 h-8 rounded-full bg-slate-300 text-slate-900 font-black text-sm flex items-center justify-center shadow-md mb-2">
                2
              </span>
              <img
                src={topActive[1].avatarUrl}
                alt={topActive[1].name}
                className="w-16 h-16 rounded-full border-2 border-slate-300 object-cover bg-white mb-2 shadow-md"
              />
              <div className="font-extrabold text-sm text-white truncate max-w-full">
                {topActive[1].name}
              </div>
              <div className="text-xs text-slate-300">{topActive[1].group}</div>
              <div className="mt-2 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow-xs">
                ⭐ {topActive[1].points} Điểm
              </div>
            </div>
          )}

          {/* #1 Hạng Nhất (Taller) */}
          {topActive[0] && (
            <div className="bg-linear-to-b from-amber-500/20 to-white/10 backdrop-blur-md border-2 border-amber-400 rounded-3xl p-5 text-center flex flex-col items-center order-1 sm:order-2 shadow-amber-500/20 shadow-2xl scale-105">
              <span className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center shadow-lg mb-2">
                👑 1
              </span>
              <img
                src={topActive[0].avatarUrl}
                alt={topActive[0].name}
                className="w-20 h-20 rounded-full border-4 border-amber-400 object-cover bg-white mb-2 shadow-lg"
              />
              <div className="font-black text-base sm:text-lg text-amber-200 truncate max-w-full">
                {topActive[0].name}
              </div>
              <div className="text-xs text-white/80 font-medium">{topActive[0].group}</div>
              <div className="mt-2 px-4 py-1.5 bg-amber-400 text-slate-950 font-black text-sm rounded-full shadow-md">
                ⭐ {topActive[0].points} Điểm
              </div>
              <p className="text-[11px] text-amber-100 mt-2 italic">
                "Gương mẫu đi đầu trong mọi hoạt động"
              </p>
            </div>
          )}

          {/* #3 Hạng Ba */}
          {topActive[2] && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center flex flex-col items-center order-3 sm:order-3 hover:bg-white/15 transition-all">
              <span className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center shadow-md mb-2">
                3
              </span>
              <img
                src={topActive[2].avatarUrl}
                alt={topActive[2].name}
                className="w-16 h-16 rounded-full border-2 border-amber-700 object-cover bg-white mb-2 shadow-md"
              />
              <div className="font-extrabold text-sm text-white truncate max-w-full">
                {topActive[2].name}
              </div>
              <div className="text-xs text-slate-300">{topActive[2].group}</div>
              <div className="mt-2 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow-xs">
                ⭐ {topActive[2].points} Điểm
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3 Thematic Honor Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category 1: Ngôi Sao Tiến Bộ */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Học Sinh Tiến Bộ Nhất
                </h4>
                <p className="text-xs text-slate-500">Nỗ lực vượt bậc so với tuần trước</p>
              </div>
            </div>

            <div className="space-y-2.5 mt-4">
              {improvingStudents.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-xs font-bold text-emerald-600 w-4">#{idx + 1}</span>
                    <img
                      src={s.avatarUrl}
                      alt={s.name}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.group}</div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                    +{s.points >= 40 ? 15 : 10} điểm tuần
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-medium">
            🌱 "Chỉ cần hôm nay tiến bộ hơn hôm qua là em đã thành công!"
          </div>
        </div>

        {/* Category 2: Học Sinh Chăm Chỉ Nhất */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Học Sinh Chăm Chỉ Nhất
                </h4>
                <p className="text-xs text-slate-500">Làm bài tập đầy đủ, nề nếp gương mẫu</p>
              </div>
            </div>

            <div className="space-y-2.5 mt-4">
              {hardworkingStudents.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-xs font-bold text-blue-600 w-4">#{idx + 1}</span>
                    <img
                      src={s.avatarUrl}
                      alt={s.name}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.group}</div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                    100% bài tập
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-700 font-medium">
            📚 "Cần cù bù thông minh, chăm chỉ gặt hái quả ngọt!"
          </div>
        </div>

        {/* Category 3: Người Bạn Tốt */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                <Heart className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Người Bạn Tốt Của Lớp
                </h4>
                <p className="text-xs text-slate-500">Tận tâm giúp đỡ bạn bè cùng tiến bộ</p>
              </div>
            </div>

            <div className="space-y-2.5 mt-4">
              {goodFriends.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-xs font-bold text-rose-600 w-4">#{idx + 1}</span>
                    <img
                      src={s.avatarUrl}
                      alt={s.name}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.group}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md shrink-0">
                    🤝 Bạn tốt 6A4
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-rose-700 font-medium">
            💖 "Muốn đi nhanh hãy đi một mình, muốn đi xa hãy đi cùng nhau!"
          </div>
        </div>
      </div>
    </div>
  );
};

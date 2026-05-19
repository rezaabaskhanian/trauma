'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getExercisesByTraumaType, getUserProgress } from '@/lib/api';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [traumaType, setTraumaType] = useState('mild');
  const [expandedId, setExpandedId] = useState(null); // برای نمایش توضیحات کامل

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const savedTraumaType = localStorage.getItem('traumaType') || 'mild';
      setTraumaType(savedTraumaType);
      
      const exercisesData = await getExercisesByTraumaType(savedTraumaType);
      setExercises(exercisesData);
      
      const progressData = await getUserProgress(savedTraumaType);
     
      setProgress(progressData);
      
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTraumaTypeLabel = (type) => {
    const labels = {
      mild: 'ترومای خفیف',
      moderate: 'ترومای متوسط',
      severe: 'ترومای شدید',
      complex: 'ترومای پیچیده'
    };
    return labels[type] || 'نامشخص';
  };

  const toggleDescription = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">در حال بارگذاری تمرین‌ها...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = progress?.progress_percent || 0;

  const traumaTypeLabel = getTraumaTypeLabel(traumaType);

  // ایموجی برای هر نوع تمرین
  const getExerciseEmoji = (title) => {
    const emojis = {
      'تنفس عمیق': '🌬️',
      'اسکن بدن': '🔍',
      'تکنیک ۵-۴-۳-۲-۱': '👁️',
      'نوشتن احساسات': '✍️',
      'جعبه ایمن': '📦',
      'تمرین لنگر': '⚓',
      'نامه به خود گذشته': '📝',
      'تمرین شاهد مهربان': '👀',
      'بازسازی خاطره': '🔄',
      'شفقت به خود': '💖',
      'تمرین مرزها': '🛡️',
      'مدیتیشن هدایت‌شده': '🧘'
    };
    return emojis[title] || '🧘';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      
      {/* هدر */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">🧘 تمرین‌های من</h1>
        <p className="text-gray-500 mt-2">
          بر اساس نوع تروما: 
          <span className="font-semibold text-blue-600 mr-1">{traumaTypeLabel}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          این تمرین‌ها به تو کمک می‌کنند تا آرامش را تجربه کنی و احساس بهتری داشته باشی
        </p>
      </div>

      {/* کارت پیشرفت */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">پیشرفت تو</h2>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {progress?.completed_exercises || 0}/{progress?.total_exercises || 0}
          </span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3 mb-2">
          <div
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm opacity-90">
          {progressPercent === 0 && '💪 شروع کن! هر قدم کوچک ارزشمند است'}
          {progressPercent > 0 && progressPercent < 50 && '🌱 عالی! ادامه بده...'}
          {progressPercent >= 50 && progressPercent < 100 && '🎉 خیلی خوب پیش می‌ری!'}
          {progressPercent === 100 && '🏆 آفرین! همه تمرین‌ها رو انجام دادی!'}
        </p>
      </div>

      {/* لیست تمرین‌ها */}
      {exercises.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500">هیچ تمرینی برای این نوع تروما یافت نشد</p>
          <p className="text-sm text-gray-400 mt-2">لطفاً ابتدا تست را کامل کنید</p>
          <Link href="/assessment" className="btn-primary inline-block mt-4">
            شروع تست
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {exercises.map((exercise, index) => {
            const isExpanded = expandedId === exercise.id;
            const emoji = getExerciseEmoji(exercise.title);
            
            return (
              <div
                key={exercise.exercise_info.id} 
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* هدر تمرین */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{emoji}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-gray-800 text-lg">
                              {exercise.exercise_info.title}
                            </h3>
                            {exercise.exercise_info.is_completed && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                ✓ انجام شده
                              </span>
                            )}
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                              ⏱ {exercise.exercise_info.duration} دقیقه
                            </span>
                          </div>
                          {/* توضیح کوتاه */}
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                            {exercise.exercise_info.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* دکمه اقدام */}
                    <Link
                      href={`/exercises/${exercise.exercise_info.id}`}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                        exercise.is_completed
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {exercise.exercise_info.is_completed ? 'انجام شده' : 'شروع تمرین'}
                    </Link>
                  </div>

                  {/* دکمه نمایش توضیحات کامل */}
                  <button
                    onClick={() => toggleDescription(exercise.id)}
                    className="mt-3 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    {isExpanded ? '📖 بستن توضیحات' : '📖 مشاهده توضیحات کامل'}
                    <span>{isExpanded ? '▲' : '▼'}</span>
                  </button>

                  {/* توضیحات کامل (قابل گسترش) */}
                  {isExpanded && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <span>📋</span> راهنمای تمرین
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {exercise.description}
                      </p>
                      <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-blue-600">
                        {/* 💡 نکته: این تمرین را در جای آرام و بدون مزاحمت انجام بده */}

                       
                        {exercise.exercise_info.description ? exercise.exercise_info.description : "نکته: این تمرین را در جای آرام و بدون مزاحمت انجام بده"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* نقل قول انگیزشی */}
      {exercises.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-amber-800 text-sm italic">
            "🌈 هیچ قدمی برای بهبودی کوچک نیست. هر تمرینی که انجام می‌دهی، یک قدم بزرگ به سمت آرامش است."
          </p>
        </div>
      )}
    </div>
  );
}
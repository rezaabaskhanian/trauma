'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [userName, setUserName] = useState('کاربر');
  const [mood, setMood] = useState(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'علی';
    setUserName(name);
    
    // ساعت خوش‌آمدگویی
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('صبح بخیر');
    else if (hour < 18) setGreeting('عصر بخیر');
    else setGreeting('شب بخیر');
  }, []);

  const stats = {
    exercisesDone: 12,
    totalExercises: 20,
    journalEntries: 8,
    streak: 5,
    lastAssessment: '۱۴۰۳/۰۲/۱۵',
    traumaType: 'ترومای خفیف',
  };

  const progressPercent = (stats.exercisesDone / stats.totalExercises) * 100;

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    // TODO: send to backend
  };

  const suggestions = [
    { title: 'تنفس عمیق', duration: '۵ دقیقه', icon: '🌬️', color: 'from-blue-400 to-blue-600' },
    { title: 'اسکن بدن', duration: '۱۰ دقیقه', icon: '🧘', color: 'from-green-400 to-teal-500' },
    { title: 'دفترچه بنویس', duration: '۱۵ دقیقه', icon: '📝', color: 'from-purple-400 to-pink-500' },
  ];

  const quickActions = [
    { title: 'تست جدید', href: '/assessment', icon: '📋', color: 'bg-blue-500', textColor: 'text-white' },
    { title: 'تمرین‌ها', href: '/exercises', icon: '🧘', color: 'bg-green-500', textColor: 'text-white' },
    { title: 'دفترچه', href: '/journal', icon: '📔', color: 'bg-purple-500', textColor: 'text-white' },
    { title: 'پروفایل', href: '/profile', icon: '👤', color: 'bg-orange-500', textColor: 'text-white' },
  ];

  return (
    <div className="space-y-6 pb-20">
      
      {/* هدر خوش‌آمدگویی با گرادیان */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-90">{greeting}</p>
            <h1 className="text-2xl font-bold mt-1">{userName} 👋</h1>
            <p className="text-sm opacity-80 mt-2">امیدوارم امروز روز خوبی داشته باشی</p>
          </div>
          <div className="bg-white/20 rounded-full p-3 backdrop-blur">
            <span className="text-2xl">🦋</span>
          </div>
        </div>
      </div>

      {/* ویجت حس امروز */}
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>😊</span> حس امروز تو چطوره؟
        </h2>
        <div className="flex justify-between gap-2">
          {[
            { emoji: '😞', label: 'خیلی بد', value: 1, color: 'bg-red-100' },
            { emoji: '😕', label: 'بد', value: 2, color: 'bg-orange-100' },
            { emoji: '😐', label: 'معمولی', value: 3, color: 'bg-yellow-100' },
            { emoji: '🙂', label: 'خوب', value: 4, color: 'bg-green-100' },
            { emoji: '😄', label: 'عالی', value: 5, color: 'bg-teal-100' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => handleMoodSelect(item.value)}
              className={`flex-1 flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                mood === item.value
                  ? `${item.color} ring-2 ring-offset-2 ring-blue-400 scale-105`
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs mt-1 text-gray-600">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* کارت پیشرفت */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">پیشرفت تمرین‌ها</h2>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            نوع تروما: {stats.traumaType}
          </span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3 mb-2">
          <div
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm opacity-90">
          {stats.exercisesDone} از {stats.totalExercises} تمرین انجام شده
        </p>
        <div className="flex justify-between mt-4 pt-4 border-t border-white/20 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.streak}</p>
            <p className="text-xs opacity-80">روز پیاپی</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.journalEntries}</p>
            <p className="text-xs opacity-80">یادداشت</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.lastAssessment}</p>
            <p className="text-xs opacity-80">آخرین تست</p>
          </div>
        </div>
      </div>

      {/* دکمه‌های سریع */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>⚡</span> دسترسی سریع
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`${action.color} rounded-xl p-4 text-center ${action.textColor} hover:opacity-90 transition-all hover:scale-105 shadow-md`}
            >
              <span className="text-2xl block mb-1">{action.icon}</span>
              <span className="text-sm font-medium">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* تمرین‌های پیشنهادی */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <span>⭐</span> تمرین‌های پیشنهادی امروز
          </h2>
          <Link href="/exercises" className="text-xs text-blue-500 hover:underline">
            مشاهده همه
          </Link>
        </div>
        <div className="space-y-3">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-r ${item.color} rounded-xl p-4 text-white shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-xs opacity-80">{item.duration}</p>
                  </div>
                </div>
                <Link
                  href={`/exercises/${idx + 1}`}
                  className="bg-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition"
                >
                  شروع
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نقل قول انگیزشی */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 text-center">
        <p className="text-amber-800 text-sm italic">
          "تو قوی‌تر از چیزی هستی که فکر می‌کنی. هر قدم کوچک، یک پیروزی است."
        </p>
      </div>

    </div>
  );
}
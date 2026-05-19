'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJournalEntries, deleteJournalEntry } from '@/lib/api';

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await getJournalEntries();
      setEntries(data);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا مطمئنی می‌خواهی این یادداشت را حذف کنی؟')) return;
    
    setDeleteLoading(id);
    try {
      await deleteJournalEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError(err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getMoodEmoji = (mood) => {
    const moods = {
      1: { emoji: '😞', label: 'خیلی بد', color: 'bg-red-100 text-red-700' },
      2: { emoji: '😕', label: 'بد', color: 'bg-orange-100 text-orange-700' },
      3: { emoji: '😐', label: 'معمولی', color: 'bg-yellow-100 text-yellow-700' },
      4: { emoji: '🙂', label: 'خوب', color: 'bg-green-100 text-green-700' },
      5: { emoji: '😄', label: 'عالی', color: 'bg-teal-100 text-teal-700' }
    };
    return moods[mood] || { emoji: '😐', label: 'معمولی', color: 'bg-gray-100 text-gray-700' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">در حال بارگذاری یادداشت‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* هدر */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">📔</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">دفترچه احساسات</h1>
          <p className="text-gray-500 mt-2">احساساتت را بنویس، رهایش کن</p>
        </div>

        {/* دکمه نوشتن یادداشت جدید */}
        <Link href="/journal/new">
          <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <span className="text-xl">✏️</span>
            نوشتن یادداشت جدید
          </button>
        </Link>

        {/* خطا */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchEntries}
              className="mt-2 text-red-500 text-sm underline"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {/* لیست یادداشت‌ها */}
        {entries.length === 0 && !error ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">هنوز یادداشتی ننوشتی</p>
            <p className="text-sm text-gray-400 mt-1">اولین یادداشت خود را بنویس</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => {
              const moodInfo = getMoodEmoji(entry.mood);
              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
                >
                  {/* هدر یادداشت */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* مود */}
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${moodInfo.color}`}>
                          <span>{moodInfo.emoji}</span>
                          <span>{moodInfo.label}</span>
                        </span>
                        {/* تاریخ */}
                        <span className="text-xs text-gray-400">
                          🕐 {formatDate(entry.created_at)}
                        </span>
                      </div>
                      
                      {/* دکمه‌های اقدام */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/journal/edit/${entry.id}`}
                          className="p-2 text-gray-400 hover:text-blue-500 transition"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={deleteLoading === entry.id}
                          className="p-2 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                        >
                          {deleteLoading === entry.id ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* محتوای یادداشت */}
                  <div className="px-5 pb-5">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {entry.content}
                    </p>
                  </div>

                  {/* فوتر یادداشت (اختیاری) */}
                  <div className="px-5 pb-3 pt-2 border-t border-gray-100">
                    <div className="flex gap-3 text-xs text-gray-400">
                      <span>📝 {entry.content.length} کاراکتر</span>
                      {entry.updated_at !== entry.created_at && (
                        <span>✏️ ویرایش شده</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* نقل قول انگیزشی */}
        {entries.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-amber-800 text-sm italic">
              "🌸 نوشتن، راهی است برای آشتی با خودت. هر کلمه که می‌نویسی، یک قدم به آرامش نزدیک‌تر می‌شوی."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
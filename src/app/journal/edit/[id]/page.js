'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getJournalEntryById, updateJournalEntry } from '@/lib/api';

export default function EditJournalPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const moodOptions = [
    { value: 1, emoji: '😞', label: 'خیلی بد', color: 'bg-red-100 hover:bg-red-200' },
    { value: 2, emoji: '😕', label: 'بد', color: 'bg-orange-100 hover:bg-orange-200' },
    { value: 3, emoji: '😐', label: 'معمولی', color: 'bg-yellow-100 hover:bg-yellow-200' },
    { value: 4, emoji: '🙂', label: 'خوب', color: 'bg-green-100 hover:bg-green-200' },
    { value: 5, emoji: '😄', label: 'عالی', color: 'bg-teal-100 hover:bg-teal-200' }
  ];

  useEffect(() => {
    if (id) {
      fetchEntry();
    }
  }, [id]);

  const fetchEntry = async () => {
    try {
      setLoading(true);
      const data = await getJournalEntryById(id);

      console.log(data,"dataaaaa")
      setContent(data.content);
      setMood(data.mood);
    } catch (err) {
      console.error('Error fetching entry:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('لطفاً متن یادداشت را وارد کن');
      return;
    }

    setSaving(true);
    setError('');

    try {
     const data = await updateJournalEntry(id, content, mood);
     console.log(data)
      router.push('/journal');
    } catch (err) {
      console.error('Error updating entry:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">در حال بارگذاری یادداشت...</p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/journal" className="bg-teal-500 text-white px-6 py-2 rounded-lg">
            بازگشت به دفترچه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* هدر */}
        <div className="text-center">
          <Link href="/journal" className="inline-flex items-center gap-1 text-teal-600 text-sm mb-4">
            ← بازگشت به دفترچه
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">ویرایش یادداشت</h1>
          <p className="text-gray-500 mt-1">احساساتت را ویرایش کن</p>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          
          {/* انتخاب حس */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              امروز چه حسی داری؟
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMood(option.value)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    mood === option.value
                      ? `${option.color} ring-2 ring-teal-500 scale-105`
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-xs mt-1">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* متن یادداشت */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              یادداشت تو
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="امروز چه اتفاقی افتاد؟ چه احساسی داشتی؟"
              className="w-full h-64 p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-2 text-left">
              {content.length} کاراکتر
            </p>
          </div>

          {/* خطا */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* دکمه‌ها */}
          <div className="flex gap-3">
            <Link
              href="/journal"
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-center hover:bg-gray-200 transition"
            >
              انصراف
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50"
            >
              {saving ? 'در حال ذخیره...' : '💾 ذخیره تغییرات'}
            </button>
          </div>
        </form>

        {/* نکته */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
          <p className="text-teal-700 text-sm">
            ✨ هر بار که احساساتت را می‌نویسی، قدمی به سمت آرامش برمی‌داری.
          </p>
        </div>
      </div>
    </div>
  );
}
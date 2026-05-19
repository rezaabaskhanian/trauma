'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getExerciseById, completeExercise } from '@/lib/api';

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id;
  
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
     fetchExercise();
  }, [exerciseId]);

  const fetchExercise = async () => {
    try {
      setLoading(true);
      const data = await getExerciseById(exerciseId);
    
      setExercise(data);
    } catch (err) {
      console.error('Error fetching exercise:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    setError('');
    
    try {
      setLoading(true);
    
      const data = await completeExercise(exerciseId,exercise.trauma_type);

      setCompleted(true);
      
      // بعد از 2 ثانیه برگرد به لیست تمرین‌ها
      setTimeout(() => {
        router.push('/exercises');
      }, 1500);
      
    } catch (err) {
      console.error('Error completing exercise:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">در حال بارگذاری تمرین...</p>
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
            onClick={() => router.push('/exercises')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            بازگشت به تمرین‌ها
          </button>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">تمرین یافت نشد</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-green-800 mb-2">تبریک!</h2>
          <p className="text-green-700 mb-4">تمرین با موفقیت ثبت شد</p>
          <p className="text-sm text-green-600">در حال بازگشت به تمرین‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      
      {/* کارت تمرین */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* هدر تمرین */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🧘</span>
            <div>
              <h1 className="text-xl font-bold">{exercise.title}</h1>
              <p className="text-sm opacity-90 mt-1">
                ⏱ زمان تقریبی: {exercise.duration} دقیقه
              </p>
            </div>
          </div>
        </div>

        {/* محتوای تمرین */}
        <div className="p-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {exercise.description}
            </p>
          </div>

          {/* دکمه انجام تمرین */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleComplete}
              disabled={submitting}
              className="w-full bg-green-500 text-white py-4 rounded-xl font-medium hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {submitting ? 'در حال ثبت...' : '✓ انجام دادم'}
            </button>
            
            <Link
              href="/exercises"
              className="block w-full text-center mt-3 text-gray-500 text-sm hover:text-gray-700"
            >
              ‹ بازگشت به لیست تمرین‌ها
            </Link>
          </div>
        </div>
      </div>

      {/* نکته انگیزشی */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-800 text-sm">
          💪 هر قدم کوچک، یک پیروزی بزرگ است. آفرین به تو برای ادامه دادن این مسیر.
        </p>
      </div>
    </div>
  );
}
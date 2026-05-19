'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {startAssessment,getAssessmentQuestions ,submitAssessment} from '@/lib/api';

export default function AssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [assessmentId, setAssessmentId] = useState(null);
  const [error, setError] = useState('');

  // شروع تست: گرفتن assessmentId و سوالات
  useEffect(() => {
  
    
    StartAssessment();
  }, []);

  const StartAssessment = async () => {
    try {
      setLoading(true);
      
      // 1. شروع تست جدید
      const startRes =await startAssessment();
      
      
       setAssessmentId(startRes.assessment_info.id);
      
      // 2. گرفتن سوالات
      const questionsRes =await getAssessmentQuestions();
      setQuestions(questionsRes.questions);
      
    } catch (err) {
      
      setError('خطا در شروع تست');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleAnswer = async (score) => {
    // ذخیره پاسخ در state محلی
    const newAnswers = { ...answers, [currentQuestion.id]: score };
    setAnswers(newAnswers);

    if (isLast) {
      // آخرین سوال: ارسال همه پاسخ‌ها
      await SubmitAssessment(newAnswers);
    } else {
      // سوال بعدی
      setCurrentIndex(currentIndex + 1);
    }
  };

  const SubmitAssessment = async (Answers) => {
    setSubmitting(true);
    setError('');
    
    try {

      const response =await submitAssessment( 
        assessmentId,Answers,
        
      )

      
      
      // ذخیره نتیجه در localStorage برای استفاده در صفحه نتیجه
      localStorage.setItem('lastAssessmentResult', JSON.stringify(response));
      


      // رفتن به صفحه نتیجه
      router.push(`/assessment/result/${response.assessment_id}`);
      
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('خطا در ثبت پاسخ‌ها');
      setSubmitting(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">در حال آماده‌سازی تست...</p>
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

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">سوالی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* هدر و نوار پیشرفت */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>سوال {currentIndex + 1} از {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* کارت سوال */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {[
              { score: 0, label: 'اصلاً', color: 'bg-gray-100 hover:bg-gray-200' },
              { score: 1, label: 'کمی', color: 'bg-green-100 hover:bg-green-200' },
              { score: 2, label: 'متوسط', color: 'bg-yellow-100 hover:bg-yellow-200' },
              { score: 3, label: 'خیلی', color: 'bg-orange-100 hover:bg-orange-200' },
              { score: 4, label: 'فوق‌العاده زیاد', color: 'bg-red-100 hover:bg-red-200' },
            ].map((option) => (
              <button
                key={option.score}
                onClick={() => handleAnswer(option.score)}
                disabled={submitting}
                className={`w-full p-4 text-right rounded-xl transition-all duration-200 ${option.color} hover:scale-[1.02] active:scale-95`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-sm text-gray-500">{option.score}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* دکمه قبلی */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0 || submitting}
            className="px-6 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ‹ قبلی
          </button>
          
          {!isLast && (
            <div className="text-sm text-gray-400">
              برای ادامه یکی از گزینه‌ها را انتخاب کنید
            </div>
          )}
        </div>

        {/* پیام ایمنی */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm text-center">
          ⚠️ اگر در حین پاسخ‌گویی احساس ناراحتی کردی، می‌توانی تست را متوقف کنی.
          <br />
          شماره خط کمک: <a href="tel:123" className="font-bold underline">۱۲۳</a>
        </div>

        {/* لودینگ هنگام ارسال */}
        {submitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-700">در حال تحلیل پاسخ‌ها...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
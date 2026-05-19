'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

import {getAssessmentResult}  from "@/lib/api"

export default function AssessmentResultPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id;
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!assessmentId) return;

    const fetchResult = async () => {
      try {
        setLoading(true);
        
        // گرفتن نتیجه از بک‌اند
          const response =await getAssessmentResult( 
               assessmentId,
             )
        
        if (!response) {
          throw new Error('نتیجه‌ای یافت نشد');
        }
        
    
        setResult(response);
        
      } catch (err) {
        console.error('Error fetching result:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [assessmentId]);

  const getTraumaTypeColor = (type) => {
    switch (type) {
      case 'mild': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'severe': return 'text-orange-600 bg-orange-100';
      case 'complex': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTraumaTypeFa = (type) => {
    switch (type) {
      case 'mild': return 'ترومای خفیف';
      case 'moderate': return 'ترومای متوسط';
      case 'severe': return 'ترومای شدید';
      case 'complex': return 'ترومای پیچیده';
      default: return 'نامشخص';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">در حال بارگذاری نتیجه...</p>
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
            onClick={() => router.push('/assessment')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            شروع تست جدید
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">نتیجه‌ای یافت نشد</p>
      </div>
    );
  }

  const traumaColor = getTraumaTypeColor(result.trauma_type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* هدر */}
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">📊</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">نتیجه تست تو</h1>
          <p className="text-gray-500 mt-1">بر اساس پاسخ‌هایی که دادی</p>
        </div>

        {/* امتیاز */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-gray-500 mb-2">امتیاز کل</p>
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {result.total_score}
          </div>
          <p className="text-sm text-gray-400">از ۸۰</p>
        </div>

        {/* نوع تروما */}
        <div className={`rounded-2xl shadow-lg p-6 text-center ${traumaColor}`}>
          <p className="opacity-80 mb-2">نوع تروما</p>
          <div className="text-2xl font-bold">
          { getTraumaTypeFa(result.trauma_type)}
            {/* {result.trauma_type_fa || getTraumaTypeFa(result.trauma_type)} */}
          </div>
        </div>

        {/* توضیحات */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-700 leading-relaxed text-center">
            {result.total_score <= 20 && 'علائم خفیف. تمرین‌های آرام‌سازی و تنفس می‌تواند به شما کمک کند.'}
            {result.total_score > 20 && result.total_score <= 32 && 'علائم متوسط. نیاز به تمرین‌های تثبیت و ایمنی دارید.'}
            {result.total_score > 32 && result.total_score <= 50 && 'علائم شدید. تمرین‌های تخصصی تروما همراه با حمایت عاطفی توصیه می‌شود.'}
            {result.total_score > 50 && 'ترومای پیچیده. پیشنهاد می‌شود حتماً با یک متخصص روانشناسی صحبت کنید.'}
          </p>
        </div>

        {/* دکمه‌ها */}
        <div className="space-y-3">
          <Link href="/exercises" className="block w-full bg-blue-500 text-white text-center px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition text-center">
            🧘 مشاهده تمرین‌های مناسب من
          </Link>
          <Link href="/dashboard" className="block w-full border-2 border-blue-500 text-blue-500 text-center px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition">
            🏠 بازگشت به داشبورد
          </Link>
        </div>

        {/* هشدار برای نمره بالا */}
        {result.total_score > 50 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-700 text-sm">
              ⚠️ با توجه به نمره بالا، پیشنهاد می‌کنیم حتماً با یک متخصص مشورت کنی.
              <br />
              <a href="tel:123" className="font-bold underline mt-2 inline-block">
                تماس با خط کمک: ۱۲۳
              </a>
            </p>
          </div>
        )}

        {/* شناسه تست (برای دیباگ - در نسخه نهایی حذف کن) */}
        <p className="text-center text-xs text-gray-400">
          شناسه تست: {assessmentId}
        </p>
      </div>
    </div>
  );
}
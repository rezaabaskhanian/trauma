'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { resetPassword } from '@/lib/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // اعتبارسنجی
    if (!formData.nickname.trim()) {
      setError('نام کاربری را وارد کنید');
      return;
    }
    
    if (!formData.password) {
      setError('رمز عبور جدید را وارد کنید');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await resetPassword(formData.nickname, formData.password); 
      setSuccess('رمز عبور با موفقیت تغییر کرد');
      
      // بعد از ۲ ثانیه به صفحه لاگین برو
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Reset password error:', err);
      const message = err.response?.data?.message || 'خطا در تغییر رمز عبور';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        
        {/* هدر */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">بازنشانی رمز عبور</h1>
          <p className="text-gray-500 mt-2">رمز عبور جدید خود را وارد کنید</p>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* نام کاربری */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام کاربری
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="نام کاربری خود را وارد کنید"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          {/* رمز عبور جدید */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور جدید
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="حداقل ۶ کاراکتر"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* تکرار رمز عبور جدید */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تکرار رمز عبور جدید
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="دوباره وارد کنید"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* خطا */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              ❌ {error}
            </div>
          )}

          {/* موفقیت */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm text-center">
              ✅ {success}
              <br />
              <span className="text-xs">در حال انتقال به صفحه ورود...</span>
            </div>
          )}

          {/* دکمه ارسال */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'در حال تغییر رمز...' : 'تغییر رمز عبور'}
          </button>
        </form>

        {/* لینک بازگشت به ورود */}
        <div className="mt-6 text-center">
          <Link href="/login" className="text-blue-500 text-sm hover:underline">
            ← بازگشت به صفحه ورود
          </Link>
        </div>

      </div>
    </div>
  );
}
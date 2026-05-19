'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phone.trim()) {
      setError('شماره موبایل را وارد کنید');
      return;
    }
    
    if (!formData.password) {
      setError('رمز عبور را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await loginUser(formData.phone, formData.password);


      console.log(response,"tokenssss")

      if (response.tokens) {
        localStorage.setItem('access_token', response.tokens.access_token);
      }
      if (response.tokens) {
        localStorage.setItem('refresh_token', response.tokens.refresh_token);
      }
      if (response.user) {
        localStorage.setItem('userId', response.user.id);
      }
      if (response.user.nickname) {
        localStorage.setItem('userName', response.user.nickname);
      }

      router.push('/');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl">🦋</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">به آرامش خوش آمدی</h1>
          <p className="text-gray-500 mt-2">برای شروع وارد شو</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره موبایل
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="۰۹۱۲۱۲۳۴۵۶۷"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>


<div className="text-right">
  <Link href="/reset-password" className="text-sm text-blue-500 hover:underline">
    رمز عبور را فراموش کرده‌ای؟
  </Link>
</div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            حساب کاربری نداری؟{' '}
            <Link href="/register" className="text-blue-500 font-medium hover:underline">
              ثبت‌نام کن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
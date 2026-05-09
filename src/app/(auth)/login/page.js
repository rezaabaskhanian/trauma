'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // بعداً به بک‌اند متصل می‌شود
    setTimeout(() => {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('userId', '123');
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* لوگو */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl">🦋</span>
          </div>
          <h1 className="text-2xl font-bold text-dark">به آرامش خوش آمدی</h1>
          <p className="text-gray-500 mt-2">برای شروع وارد شو</p>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل یا شماره موبایل
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              رمز عبور را فراموش کرده‌ای؟
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        {/* لینک ثبت‌نام */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            حساب کاربری نداری؟{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">
              ثبت‌نام کن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
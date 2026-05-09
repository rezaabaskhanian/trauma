'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('کاربر');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    
    const name = localStorage.getItem('userName') || 'علی';
    setUserName(name);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-dark">سلام {userName} 👋</h1>
        <p className="text-gray-500 mt-1">حالت چطوره؟ امروز برات اینجام</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/assessment" className="btn-primary text-center">
          📝 شروع تست جدید
        </Link>
        <Link href="/exercises" className="btn-secondary text-center">
          🧘 تمرین‌های من
        </Link>
        <Link href="/journal" className="btn-outline text-center">
          📔 دفترچه احساسات
        </Link>
        <Link href="/profile" className="btn-outline text-center">
          👤 پروفایل
        </Link>
      </div>
    </div>
  );
}
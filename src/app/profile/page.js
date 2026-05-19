'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { getUserProfile } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    id: '',
    nickname: '',
    phone: '',
    role: '',
  });

  const [formData, setFormData] = useState({
    nickname: '',
  });

  useEffect(() => {
   fetchProfile();
    
  }, []);

  const fetchProfile = async () => {

  
    try {
      setLoading(true);
       const token = localStorage.getItem('access_token');

     console.log(token,"tokensss")
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      const response = await getUserProfile();

   
      
      setProfile(response.user);
      setFormData({
        nickname: response.user.nickname || '',
    });
     
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'خطا در دریافت اطلاعات');
      
      // اگر خطای 401 (unauthorized) بود، به لاگین ببر
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
       router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSave = async () => {
    if (!formData.nickname.trim()) {
      setError('نام کاربری نمی‌تواند خالی باشد');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // درخواست به‌روزرسانی پروفایل
      // const response = await apiClient.put('/users/profile', {
      //   nickname: formData.nickname,
      // });
      
      setProfile({
        ...profile,
        nickname: formData.nickname,
      });
      
      localStorage.setItem('userName', formData.nickname);
      setIsEditing(false);
      setSuccess('اطلاعات با موفقیت به‌روزرسانی شد');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'خطا در به‌روزرسانی');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  const getRoleLabel = (role) => {
    const roles = {
      user: { label: 'کاربر عادی', color: 'text-blue-600 bg-blue-100' },
      admin: { label: 'مدیر', color: 'text-purple-600 bg-purple-100' },
      therapist: { label: 'درمانگر', color: 'text-green-600 bg-green-100' },
    };
    return roles[role] || { label: role || 'کاربر', color: 'text-gray-600 bg-gray-100' };
  };

  const roleInfo = getRoleLabel(profile.role);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      
      {/* هدر پروفایل */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-full p-4 backdrop-blur">
            <span className="text-4xl">👤</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.nickname}</h1>
            <p className="text-sm opacity-90">{profile.phone}</p>
          </div>
        </div>
      </div>

      {/* پیام‌های خطا و موفقیت */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-600 text-sm text-center">
          ✅ {success}
        </div>
      )}

      {/* فرم اطلاعات شخصی */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <span>📋</span> اطلاعات شخصی
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 text-sm hover:underline flex items-center gap-1"
            >
              ✏️ ویرایش
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ nickname: profile.nickname });
                  setError('');
                }}
                className="text-gray-500 text-sm hover:underline"
              >
                انصراف
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* نام کاربری */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام کاربری
            </label>
            {isEditing ? (
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="نام کاربری"
              />
            ) : (
              <p className="text-gray-800 py-2">{profile.nickname}</p>
            )}
          </div>

          {/* شماره موبایل (غیرقابل ویرایش) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره موبایل
            </label>
            <p className="text-gray-800 py-2">{profile.phone}</p>
          </div>

          {/* نقش کاربر */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نقش کاربری
            </label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
          </div>

          {/* دکمه ذخیره در حالت ویرایش */}
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition disabled:opacity-50"
            >
              {saving ? 'در حال ذخیره...' : '💾 ذخیره تغییرات'}
            </button>
          )}
        </div>
      </div>

      {/* دکمه خروج */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-4 rounded-xl font-medium hover:bg-red-600 transition-all shadow-md flex items-center justify-center gap-2"
      >
        <span>🚪</span> خروج از حساب
      </button>

    </div>
  );
}
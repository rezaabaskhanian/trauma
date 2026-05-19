// lib/api.js

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8086/';

// ایجاد نمونه Axios با تنظیمات پایه
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 ثانیه
});

// Interceptor برای اضافه کردن توکن به همه درخواست‌ها
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor برای مدیریت خطاهای全局
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // توکن منقضی شده یا نامعتبر
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== سرویس ثبت‌نام ==========
export async function registerUser(userData) {
  try {
    const response = await apiClient.post('users/register', {
      nickname: userData.nickname,
      password_hash: userData.password,
      phone: userData.phone,
      role: userData.role || 'user',
    });
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در ثبت‌نام';
    throw new Error(message);
  }
}

export async function resetPassword(nickname, password) {
  try {
    const response = await apiClient.post('/users/reset-pass', {
      nickname,
      password,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در تغییر رمز عبور';
    throw new Error(message);
  }
}

// ========== سرویس ورود ==========
export async function loginUser(phone, password) {
  try {
    const response = await apiClient.post('users/login', {
      phone_number: phone,
      password_hash: password,
    });

    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در ورود';
    throw new Error(message);
  }
}

// ========== سرویس گرفتن پروفایل کاربر ==========
// export async function getUserProfile(userId) {
//   try {
//     const response = await apiClient.get(`/users/${userId}`);
//     return response.data;
//   } catch (error) {
//     const message = error.response?.data?.message || 'خطا در دریافت پروفایل';
//     throw new Error(message);
//   }
// }

export async function getUserProfile() {
  try {
    const response = await apiClient.get('/users/profile');
    return response.data;
  } catch (error) {
    console.log(error,"ererere")
    // اگر خطای 401 است، پیام خاصی برگردان
    // if (error.response?.status === 401) {
    //   throw new Error('لطفا ابتدا وارد حساب کاربری خود شوید');
    // }
    // const message = error.response?.data?.message || 'خطا در دریافت پروفایل';
    // throw new Error(message);
  }
}

// ========== سرویس به‌روزرسانی پروفایل ==========
export async function updateUserProfile(userId, updateData) {
  try {
    const response = await apiClient.put(`/user/${userId}`, updateData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل';
    throw new Error(message);
  }
}

// ========== سرویس خروج از حساب ==========
export async function logoutUser() {
  try {
    await apiClient.post('/logout');
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در خروج';
    throw new Error(message);
  }
}

// ========== شروع تست==========
export async function startAssessment() {
  try {
    const response = await apiClient.post('/assessment/start');
  
    return response.data;
  } catch (error) {
    console.log(error,"errorrrrssss")
    // const message = error.response?.data?.message || 'خطا در دریافت سوالات';
    // throw new Error(message);
  }
}




// ========== سرویس گرفتن همه سوالات تست ==========
export async function getAssessmentQuestions() {
  try {
    const response = await apiClient.get('/assessment/questions');

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در دریافت سوالات';
    throw new Error(message);
  }
}

// ========== سرویس ارسال پاسخ‌های تست ==========
export async function submitAssessment(assessmentId ,answers) {


  try {

 
    const response = await apiClient.post('/assessment/submit', {
      
      assessment_id: assessmentId,
      answers: answers,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'ی موحودخطا در ثبت پاسخ‌ها';
    throw new Error(message);
  }
}



export async function getAssessmentResult(assessmentId ) {
  try {
    const response = await apiClient.get(`/assessment/result/${assessmentId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'ی موحودخطا در ثبت پاسخ‌ها';
    throw new Error(message);
  }
}




// گرفتن لیست تمرین‌ها بر اساس نوع تروما
export async function getExercisesByTraumaType(traumaType) {
  try {
    const response = await apiClient.get(`/exercises/by-trauma/${traumaType}`);

    console.log(response.data,"trauma_typeeeee")
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در دریافت تمرین‌ها';
    throw new Error(message);
  }
}


// گرفتن جزئیات یک تمرین
export async function getExerciseById(exerciseId) {
  try {
    const response = await apiClient.get(`/exercises/by-id/${exerciseId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در دریافت تمرین';
    throw new Error(message);
  }
}



// ثبت انجام تمرین
export async function completeExercise(exerciseId,traumaType) {
  try {
    const response = await apiClient.post(`/exercises/${exerciseId}/complete`,{
      trauma_type :traumaType
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در ثبت انجام تمرین';
    throw new Error(message);
  }
}

// ========== سرویس گرفتن پیشرفت کاربر ==========
export async function getUserProgress(traumaType) {

  
  try {
    const response = await apiClient.get('/exercises/user_progress',{
      params: {
        trauma_type:traumaType
    }
    });
    
    return response.data;
  } catch (error) {
 
    const message = error.response?.data?.message || 'خطا در دریافت پیشرفت';
    throw new Error(message);
  }
}

// ========== سرویس گرفتن یادداشت‌های دفترچه ==========
export async function getJournalEntries(userId, page = 1, limit = 10) {
  try {
    const response = await apiClient.get('/journal', {
      params: { user_id: userId, page, limit },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در دریافت یادداشت‌ها';
    throw new Error(message);
  }
}

// ========== سرویس ایجاد یادداشت جدید ==========
export async function createJournalEntry(userId, content, mood) {
  try {
    const response = await apiClient.post('/journal', {
      user_id: userId,
      content: content,
      mood: mood,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در ایجاد یادداشت';
    throw new Error(message);
  }
}

// ========== سرویس به‌روزرسانی یادداشت ==========
export async function updateJournalEntry(entryId, content, mood) {
  try {
    const response = await apiClient.put(`/journal/${entryId}`, {
      content: content,
      mood: mood,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در به‌روزرسانی یادداشت';
    throw new Error(message);
  }
}

// ========== سرویس حذف یادداشت ==========
export async function deleteJournalEntry(entryId) {
  try {
    const response = await apiClient.delete(`/journal/${entryId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'خطا در حذف یادداشت';
    throw new Error(message);
  }
}

// export خود apiClient برای استفاده در جاهای خاص
export default apiClient;
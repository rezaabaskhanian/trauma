const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// ========== Assessment ==========
export async function getQuestions() {
  const res = await fetch(`${API_URL}/assessment/questions`);
  return res.json();
}

export async function submitAssessment(userId, answers) {
  const res = await fetch(`${API_URL}/assessment/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, answers }),
  });
  return res.json();
}

// ========== Exercises ==========
export async function getExercises(traumaType) {
  const res = await fetch(`${API_URL}/exercises?trauma_type=${traumaType}`);
  return res.json();
}

export async function completeExercise(userId, exerciseId) {
  const res = await fetch(`${API_URL}/exercises/${exerciseId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  return res.json();
}

export async function getUserProgress(userId) {
  const res = await fetch(`${API_URL}/exercises/progress?user_id=${userId}`);
  return res.json();
}

// ========== Journal ==========
export async function getJournalEntries(userId) {
  const res = await fetch(`${API_URL}/journal?user_id=${userId}`);
  return res.json();
}

export async function createJournalEntry(userId, content, mood) {
  const res = await fetch(`${API_URL}/journal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, content, mood }),
  });
  return res.json();
}

export async function updateJournalEntry(id, content, mood) {
  const res = await fetch(`${API_URL}/journal/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, mood }),
  });
  return res.json();
}

export async function deleteJournalEntry(id) {
  const res = await fetch(`${API_URL}/journal/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
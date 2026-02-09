const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Question {
  id: string;
  text: string;
  explanation: string | null;
  isActive: boolean;
  createdAt: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface QuizAttempt {
  id: string;
  name: string;
  district: string;
  ageGroup: string;
  score: number;
  percentage: number;
  passed: boolean;
  createdAt: string;
}

export interface Analytics {
  totalAttempts: number;
  passedCount: number;
  failedCount: number;
  averageScore: number;
  totalCertificates: number;
  totalAnswers: number;
  toughestQuestions: {
    questionId: string;
    text: string;
    totalAnswers: number;
    correctAnswers: number;
    successRate: number;
  }[];
  easiestQuestions: {
    questionId: string;
    text: string;
    totalAnswers: number;
    correctAnswers: number;
    successRate: number;
  }[];
  statsByDistrict: {
    district: string;
    totalAttempts: number;
    passedCount: number;
    averageScore: number;
  }[];
  statsByAgeGroup: {
    ageGroup: string;
    totalAttempts: number;
    passedCount: number;
    averageScore: number;
  }[];
  statsByGender: {
    gender: string;
    totalAttempts: number;
    passedCount: number;
    averageScore: number;
  }[];
}

export async function getQuestions(): Promise<Question[]> {
  const response = await fetch(`${API_URL}/admin/questions`);
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  return response.json();
}

export async function createQuestion(data: {
  text: string;
  explanation?: string;
  options: { text: string; isCorrect: boolean }[];
}): Promise<Question> {
  const response = await fetch(`${API_URL}/admin/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create question");
  }
  return response.json();
}

export async function updateQuestion(
  id: string,
  data: {
    text?: string;
    explanation?: string;
    options?: { text: string; isCorrect: boolean }[];
    isActive?: boolean;
  },
): Promise<Question> {
  const response = await fetch(`${API_URL}/admin/questions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update question");
  }
  return response.json();
}

export async function deleteQuestion(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/admin/questions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete question");
  }
}

export async function getAnalytics(): Promise<Analytics> {
  const response = await fetch(`${API_URL}/analytics`);
  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return response.json();
}

export async function getAttempts(filters?: {
  district?: string;
  ageGroup?: string;
}): Promise<QuizAttempt[]> {
  const params = new URLSearchParams();
  if (filters?.district) params.set("district", filters.district);
  if (filters?.ageGroup) params.set("ageGroup", filters.ageGroup);
  const query = params.toString();
  const url = query
    ? `${API_URL}/admin/attempts?${query}`
    : `${API_URL}/admin/attempts`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch attempts");
  }
  return response.json();
}

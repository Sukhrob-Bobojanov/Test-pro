
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Subject {
  id: string;
  name: string;
  questions: Question[];
  questionsPerVariant: number; // Har bir variantda nechta savol bo'lishi
  durationMinutes: number;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  isActive: boolean;
}

export interface StudentRecord {
  id: string;
  fullName: string;
  groupName: string;
  subjectId: string;
  subjectName: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  answers: {
    questionId: number;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

export type AppStep = 'landing' | 'admin-login' | 'admin' | 'student-login' | 'quiz' | 'result' | 'reports';

declare global {
  interface Window {
    XLSX: any;
  }
}

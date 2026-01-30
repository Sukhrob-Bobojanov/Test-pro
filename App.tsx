
import React, { useState, useEffect, useCallback } from 'react';
import { AppStep, Question, QuizResult, Subject, StudentRecord } from './types';
import QuizContainer from './components/QuizContainer';
import ResultView from './components/ResultView';
import AdminDashboard from './components/AdminDashboard';
import StudentLogin from './components/StudentLogin';
import ReportViewer from './components/ReportViewer';
import AdminLogin from './components/AdminLogin';

const shuffle = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('landing');
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('edu_subjects');
    return saved ? JSON.parse(saved) : [];
  });
  const [records, setRecords] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem('edu_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [studentInfo, setStudentInfo] = useState<{name: string, group: string} | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('edu_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('edu_records', JSON.stringify(records));
  }, [records]);

  const handleStartQuiz = (subject: Subject, info: {name: string, group: string}) => {
    // Pick dynamic number of random questions based on subject config
    const shuffled = shuffle<Question>(subject.questions);
    const limit = subject.questionsPerVariant || 50;
    const selected = shuffled.slice(0, Math.min(limit, subject.questions.length)).map(q => ({
      ...q,
      options: shuffle<string>(q.options)
    }));

    setActiveSubject(subject);
    setStudentInfo(info);
    setActiveQuestions(selected);
    setStep('quiz');
  };

  const handleQuizFinish = (result: QuizResult) => {
    if (!activeSubject || !studentInfo) return;

    const newRecord: StudentRecord = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: studentInfo.name,
      groupName: studentInfo.group,
      subjectId: activeSubject.id,
      subjectName: activeSubject.name,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      completedAt: new Date().toISOString()
    };

    setRecords(prev => [...prev, newRecord]);
    setFinalResult(result);
    setStep('result');
  };

  const resetToHome = () => {
    setStep('landing');
    setActiveSubject(null);
    setStudentInfo(null);
    setFinalResult(null);
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto bg-white shadow-2xl flex flex-col relative overflow-hidden border-x border-slate-200">
      <header className="bg-slate-900 p-5 text-white flex items-center justify-between shadow-xl border-b border-indigo-500/30">
        <div className="flex items-center gap-3 cursor-pointer" onClick={resetToHome}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 01-.586 1.414l-2.414 2.414c-.126.126-.31.146-.453.059A1.107 1.107 0 017.5 13V5L6.5 4H8z" />
            </svg>
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tighter leading-none">RANCH UNIVERSITY</h1>
            <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">CiTRON Laboratory 2026</p>
          </div>
        </div>
        {step !== 'landing' && (
          <button onClick={resetToHome} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-xs font-bold transition uppercase tracking-widest border border-white/10">
            Chiqish
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {step === 'landing' && (
          <div className="p-8 space-y-12 flex flex-col items-center justify-center min-h-[75vh]">
            <div className="text-center space-y-4">
              <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black tracking-widest uppercase mb-2">
                Digital Examination Portal
              </div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">Online Nazorat</h2>
              <p className="text-slate-500 text-lg font-medium max-w-md mx-auto">Yakuniy nazorat ishlarini topshirish va boshqarish tizimi</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
              <button 
                onClick={() => setStep('student-login')}
                className="group relative bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 text-center"
              >
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-800">Talaba</h3>
                <p className="text-slate-400 text-sm mt-2 font-medium">Test topshirish uchun</p>
              </button>

              <button 
                onClick={() => setStep('admin-login')}
                className="group relative bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:border-slate-800 hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-500 text-center"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 -rotate-3 group-hover:rotate-0">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-800">Admin</h3>
                <p className="text-slate-400 text-sm mt-2 font-medium">Boshqaruv paneli</p>
              </button>
            </div>
          </div>
        )}

        {step === 'admin-login' && (
          <AdminLogin onLogin={() => setStep('admin')} />
        )}

        {step === 'admin' && (
          <AdminDashboard 
            subjects={subjects} 
            setSubjects={setSubjects} 
            onViewReports={() => setStep('reports')} 
          />
        )}

        {step === 'student-login' && (
          <StudentLogin 
            subjects={subjects} 
            records={records}
            onStart={handleStartQuiz} 
          />
        )}

        {step === 'quiz' && activeSubject && (
          <div className="p-4">
            <QuizContainer 
              questions={activeQuestions} 
              onFinish={handleQuizFinish} 
              timeInMinutes={activeSubject.durationMinutes}
            />
          </div>
        )}

        {step === 'result' && finalResult && (
          <div className="p-4">
            <ResultView 
              result={finalResult} 
              onRestart={() => setStep('landing')} 
              onHome={resetToHome} 
            />
          </div>
        )}

        {step === 'reports' && (
          <ReportViewer 
            records={records} 
            subjects={subjects} 
            onBack={() => setStep('admin')} 
          />
        )}
      </main>

      <footer className="bg-slate-900 p-6 text-center border-t border-indigo-500/20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase mb-1">CiTRON Laboratory & Ranch University</p>
        <p className="text-[9px] text-slate-600 font-medium">Digital Examination Framework v4.0.26 &bull; High Integrity Mode Enabled</p>
      </footer>
    </div>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { Question, QuizResult } from '../types';

interface Props {
  questions: Question[];
  onFinish: (result: QuizResult) => void;
  timeInMinutes: number;
}

const QuizContainer: React.FC<Props> = ({ questions, onFinish, timeInMinutes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(timeInMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (option: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    const scoredAnswers = questions.map(q => ({
      questionId: q.id,
      questionText: q.text,
      userAnswer: userAnswers[q.id] || "Belgilanmagan",
      correctAnswer: q.correctAnswer,
      isCorrect: userAnswers[q.id] === q.correctAnswer
    }));

    const correctCount = scoredAnswers.filter(a => a.isCorrect).length;

    onFinish({
      score: correctCount,
      total: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100),
      answers: scoredAnswers
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">
            <span>Savol {currentIndex + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className={`flex items-center gap-1 font-mono font-bold text-lg px-3 py-1 rounded-xl ${timeLeft < 300 ? 'text-red-600 bg-red-50 border border-red-100 animate-pulse' : 'text-slate-700 bg-slate-50 border border-slate-100'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[400px] flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-8 leading-snug">{currentQuestion.text}</h3>
        <div className="space-y-3 flex-1">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = userAnswers[currentQuestion.id] === option;
            const letter = String.fromCharCode(65 + idx);
            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(option)}
                className={`w-full p-4 rounded-2xl text-left transition-all border-2 flex items-center gap-4 ${isSelected ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-100' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                  {letter}
                </span>
                <span className="font-semibold text-sm">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-6">
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="py-4 rounded-2xl border-2 border-slate-200 font-bold text-slate-400 disabled:opacity-20 transition"
        >
          Oldingisi
        </button>
        <button
          onClick={handleNext}
          className="py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-indigo-200 transition active:scale-95"
        >
          {currentIndex === questions.length - 1 ? 'Tugatish' : 'Keyingisi'}
        </button>
      </div>
    </div>
  );
};

export default QuizContainer;


import React, { useState } from 'react';
import { QuizResult } from '../types';

interface Props {
  result: QuizResult;
  onRestart: () => void;
  onHome: () => void;
}

const ResultView: React.FC<Props> = ({ result, onRestart, onHome }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getMessage = () => {
    if (result.percentage >= 90) return { title: "A'lo!", sub: "Siz barcha savollarga deyarli to'liq javob berdingiz!", color: "text-green-600", icon: "🏆" };
    if (result.percentage >= 70) return { title: "Yaxshi!", sub: "Siz yaxshi natija ko'rsatdingiz.", color: "text-blue-600", icon: "⭐" };
    if (result.percentage >= 50) return { title: "Qoniqarli", sub: "Yana bir oz ko'proq shug'ullanish kerak.", color: "text-yellow-600", icon: "📈" };
    return { title: "Yomon natija", sub: "Mavzuni qaytadan o'qib chiqing.", color: "text-red-600", icon: "📚" };
  };

  const msg = getMessage();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center py-8">
        <span className="text-6xl mb-4 block">{msg.icon}</span>
        <h2 className={`text-3xl font-black ${msg.color}`}>{msg.title}</h2>
        <p className="text-slate-500 mt-2">{msg.sub}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ball</p>
          <p className="text-3xl font-black text-slate-800">{result.score} / {result.total}</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Foiz</p>
          <p className={`text-3xl font-black ${msg.color}`}>{result.percentage}%</p>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <button 
          onClick={onRestart}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition"
        >
          Qaytadan urinish
        </button>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition"
        >
          {showDetails ? "Tahlilni berkitish" : "Savollar tahlili"}
        </button>
        <button 
          onClick={onHome}
          className="w-full py-3 text-slate-400 font-medium text-sm hover:text-indigo-600 transition"
        >
          Bosh sahifaga qaytish
        </button>
      </div>

      {showDetails && (
        <div className="space-y-4 pt-4 pb-8">
          <h3 className="font-bold text-slate-800 text-lg border-b pb-2">Batafsil tahlil:</h3>
          {result.answers.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border-l-4 ${item.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <p className="text-xs text-slate-400 font-bold mb-1">SAVOL {idx + 1}</p>
              <p className="font-semibold text-slate-800 text-sm mb-3">{item.questionText}</p>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${item.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-xs">
                    <span className="font-bold text-slate-500">Sizning javobingiz: </span>
                    <span className={`font-semibold ${item.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{item.userAnswer}</span>
                  </p>
                </div>
                {!item.isCorrect && (
                  <div className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <p className="text-xs">
                      <span className="font-bold text-slate-500">To'g'ri javob: </span>
                      <span className="font-semibold text-green-700">{item.correctAnswer}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultView;

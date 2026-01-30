
import React, { useState } from 'react';
import { Subject, Question } from '../types';
import FileImport from './FileImport';

interface Props {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  onViewReports: () => void;
}

const AdminDashboard: React.FC<Props> = ({ subjects, setSubjects, onViewReports }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [questionsPerVariant, setQuestionsPerVariant] = useState(50);
  const [duration, setDuration] = useState(60);
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const resetForm = () => {
    setName('');
    setQuestionsPerVariant(50);
    setDuration(60);
    setStartDateTime('');
    setEndDateTime('');
    setQuestions([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (s: Subject) => {
    setName(s.name);
    setQuestionsPerVariant(s.questionsPerVariant || 50);
    setDuration(s.durationMinutes);
    setStartDateTime(s.startTime.slice(0, 16));
    setEndDateTime(s.endTime.slice(0, 16));
    setQuestions(s.questions);
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!name || questions.length === 0) {
      alert('Ma\'lumotlarni to\'liq kiriting!');
      return;
    }

    const subjectData: Subject = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name,
      questions,
      questionsPerVariant,
      durationMinutes: duration,
      startTime: startDateTime || new Date().toISOString(),
      endTime: endDateTime || new Date(Date.now() + 86400000).toISOString(),
      isActive: true
    };

    if (editingId) {
      setSubjects(prev => prev.map(s => s.id === editingId ? subjectData : s));
    } else {
      setSubjects(prev => [...prev, subjectData]);
    }
    resetForm();
  };

  const deleteSubject = (id: string) => {
    if(confirm('Ushbu fanni o\'chirmoqchimisiz?')) {
      setSubjects(prev => prev.filter(s => s.id !== id));
    }
  };

  const exportGlobalConfig = () => {
    const data = {
      subjects,
      version: "4.2",
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert("Fayl 'config.json' nomi bilan yuklandi. Uni serverga (root papkaga) joylasangiz, barcha qurilmalarda avtomatik ko'rinadi.");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Admin Paneli</h2>
        <div className="flex gap-2">
          <button 
            onClick={exportGlobalConfig}
            className="bg-green-600 text-white px-4 py-2.5 rounded-2xl text-[10px] font-black shadow-lg hover:bg-green-700 transition uppercase tracking-widest flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 9l-4-4m0 0L8 9m4-4v12" />
            </svg>
            Global Sync
          </button>
          <button 
            onClick={onViewReports}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-2xl text-[10px] font-black shadow-lg hover:bg-indigo-700 transition uppercase tracking-widest"
          >
            Natijalar
          </button>
        </div>
      </div>

      {!showForm ? (
        <div className="space-y-4">
          <button 
            onClick={() => setShowForm(true)}
            className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            YANGI FAN QO'SHISH
          </button>

          <div className="grid grid-cols-1 gap-4">
            <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] ml-4">Mavjud testlar</h3>
            {subjects.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] py-20 text-center">
                <p className="text-slate-300 font-bold italic">Hozircha testlar yo'q</p>
                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-black">Yangi fan qo'shing</p>
              </div>
            ) : (
              subjects.map(s => (
                <div key={s.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="space-y-1">
                    <h4 className="font-black text-xl text-slate-800 leading-tight">{s.name}</h4>
                    <div className="flex gap-2">
                      <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded-lg text-[10px] font-black border border-slate-100">SAVOLLAR: {s.questions.length}</span>
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg text-[10px] font-black border border-indigo-100">VAQT: {s.durationMinutes}m</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(s)} className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => deleteSubject(s.id)} className="bg-red-50 text-red-600 p-3 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 space-y-8 animate-in zoom-in duration-300 shadow-2xl">
          <div className="flex justify-between items-center">
             <h3 className="text-2xl font-black text-slate-800">{editingId ? 'Tahrirlash' : 'Yangi Fan'}</h3>
             <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fan nomi</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-indigo-500 p-4 font-bold outline-none" 
                  placeholder="Masalan: Fizika"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Savollar/Variant</label>
                  <input type="number" value={questionsPerVariant} onChange={e => setQuestionsPerVariant(parseInt(e.target.value))} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vaqt (minut)</label>
                  <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 font-bold outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Boshlanish</label>
                  <input type="datetime-local" value={startDateTime} onChange={e => setStartDateTime(e.target.value)} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 font-bold outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tugash</label>
                  <input type="datetime-local" value={endDateTime} onChange={e => setEndDateTime(e.target.value)} className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 font-bold outline-none text-sm" />
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Excel bazasi</label>
              <FileImport 
                onImport={(qs) => setQuestions(qs)} 
                onBack={() => {}} 
                isEmbedded={true} 
                hasData={questions.length > 0} 
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={resetForm} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">Bekor qilish</button>
            <button onClick={handleSave} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition">SAQLASH</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

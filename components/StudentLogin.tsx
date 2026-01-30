
import React, { useState } from 'react';
import { Subject, StudentRecord } from '../types';

interface Props {
  subjects: Subject[];
  records: StudentRecord[];
  onStart: (subject: Subject, info: {name: string, group: string}) => void;
}

const StudentLogin: React.FC<Props> = ({ subjects, records, onStart }) => {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !group || !selectedSubjectId) {
      setError('Barcha maydonlarni to\'ldiring');
      return;
    }

    const subject = subjects.find(s => s.id === selectedSubjectId);
    if (!subject) return;

    // Check Time
    const now = new Date();
    const start = new Date(subject.startTime);
    const end = new Date(subject.endTime);

    if (now < start) {
      setError(`Test hali boshlanmagan. Boshlanish vaqti: ${start.toLocaleString()}`);
      return;
    }

    if (now > end) {
      setError(`Test muddati tugagan. Tugash vaqti: ${end.toLocaleString()}`);
      return;
    }

    // Check Attempts (based on Name + Group + Subject)
    const alreadyTaken = records.some(r => 
      r.fullName.toLowerCase() === name.toLowerCase() && 
      r.groupName.toLowerCase() === group.toLowerCase() && 
      r.subjectId === selectedSubjectId
    );

    if (alreadyTaken) {
      setError('Siz ushbu testni topshirib bo\'lgansiz. Qaytadan topshirish imkoni yo\'q.');
      return;
    }

    onStart(subject, { name, group });
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-right duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800">Testga Kirish</h2>
        <p className="text-slate-500 text-sm mt-1">Ma'lumotlaringizni to'g'ri kiriting</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Fan</label>
            <select 
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-indigo-500 transition outline-none text-slate-800 font-semibold"
            >
              <option value="">Fanni tanlang...</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">F.I.O.</label>
            <input 
              type="text" 
              placeholder="Masalan: Toshmatov Ali"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-indigo-500 transition outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Guruh</label>
            <input 
              type="text" 
              placeholder="Masalan: 301-guruh"
              value={group}
              onChange={e => setGroup(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-indigo-500 transition outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex gap-3">
             <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
             </svg>
             {error}
          </div>
        )}

        <button 
          type="submit"
          className="w-full py-4 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-xl hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          Testni Boshlash
        </button>

        <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
          Diqqat! Testni faqat 1 marta topshirish mumkin. <br/>Vaqt tugasa, natijalar avtomatik saqlanadi.
        </p>
      </form>
    </div>
  );
};

export default StudentLogin;

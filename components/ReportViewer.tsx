
import React, { useState, useMemo } from 'react';
import { StudentRecord, Subject } from '../types';

interface Props {
  records: StudentRecord[];
  subjects: Subject[];
  onBack: () => void;
}

const ReportViewer: React.FC<Props> = ({ records, subjects, onBack }) => {
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGroup, setFilterGroup] = useState('');

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSub = !filterSubject || r.subjectId === filterSubject;
      const matchGroup = !filterGroup || r.groupName.toLowerCase().includes(filterGroup.toLowerCase());
      return matchSub && matchGroup;
    }).sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }, [records, filterSubject, filterGroup]);

  const exportToExcel = () => {
    if (filteredRecords.length === 0) return;

    const data = filteredRecords.map((r, idx) => ({
      '№': idx + 1,
      'F.I.O.': r.fullName,
      'Guruh': r.groupName,
      'Fan': r.subjectName,
      'Ball': r.score,
      'Jami': r.total,
      'Foiz (%)': r.percentage,
      'Sana': new Date(r.completedAt).toLocaleString()
    }));

    const worksheet = window.XLSX.utils.json_to_sheet(data);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Hisobot');
    
    const fileName = `Hisobot_${filterSubject ? subjects.find(s=>s.id===filterSubject)?.name : 'Barcha'}_${new Date().toLocaleDateString()}.xlsx`;
    window.XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-slate-800">Test Hisobotlari</h2>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select 
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Barcha fanlar</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input 
            type="text" 
            placeholder="Guruh bo'yicha qidirish..."
            value={filterGroup}
            onChange={e => setFilterGroup(e.target.value)}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button 
          onClick={exportToExcel}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-sm transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 9l-4-4m0 0L8 9m4-4v12" />
          </svg>
          Excel shaklida yuklash
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-3 font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Talaba</th>
                <th className="p-3 font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Fan / Guruh</th>
                <th className="p-3 font-bold text-slate-500 uppercase tracking-tighter text-[10px]">Natija</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400 italic">Ma'lumotlar mavjud emas</td>
                </tr>
              ) : (
                filteredRecords.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-800 leading-tight">{r.fullName}</div>
                      <div className="text-[10px] text-slate-400">{new Date(r.completedAt).toLocaleString()}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-700">{r.subjectName}</div>
                      <div className="text-[10px] font-bold text-indigo-500">{r.groupName}</div>
                    </td>
                    <td className="p-3">
                      <div className={`font-black ${r.percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                        {r.score}/{r.total}
                      </div>
                      <div className="text-[10px] text-slate-400">{r.percentage}%</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;

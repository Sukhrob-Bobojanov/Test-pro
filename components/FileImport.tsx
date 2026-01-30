
import React, { useState } from 'react';
import { Question } from '../types';

interface Props {
  onImport: (questions: Question[]) => void;
  onBack: () => void;
  isEmbedded?: boolean;
  hasData?: boolean;
}

const FileImport: React.FC<Props> = ({ onImport, onBack, isEmbedded = false, hasData = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = window.XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const parsed: Question[] = [];
        const startIdx = jsonData[0] && jsonData[0].toString().includes('Savol') ? 1 : 0;

        for (let i = startIdx; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (!row || !row[1] || !row[2]) continue;

          parsed.push({
            id: i,
            text: row[1].toString(),
            options: [
              row[2]?.toString(),
              row[3]?.toString(),
              row[4]?.toString(),
              row[5]?.toString()
            ].filter(Boolean),
            correctAnswer: row[2]?.toString()
          });
        }

        if (parsed.length === 0) {
          throw new Error("Faylda savollar topilmadi.");
        }

        setTimeout(() => {
          onImport(parsed);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError("Faylni o'qishda xatolik yuz berdi.");
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  if (isEmbedded) {
    return (
      <div className="h-full flex flex-col gap-4">
        <div className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-all relative cursor-pointer ${hasData ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400'}`}>
           <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
           {loading ? (
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
           ) : hasData ? (
             <div className="text-center">
               <svg className="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <p className="text-xs font-black text-green-700 uppercase">Ma'lumotlar yuklandi!</p>
               <p className="text-[10px] text-green-600">Almashtirish uchun bosing</p>
             </div>
           ) : (
             <div className="text-center">
               <svg className="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
               </svg>
               <p className="text-xs font-black text-slate-400 uppercase">Excel faylni tanlang</p>
             </div>
           )}
        </div>
        {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Fallback for regular mode if needed */}
      <button onClick={onBack} className="text-indigo-600 font-bold">Orqaga</button>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
    </div>
  );
};

export default FileImport;

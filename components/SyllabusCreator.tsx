import React, { useState } from 'react';
import { Course, Syllabus, UserRole } from '../types';
import { BookOpen, Save, Printer, FileText } from 'lucide-react';

interface SyllabusCreatorProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  role: UserRole;
  currentUserId?: string;
}

const SyllabusCreator: React.FC<SyllabusCreatorProps> = ({ courses, setCourses, role, currentUserId }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  // Filter courses based on role
  const availableCourses = role === 'TEACHER' 
    ? courses.filter(c => c.teacherId === currentUserId)
    : role === 'STUDENT'
      ? courses.filter(c => c.studentIds?.includes(currentUserId || ''))
      : courses; // Admin sees all

  const currentCourse = courses.find(c => c.id === selectedCourseId);
  const currentSyllabus = currentCourse?.syllabus || {
    desc: '', obj: '', out: '', content: '', strat: '', assess: '', res: ''
  };

  const handleUpdate = (field: keyof Syllabus, value: string) => {
    if (!currentCourse) return;
    const updatedSyllabus = { ...currentSyllabus, [field]: value };
    const updatedCourse = { ...currentCourse, syllabus: updatedSyllabus };
    setCourses(prev => prev.map(c => c.id === currentCourse.id ? updatedCourse : c));
  };

  const isEditable = role === 'ADMIN' || role === 'TEACHER';

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto flex flex-col gap-6 print:block print:w-full print:max-w-none print:m-0 print:p-0">
      
      {/* Header & Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
         <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Course</label>
            <select 
              value={selectedCourseId} 
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#8e44ad] outline-none"
            >
              <option value="">-- Choose a Course --</option>
              {availableCourses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
         </div>
         <div className="flex gap-2">
            <button 
               onClick={() => window.print()} 
               className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors shadow-sm font-medium ${currentCourse ? 'bg-[#8e44ad] text-white hover:bg-[#4a235a]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
               disabled={!currentCourse}
            >
               <Printer size={18} />
               <span>Print Syllabus</span>
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      {currentCourse ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] print:shadow-none print:border-0 print:rounded-none print:min-h-0 print:block">
           {/* Syllabus Paper Layout */}
           <div className="p-8 md:p-12 max-w-4xl mx-auto print:p-0 print:max-w-none print:mx-0">
              
              {/* Print CSS Injection */}
              <style type="text/css" media="print">
               {`
                 @page { size: A4; margin: 15mm; }
                 body * { visibility: hidden; }
                 #syllabus-print-area, #syllabus-print-area * { visibility: visible; }
                 #syllabus-print-area { position: absolute; left: 0; top: 0; width: 100%; }
               `}
              </style>

              <div id="syllabus-print-area">
                {/* Header */}
                <div className="text-center border-b-4 border-double border-[#8e44ad] pb-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-500 uppercase">C.R.Williams Performing Arts Academy</h2>
                    <h1 className="text-3xl font-bold text-[#4a235a] mt-2 mb-1">COURSE SYLLABUS</h1>
                    <h3 className="text-2xl font-bold text-[#8e44ad]">{currentCourse.name}</h3>
                    <p className="font-mono text-slate-600 mt-2">{currentCourse.code} | {currentCourse.credits} Credits</p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                   {/* Description */}
                   <section>
                      <h4 className="text-sm font-bold text-[#8e44ad] uppercase tracking-wider mb-2 border-b border-purple-100 pb-1">Course Description</h4>
                      {isEditable ? (
                         <textarea 
                           value={currentSyllabus.desc} 
                           onChange={e => handleUpdate('desc', e.target.value)}
                           className="w-full p-3 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8e44ad] min-h-[80px] print:hidden"
                           placeholder="Enter course description..."
                         />
                      ) : null}
                      {(!isEditable || currentSyllabus.desc) && (
                          <p className={`text-slate-700 leading-relaxed whitespace-pre-wrap ${isEditable ? 'hidden print:block' : ''}`}>{currentSyllabus.desc || 'No description available.'}</p>
                      )}
                   </section>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <section>
                          <h4 className="text-sm font-bold text-[#8e44ad] uppercase tracking-wider mb-2 border-b border-purple-100 pb-1">Objectives</h4>
                          {isEditable ? (
                             <textarea 
                               value={currentSyllabus.obj} 
                               onChange={e => handleUpdate('obj', e.target.value)}
                               className="w-full p-3 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8e44ad] min-h-[120px] print:hidden"
                               placeholder="List objectives..."
                             />
                          ) : null}
                           {(!isEditable || currentSyllabus.obj) && (
                              <p className={`text-slate-700 leading-relaxed whitespace-pre-wrap ${isEditable ? 'hidden print:block' : ''}`}>{currentSyllabus.obj || '-'}</p>
                          )}
                      </section>
                      <section>
                          <h4 className="text-sm font-bold text-[#8e44ad] uppercase tracking-wider mb-2 border-b border-purple-100 pb-1">Learning Outcomes</h4>
                          {isEditable ? (
                             <textarea 
                               value={currentSyllabus.out} 
                               onChange={e => handleUpdate('out', e.target.value)}
                               className="w-full p-3 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8e44ad] min-h-[120px] print:hidden"
                               placeholder="List outcomes..."
                             />
                          ) : null}
                          {(!isEditable || currentSyllabus.out) && (
                              <p className={`text-slate-700 leading-relaxed whitespace-pre-wrap ${isEditable ? 'hidden print:block' : ''}`}>{currentSyllabus.out || '-'}</p>
                          )}
                      </section>
                   </div>

                   <section>
                      <h4 className="text-sm font-bold text-[#8e44ad] uppercase tracking-wider mb-2 border-b border-purple-100 pb-1">Course Content / Outline</h4>
                      {isEditable ? (
                         <textarea 
                           value={currentSyllabus.content} 
                           onChange={e => handleUpdate('content', e.target.value)}
                           className="w-full p-3 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8e44ad] min-h-[200px] font-mono text-sm print:hidden"
                           placeholder="Week 1: Topic..."
                         />
                      ) : null}
                      {(!isEditable || currentSyllabus.content) && (
                          <pre className={`text-slate-700 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 p-4 rounded-lg print:bg-white print:p-0 ${isEditable ? 'hidden print:block' : ''}`}>{currentSyllabus.content || '-'}</pre>
                      )}
                   </section>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <section>
                          <h4 className="text-sm font-bold text-[#8e44ad] uppercase tracking-wider mb-2 border-b border-purple-100 pb-1">Teaching Strategies</h4>
                          {isEditable ? (
                             <textarea 
                               value={currentSyllabus.strat} 
                               onChange={e => handleUpdate('strat', e.target.value)}
                               className="w-full p-3 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8e44ad] min-h-[100px] print:hidden"
                             />
                          ) : null}
                          {(!isEditable || currentSyllabus.strat) && (
                               <p className={`text-slate-700 leading-relaxed whitespace-pre-wrap ${isEditable ? 'hidden print:block' : ''}`}>{currentSyllabus.strat || '-'}</p>
                          )}
                      </section>
                      <section>
                          <h4 className="text-sm font-bold text-[#8e44ad] uppercase tracking-wider mb-2 border-b border-purple-100 pb-1">Assessment</h4>
                          {isEditable ? (
                             <textarea 
                               value={currentSyllabus.assess} 
                               onChange={e => handleUpdate('assess', e.target.value)}
                               className="w-full p-3 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8e44ad] min-h-[100px] print:hidden"
                             />
                          ) : null}
                          {(!isEditable || currentSyllabus.assess) && (
                               <p className={`text-slate-700 leading-relaxed whitespace-pre-wrap ${isEditable ? 'hidden print:block' : ''}`}>{currentSyllabus.assess || '-'}</p>
                          )}
                      </section>
                   </div>

                   <section>
                      <h4 className="text-sm font-bold text-[#8e44ad] uppercase tracking-wider mb-2 border-b border-purple-100 pb-1">Resources</h4>
                      {isEditable ? (
                         <textarea 
                           value={currentSyllabus.res} 
                           onChange={e => handleUpdate('res', e.target.value)}
                           className="w-full p-3 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8e44ad] min-h-[80px] print:hidden"
                         />
                      ) : null}
                      {(!isEditable || currentSyllabus.res) && (
                          <p className={`text-slate-700 leading-relaxed whitespace-pre-wrap ${isEditable ? 'hidden print:block' : ''}`}>{currentSyllabus.res || '-'}</p>
                      )}
                   </section>
                </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-slate-200 text-slate-400">
           <BookOpen size={48} className="mb-4 opacity-20" />
           <p>Select a course to view or edit the syllabus.</p>
        </div>
      )}
    </div>
  );
};

export default SyllabusCreator;
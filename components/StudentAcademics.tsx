import React, { useState } from 'react';
import { Course, GradeEntry, Student, UserRole } from '../types';
import { GraduationCap, Award, CheckCircle, Printer, Mail, Edit2, Save } from 'lucide-react';

interface StudentAcademicsProps {
  studentId?: string; // If null, assume admin choosing
  students: Student[];
  courses: Course[];
  grades: GradeEntry[];
  role: UserRole;
  onUpdateStudent?: (student: Student) => void;
}

const StudentAcademics: React.FC<StudentAcademicsProps> = ({ studentId, students, courses, grades, role, onUpdateStudent }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(studentId || students[0]?.id || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Sync local notes state when student changes
  React.useEffect(() => {
    if (selectedStudent) {
      setNotes(selectedStudent.transcriptNotes || '');
    }
  }, [selectedStudentId, selectedStudent]);

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    if (!selectedStudent) return;
    alert(`Transcript emailed to ${selectedStudent.email} and administration.`);
  };

  const saveNotes = () => {
    if (selectedStudent && onUpdateStudent) {
      onUpdateStudent({ ...selectedStudent, transcriptNotes: notes });
      setIsEditingNotes(false);
    }
  };

  // Filter courses enrolled by this student
  const enrolledCourses = courses.filter(c => c.studentIds?.includes(selectedStudentId));
  
  // Calculate GPA
  const getPoints = (val?: string) => {
    if (!val) return 0;
    const n = parseFloat(val);
    if (!isNaN(n)) {
      if (n >= 90) return 4.0;
      if (n >= 80) return 3.0;
      if (n >= 70) return 2.0;
      if (n >= 60) return 1.0;
      return 0.0;
    }
    const v = val.trim().toUpperCase();
    if (v === 'A') return 4.0;
    if (v === 'B') return 3.0;
    if (v === 'C') return 2.0;
    if (v === 'D') return 1.0;
    return 0.0;
  };

  let totalPoints = 0;
  let totalCredits = 0;

  const transcriptData = enrolledCourses.map(course => {
    const gradeEntry = grades.find(g => g.cid === course.id && g.sid === selectedStudentId);
    const gradeVal = gradeEntry?.val || '-';
    const points = getPoints(gradeVal);
    const credits = course.credits || 0;
    
    if (gradeEntry && credits > 0) {
      totalPoints += (points * credits);
      totalCredits += credits;
    }

    return {
      code: course.code,
      title: course.name,
      credits,
      grade: gradeVal,
      points: points
    };
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  if (!selectedStudent) return <div>Please select a student.</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Admin Selector - Hidden on Print */}
      {role !== 'STUDENT' && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 print:hidden">
          <label className="font-semibold text-slate-700">Select Student:</label>
          <select 
            value={selectedStudentId} 
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-[#8e44ad] outline-none min-w-[300px]"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.lname}, {s.fname} ({s.prog})</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4 print:hidden">
           <h2 className="text-2xl font-bold text-[#4a235a] flex items-center">
             <GraduationCap className="mr-2 text-[#8e44ad]" />
             Academic Record
           </h2>
           <div className="flex gap-2">
             {role === 'ADMIN' && (
                <button 
                  onClick={handleEmail}
                  className="flex items-center space-x-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
                >
                  <Mail size={18} />
                  <span>Email</span>
                </button>
             )}
             <button 
               onClick={handlePrint}
               className="flex items-center space-x-2 bg-[#4a235a] text-white hover:bg-[#8e44ad] px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
             >
               <Printer size={18} />
               <span>Print Transcript</span>
             </button>
           </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-0">
           {/* Preview Header - Hidden on Print */}
           <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-6 justify-between print:hidden">
              <div className="flex items-center space-x-3">
                 <div className="p-2 bg-purple-100 text-[#8e44ad] rounded-lg"><Award size={24} /></div>
                 <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Cumulative GPA</p>
                    <p className="text-2xl font-bold text-slate-800">{gpa}</p>
                 </div>
              </div>
              <div className="flex items-center space-x-3">
                 <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><CheckCircle size={24} /></div>
                 <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Credits Earned</p>
                    <p className="text-2xl font-bold text-slate-800">{totalCredits}</p>
                 </div>
              </div>
           </div>

           {/* TRANSCRIPT PRINT AREA */}
           <div className="overflow-auto p-8 bg-white print:p-0 print:overflow-visible">
             <style type="text/css" media="print">
               {`
                 @page { size: A4; margin: 15mm; }
               `}
             </style>
             <div className="border-4 border-double border-[#8e44ad] p-8 min-h-[900px] relative text-black print:border-0 print:min-h-0">
                <div className="text-center border-b-4 border-double border-[#8e44ad] pb-6 mb-8">
                  <h1 className="text-3xl font-bold text-[#8e44ad] uppercase tracking-wider mb-2">C.R.Williams Performing Arts Academy</h1>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-widest">La Sagesse, St. David, Grenada</p>
                  <h2 className="text-2xl font-bold text-slate-800 mt-4 underline decoration-[#8e44ad]">OFFICIAL ACADEMIC TRANSCRIPT</h2>
                </div>

                <div className="flex justify-between mb-8 text-sm">
                  <div>
                    <p className="mb-1"><span className="font-bold text-[#4a235a] w-24 inline-block">Student:</span> {selectedStudent.fname} {selectedStudent.mname} {selectedStudent.lname}</p>
                    <p className="mb-1"><span className="font-bold text-[#4a235a] w-24 inline-block">ID:</span> {selectedStudent.id}</p>
                    <p><span className="font-bold text-[#4a235a] w-24 inline-block">DOB:</span> {selectedStudent.dob}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1"><span className="font-bold text-[#4a235a]">Program:</span> {selectedStudent.prog}</p>
                    <p className="mb-1"><span className="font-bold text-[#4a235a]">Date Issued:</span> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <table className="w-full border-collapse border border-[#8e44ad] mb-8">
                  <thead>
                    <tr className="bg-[#8e44ad] text-white print:text-black print:bg-slate-200">
                      <th className="border border-[#8e44ad] p-2 text-left">Code</th>
                      <th className="border border-[#8e44ad] p-2 text-left">Course Title</th>
                      <th className="border border-[#8e44ad] p-2 text-center">Credits</th>
                      <th className="border border-[#8e44ad] p-2 text-center">Grade</th>
                      <th className="border border-[#8e44ad] p-2 text-center">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcriptData.map((item, idx) => (
                      <tr key={idx} className="even:bg-purple-50 print:even:bg-slate-50">
                        <td className="border border-purple-200 p-2 font-mono text-sm border-slate-300">{item.code}</td>
                        <td className="border border-purple-200 p-2 font-medium border-slate-300">{item.title}</td>
                        <td className="border border-purple-200 p-2 text-center border-slate-300">{item.credits}</td>
                        <td className="border border-purple-200 p-2 text-center font-bold border-slate-300">{item.grade}</td>
                        <td className="border border-purple-200 p-2 text-center border-slate-300">{item.points}</td>
                      </tr>
                    ))}
                    {transcriptData.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center p-8 text-slate-400 italic border border-slate-300">No academic records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                <div className="mb-8">
                   <div className="flex justify-between items-end">
                      <div className="w-2/3 pr-8">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold uppercase text-[#4a235a] border-b border-slate-200 pb-1 block w-full">Transcript Notes</span>
                            {role === 'ADMIN' && (
                               <button 
                                 onClick={() => isEditingNotes ? saveNotes() : setIsEditingNotes(true)}
                                 className="ml-2 text-xs text-indigo-600 print:hidden flex items-center gap-1"
                               >
                                 {isEditingNotes ? <Save size={14}/> : <Edit2 size={14}/>} {isEditingNotes ? 'Save' : 'Edit'}
                               </button>
                            )}
                         </div>
                         {isEditingNotes ? (
                            <textarea 
                              className="w-full border rounded p-2 text-sm" 
                              rows={3} 
                              value={notes} 
                              onChange={(e) => setNotes(e.target.value)} 
                            />
                         ) : (
                            <p className="text-sm text-slate-700 italic min-h-[40px]">{notes || 'No additional notes.'}</p>
                         )}
                      </div>
                      <div className="text-right bg-purple-50 p-4 rounded-lg border border-purple-100 inline-block print:bg-white print:border-slate-300">
                         <div className="mb-1">
                            <span className="text-xs font-bold text-slate-500 uppercase mr-4">Total Credits:</span>
                            <span className="text-lg font-bold text-slate-800">{totalCredits}</span>
                         </div>
                         <div>
                            <span className="text-sm font-bold text-[#4a235a] uppercase mr-4">Cumulative GPA:</span>
                            <span className="text-3xl font-bold text-[#8e44ad]">{gpa}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="absolute bottom-16 left-8 right-8 flex justify-between print:relative print:bottom-auto print:mt-16">
                   <div className="w-5/12 text-center">
                      <div className="border-b border-black h-1 mb-2"></div>
                      <p className="text-xs font-bold uppercase text-slate-600">Principal Signature</p>
                   </div>
                   <div className="w-5/12 text-center">
                      <div className="border-b border-black h-1 mb-2"></div>
                      <p className="text-xs font-bold uppercase text-slate-600">Registrar Signature</p>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAcademics;
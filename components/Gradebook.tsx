import React, { useState } from 'react';
import { Course, Student, GradeEntry, UserRole } from '../types';
import { Search, Save, BookOpen, AlertCircle, CheckCircle, User, LayoutList } from 'lucide-react';

interface GradebookProps {
  role: UserRole;
  currentUserId?: string;
  courses: Course[];
  students: Student[];
  grades: GradeEntry[];
  setGrades: React.Dispatch<React.SetStateAction<GradeEntry[]>>;
}

const Gradebook: React.FC<GradebookProps> = ({ role, currentUserId, courses, students, grades, setGrades }) => {
  const [viewMode, setViewMode] = useState<'COURSE' | 'STUDENT'>('COURSE');
  
  // State for Course View
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Student View
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const isAdmin = role === 'ADMIN';

  // --- Helpers ---
  const getGradeValue = (cid: string, sid: string) => {
    const key = `${cid}-${sid}`;
    if (editValues[key] !== undefined) return editValues[key];
    const entry = grades.find(g => g.cid === cid && g.sid === sid);
    return entry?.val || '';
  };

  const handleInputChange = (cid: string, sid: string, val: string) => {
    setEditValues(prev => ({ ...prev, [`${cid}-${sid}`]: val }));
    setSavedStatus(prev => ({ ...prev, [`${cid}-${sid}`]: false }));
  };

  const saveGrade = (cid: string, sid: string) => {
    const newVal = editValues[`${cid}-${sid}`];
    let valueToSave = newVal;
    if (valueToSave === undefined) {
      const entry = grades.find(g => g.cid === cid && g.sid === sid);
      valueToSave = entry?.val || '';
    }

    setGrades(prev => {
      const filtered = prev.filter(g => !(g.cid === cid && g.sid === sid));
      return [...filtered, { cid, sid, val: valueToSave }];
    });

    setSavedStatus(prev => ({ ...prev, [`${cid}-${sid}`]: true }));
    setTimeout(() => {
      setSavedStatus(prev => ({ ...prev, [`${cid}-${sid}`]: false }));
    }, 2000);
  };

  // --- Views ---

  const renderCourseView = () => {
    const availableCourses = role === 'ADMIN' 
      ? courses 
      : courses.filter(c => c.teacherId === currentUserId);
    
    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    const enrolledStudentIds = selectedCourse?.studentIds || [];
    const enrolledStudents = students.filter(s => enrolledStudentIds.includes(s.id));
    const filteredStudents = enrolledStudents.filter(s => 
      s.fname.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.lname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course</label>
          <select 
            value={selectedCourseId}
            onChange={(e) => {
               setSelectedCourseId(e.target.value);
               setEditValues({});
               setSavedStatus({});
            }}
            className="w-full md:w-1/2 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="">-- Choose a Course --</option>
            {availableCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name} {role === 'ADMIN' && `(${course.instructor})`}
              </option>
            ))}
          </select>
        </div>

        {selectedCourseId ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search students..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="text-sm text-slate-500">
                  Showing {filteredStudents.length} enrolled students
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                  <tr>
                    <th className="px-6 py-4">Student ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Program</th>
                    <th className="px-6 py-4 w-48">Grade</th>
                    <th className="px-6 py-4 w-32 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => {
                      const isSaved = savedStatus[`${selectedCourseId}-${student.id}`];
                      return (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-500 font-mono text-xs">{student.id}</td>
                          <td className="px-6 py-4 font-medium text-slate-800">
                            {student.lname}, {student.fname}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-sm">
                            {student.prog}
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="text" 
                              placeholder="Score/Letter"
                              value={getGradeValue(selectedCourseId, student.id)}
                              onChange={(e) => handleInputChange(selectedCourseId, student.id, e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold text-slate-700"
                            />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => saveGrade(selectedCourseId, student.id)}
                              className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all
                                ${isSaved 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                            >
                               {isSaved ? <CheckCircle size={16} /> : <Save size={16} />}
                               <span className="text-sm font-medium">{isSaved ? 'Saved' : 'Save'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                     <tr>
                       <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          {enrolledStudents.length === 0 
                            ? "No students are enrolled in this course yet." 
                            : "No students match your search."}
                       </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
             <BookOpen size={48} className="mb-4 opacity-50" />
             <p className="text-lg font-medium">Please select a course to begin grading.</p>
          </div>
        )}
      </div>
    );
  };

  const renderStudentView = () => {
    // Only Admin should really see this full view across all courses
    if (!isAdmin) return <div className="p-4 text-red-500">Access Restricted</div>;

    const student = students.find(s => s.id === selectedStudentId);
    
    // Get all courses this student is enrolled in
    const studentCourses = selectedStudentId 
        ? courses.filter(c => c.studentIds?.includes(selectedStudentId))
        : [];

    return (
      <div className="space-y-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Student</label>
            <select 
              value={selectedStudentId}
              onChange={(e) => {
                 setSelectedStudentId(e.target.value);
                 setEditValues({});
                 setSavedStatus({});
              }}
              className="w-full md:w-1/2 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">-- Choose a Student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.lname}, {s.fname} ({s.prog})</option>
              ))}
            </select>
         </div>

         {selectedStudentId && student ? (
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center space-x-4">
                       <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                          {student.photoUrl ? (
                            <img src={student.photoUrl} alt="Student" className="w-full h-full object-cover" />
                          ) : (
                            <User size={32} className="text-slate-400" />
                          )}
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-slate-800">{student.fname} {student.lname}</h3>
                          <p className="text-slate-500">{student.prog}</p>
                          <div className="flex gap-4 mt-1 text-sm text-slate-500">
                             <span>ID: {student.id}</span>
                             <span>Status: {student.enrollmentStatus}</span>
                          </div>
                       </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
                      <tr>
                        <th className="px-6 py-4">Course Code</th>
                        <th className="px-6 py-4">Course Name</th>
                        <th className="px-6 py-4">Credits</th>
                        <th className="px-6 py-4 w-48">Grade</th>
                        <th className="px-6 py-4 w-32 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentCourses.map(course => {
                         const isSaved = savedStatus[`${course.id}-${student.id}`];
                         return (
                            <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-slate-500 font-mono text-sm">{course.code}</td>
                              <td className="px-6 py-4 font-medium text-slate-800">{course.name}</td>
                              <td className="px-6 py-4 text-slate-500">{course.credits}</td>
                              <td className="px-6 py-4">
                                <input 
                                  type="text" 
                                  placeholder="Score/Letter"
                                  value={getGradeValue(course.id, student.id)}
                                  onChange={(e) => handleInputChange(course.id, student.id, e.target.value)}
                                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold text-slate-700"
                                />
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => saveGrade(course.id, student.id)}
                                  className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all
                                    ${isSaved 
                                      ? 'bg-emerald-100 text-emerald-700' 
                                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    }`}
                                >
                                   {isSaved ? <CheckCircle size={16} /> : <Save size={16} />}
                                   <span className="text-sm font-medium">{isSaved ? 'Saved' : 'Save'}</span>
                                </button>
                              </td>
                            </tr>
                         );
                      })}
                      {studentCourses.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            Student is not enrolled in any courses.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
             </div>
         ) : (
            selectedStudentId && !student ? null : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                <User size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">Please select a student to view their academic record.</p>
              </div>
            )
         )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <BookOpen className="mr-2 text-indigo-600" />
            Gradebook Management
          </h2>
          <p className="text-slate-500 mt-1">Manage and update student grades.</p>
        </div>
        
        {isAdmin && (
           <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('COURSE')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'COURSE' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LayoutList size={16} />
                <span>By Course</span>
              </button>
              <button 
                onClick={() => setViewMode('STUDENT')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'STUDENT' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <User size={16} />
                <span>By Student</span>
              </button>
           </div>
        )}
      </div>

      {viewMode === 'COURSE' ? renderCourseView() : renderStudentView()}
    </div>
  );
};

export default Gradebook;
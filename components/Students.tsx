import React, { useState, useRef } from 'react';
import { Student, UserRole, Course, GradeEntry } from '../types';
import { Search, Filter, UserPlus, Save, X, Edit2, Trash2, MoreHorizontal, AlertTriangle, User, BookOpen, Clock, CheckCircle, GraduationCap, Camera } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';

interface StudentsProps {
  role: UserRole;
  courses: Course[];
  grades: GradeEntry[];
}

const Students: React.FC<StudentsProps> = ({ role, courses, grades }) => {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Student>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = role === 'ADMIN';

  const filteredStudents = students.filter(s => 
    s.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.prog.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEditing = (student: Student) => {
    setEditingId(student.id);
    setEditForm(student);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
    setIsAdding(false);
  };

  const saveStudent = () => {
    if (isAdding) {
      const newStudent: Student = {
        id: (Date.now()).toString(),
        fname: editForm.fname || '',
        mname: editForm.mname || '',
        lname: editForm.lname || '',
        dob: editForm.dob || '',
        gender: editForm.gender || 'FEMALE',
        prog: editForm.prog || 'Cape Performing Arts Drama',
        email: editForm.email || '',
        password: editForm.password || 'password',
        enrollmentStatus: 'Active',
        photoUrl: editForm.photoUrl,
        ...editForm
      } as Student;
      addStudent(newStudent);
      setIsAdding(false);
    } else if (editingId) {
      updateStudent({ ...editForm, id: editingId } as Student);
      setEditingId(null);
    }
    setEditForm({});
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteStudent(deleteId);
      setDeleteId(null);
    }
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId('new');
    setEditForm({
      fname: '',
      lname: '',
      mname: '',
      email: '',
      prog: 'Cape Performing Arts Drama',
      gender: 'FEMALE'
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getStudentCourses = (studentId: string) => {
      const enrolled = courses.filter(c => c.studentIds?.includes(studentId));
      const completed = enrolled.filter(c => grades.some(g => g.cid === c.id && g.sid === studentId && g.val));
      const inProgress = enrolled.filter(c => !grades.some(g => g.cid === c.id && g.sid === studentId && g.val));
      return { enrolled, completed, inProgress };
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#4a235a]">
          {role === 'TEACHER' ? 'Student Directory' : 'Student Directory'}
        </h2>
        {isAdmin && !isAdding && (
          <button 
            onClick={handleAddNew}
            className="flex items-center space-x-2 bg-[#8e44ad] hover:bg-[#4a235a] text-white px-4 py-2 rounded-lg transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <UserPlus size={18} />
            <span>Add Student</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8e44ad] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 text-slate-600 hover:text-[#8e44ad] px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors hidden sm:flex">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#8e44ad] text-white font-medium text-sm">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Name & Photo</th>
                <th className="px-6 py-4 whitespace-nowrap">Program</th>
                <th className="px-6 py-4 whitespace-nowrap hidden md:table-cell">Email</th>
                <th className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">Gender</th>
                <th className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">DOB</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isAdding && (
                 <tr className="bg-indigo-50/30">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div 
                                className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 border-2 border-slate-300"
                                onClick={() => fileInputRef.current?.click()}
                                title="Click to upload photo"
                            >
                                {editForm.photoUrl ? (
                                    <img src={editForm.photoUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={16} className="text-slate-500"/>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange}/>
                            <div className="flex flex-col">
                                <input placeholder="First" value={editForm.fname} onChange={e => setEditForm({...editForm, fname: e.target.value})} className="border rounded px-2 py-1 text-sm w-full mb-1" />
                                <input placeholder="Last" value={editForm.lname} onChange={e => setEditForm({...editForm, lname: e.target.value})} className="border rounded px-2 py-1 text-sm w-full" />
                            </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <input value={editForm.prog} onChange={e => setEditForm({...editForm, prog: e.target.value})} className="border rounded px-2 py-1 text-sm w-full" />
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                       <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="border rounded px-2 py-1 text-sm w-full" />
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                       <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value as any})} className="border rounded px-2 py-1 text-sm w-full">
                         <option value="FEMALE">Female</option>
                         <option value="MALE">Male</option>
                       </select>
                    </td>
                     <td className="px-6 py-4 hidden xl:table-cell">
                       <input type="date" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} className="border rounded px-2 py-1 text-sm w-full" />
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end space-x-2">
                        <button onClick={saveStudent} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded"><Save size={18} /></button>
                        <button onClick={cancelEditing} className="text-slate-400 hover:bg-slate-100 p-1 rounded"><X size={18} /></button>
                      </div>
                    </td>
                 </tr>
              )}
            
              {filteredStudents.map((student) => {
                const isEditing = editingId === student.id;
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                            <div 
                                className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 border-2 border-slate-300 shrink-0"
                                onClick={() => fileInputRef.current?.click()}
                                title="Click to change photo"
                            >
                                {editForm.photoUrl ? (
                                    <img src={editForm.photoUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={16} className="text-slate-500"/>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange}/>
                            <div className="flex flex-col gap-1 w-full">
                                <div className="flex gap-1">
                                    <input value={editForm.fname} onChange={e => setEditForm({...editForm, fname: e.target.value})} className="border rounded px-1 w-full text-sm" placeholder="First" />
                                    <input value={editForm.mname} onChange={e => setEditForm({...editForm, mname: e.target.value})} className="border rounded px-1 w-12 text-sm" placeholder="Mid" />
                                </div>
                                <input value={editForm.lname} onChange={e => setEditForm({...editForm, lname: e.target.value})} className="border rounded px-1 w-full text-sm" placeholder="Last" />
                            </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setViewingStudent(student)}
                          className="flex items-center gap-3 font-medium text-indigo-700 hover:text-indigo-900 hover:underline text-left group"
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                                {student.photoUrl ? (
                                    <img src={student.photoUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={14} className="text-slate-400"/>
                                )}
                          </div>
                          <span>{student.lname}, {student.fname} {student.mname}</span>
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">
                      {isEditing ? (
                        <input value={editForm.prog} onChange={e => setEditForm({...editForm, prog: e.target.value})} className="border rounded px-2 py-1 text-sm w-full" />
                      ) : (
                        <span className="truncate block max-w-[150px]" title={student.prog}>{student.prog}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm hidden md:table-cell">
                      {isEditing ? (
                        <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="border rounded px-2 py-1 text-sm w-full" />
                      ) : student.email}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm hidden lg:table-cell">
                      {isEditing ? (
                        <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value as any})} className="border rounded px-1 text-sm w-full">
                           <option value="FEMALE">Female</option>
                           <option value="MALE">Male</option>
                        </select>
                      ) : student.gender}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm hidden xl:table-cell">
                       {isEditing ? (
                          <input type="date" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} className="border rounded px-2 py-1 text-sm w-full" />
                        ) : student.dob}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        {isEditing ? (
                          <>
                            <button onClick={saveStudent} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded transition-colors" title="Save">
                              <Save size={18} />
                            </button>
                            <button onClick={cancelEditing} className="text-slate-400 hover:bg-slate-100 p-1 rounded transition-colors" title="Cancel">
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            {isAdmin && (
                              <>
                                <button onClick={() => startEditing(student)} className="text-slate-400 hover:text-[#8e44ad] hover:bg-purple-50 p-1 rounded transition-colors" title="Edit">
                                  <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDeleteClick(student.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors" title="Delete">
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                            {!isAdmin && (
                               <button onClick={() => setViewingStudent(student)} className="text-slate-400 hover:text-[#8e44ad] transition-colors">
                                  <MoreHorizontal size={20} />
                               </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
             <div className="relative h-32 bg-gradient-to-r from-[#8e44ad] to-[#4a235a] shrink-0">
                <button 
                  onClick={() => setViewingStudent(null)}
                  className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-colors"
                >
                   <X size={20} />
                </button>
             </div>
             
             <div className="px-8 pb-8 flex-1 overflow-y-auto">
                <div className="flex flex-col sm:flex-row items-start gap-6 -mt-12 mb-6">
                   <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 shadow-lg overflow-hidden shrink-0">
                      {viewingStudent.photoUrl ? (
                         <img src={viewingStudent.photoUrl} alt="Student" className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                            <User size={48} />
                         </div>
                      )}
                   </div>
                   <div className="pt-2 sm:pt-14">
                      <h2 className="text-2xl font-bold text-slate-800">{viewingStudent.fname} {viewingStudent.lname}</h2>
                      <p className="text-[#8e44ad] font-medium">{viewingStudent.prog}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide border-b pb-1">Personal Info</h4>
                      <div className="text-sm grid grid-cols-3 gap-2">
                         <span className="text-slate-500">ID:</span> <span className="col-span-2 font-medium">{viewingStudent.id}</span>
                         <span className="text-slate-500">Email:</span> <span className="col-span-2 font-medium truncate" title={viewingStudent.email}>{viewingStudent.email}</span>
                         <span className="text-slate-500">DOB:</span> <span className="col-span-2 font-medium">{viewingStudent.dob}</span>
                         <span className="text-slate-500">Gender:</span> <span className="col-span-2 font-medium capitalize">{viewingStudent.gender.toLowerCase()}</span>
                         <span className="text-slate-500">Status:</span> 
                         <span className="col-span-2">
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                             {viewingStudent.enrollmentStatus}
                           </span>
                         </span>
                      </div>
                   </div>

                   {/* Course History */}
                   <div className="space-y-3">
                       <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide border-b pb-1">Academic Status</h4>
                       {(() => {
                           const { inProgress, completed } = getStudentCourses(viewingStudent.id);
                           return (
                             <div className="space-y-4">
                                <div>
                                   <p className="text-xs font-bold text-slate-400 mb-2 flex items-center"><Clock size={12} className="mr-1"/> IN PROGRESS</p>
                                   {inProgress.length > 0 ? (
                                      <ul className="space-y-1">
                                         {inProgress.map(c => (
                                            <li key={c.id} className="text-sm bg-slate-50 p-2 rounded border border-slate-100 flex justify-between">
                                               <span className="font-medium text-slate-700">{c.code}</span>
                                               <span className="text-slate-500 truncate max-w-[120px]">{c.name}</span>
                                            </li>
                                         ))}
                                      </ul>
                                   ) : <p className="text-sm text-slate-400 italic">No active courses.</p>}
                                </div>
                                
                                <div>
                                   <p className="text-xs font-bold text-slate-400 mb-2 flex items-center"><CheckCircle size={12} className="mr-1"/> COMPLETED</p>
                                   {completed.length > 0 ? (
                                      <ul className="space-y-1">
                                         {completed.map(c => {
                                            const g = grades.find(x => x.cid === c.id && x.sid === viewingStudent.id);
                                            return (
                                              <li key={c.id} className="text-sm bg-green-50 p-2 rounded border border-green-100 flex justify-between">
                                                <span className="font-medium text-slate-700">{c.code}</span>
                                                <span className="font-bold text-green-700">{g?.val || '-'}</span>
                                              </li>
                                            );
                                         })}
                                      </ul>
                                   ) : <p className="text-sm text-slate-400 italic">No completed courses.</p>}
                                </div>
                             </div>
                           );
                       })()}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100 opacity-100">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Delete Student?</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to permanently delete this student record? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
import React, { useState } from 'react';
import { Course, UserRole, Student, Teacher } from '../types';
import { Clock, Users, MapPin, Edit2, Save, X, Plus, Trash2, UserPlus, Check, UserMinus } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';

interface CourseCardProps {
  course: Course;
  canEdit: boolean;
  onUpdate: (updated: Course) => void;
  onDelete: (id: string) => void;
  students: Student[];
  teachers: Teacher[];
}

const CourseCard: React.FC<CourseCardProps> = ({ course, canEdit, onUpdate, onDelete, students, teachers }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Course>(course);
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState<string>('');

  const percentFull = Math.round(((course.studentsRegistered || 0) / (course.capacity || 1)) * 100);

  const handleSave = () => {
    // If teacher changed, update instructor name
    const teacher = teachers.find(t => t.id === editForm.teacherId);
    const updatedCourse = {
        ...editForm,
        instructor: teacher ? teacher.name : editForm.instructor,
        studentsRegistered: (editForm.studentIds || []).length
    };
    onUpdate(updatedCourse);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(course);
    setIsEditing(false);
  };

  const addStudent = () => {
    if(!selectedStudentToAdd) return;
    const currentIds = editForm.studentIds || [];
    if(!currentIds.includes(selectedStudentToAdd)) {
        setEditForm({
            ...editForm,
            studentIds: [...currentIds, selectedStudentToAdd]
        });
    }
    setSelectedStudentToAdd('');
  };

  const removeStudent = (sid: string) => {
    const currentIds = editForm.studentIds || [];
    setEditForm({
        ...editForm,
        studentIds: currentIds.filter(id => id !== sid)
    });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow relative">
      {canEdit && !isEditing && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => setIsEditing(true)}
            className="text-slate-400 hover:text-indigo-600 bg-white p-1 rounded-full hover:bg-slate-100 transition-colors"
            title="Manage Course"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(course.id)}
            className="text-slate-400 hover:text-red-600 bg-white p-1 rounded-full hover:bg-slate-100 transition-colors"
            title="Delete Course"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
           <h3 className="font-bold text-slate-700 border-b pb-2">Edit Course Details</h3>
           <input 
             value={editForm.name} 
             onChange={e => setEditForm({...editForm, name: e.target.value})}
             className="w-full border rounded px-2 py-1 font-bold text-slate-800"
             placeholder="Course Title"
           />
           <div className="grid grid-cols-2 gap-2">
              <input 
                value={editForm.day} 
                onChange={e => setEditForm({...editForm, day: e.target.value})}
                className="border rounded px-2 py-1 text-sm"
                placeholder="Day"
              />
              <input 
                value={editForm.time} 
                onChange={e => setEditForm({...editForm, time: e.target.value})}
                className="border rounded px-2 py-1 text-sm"
                placeholder="Time"
              />
           </div>
           
           <div>
               <label className="text-xs font-bold text-slate-500 uppercase">Instructor</label>
               <select 
                  value={editForm.teacherId || ''} 
                  onChange={e => setEditForm({...editForm, teacherId: e.target.value})}
                  className="w-full border rounded px-2 py-1 text-sm"
               >
                   <option value="">-- Select Teacher --</option>
                   {teachers.map(t => (
                       <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>
                   ))}
               </select>
           </div>

           <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Capacity</label>
              <input 
                   type="number"
                   value={editForm.capacity} 
                   onChange={e => setEditForm({...editForm, capacity: parseInt(e.target.value)})}
                   className="w-full border rounded px-2 py-1 text-sm"
              />
           </div>

           <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
               <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Enrolled Students ({editForm.studentIds?.length || 0})</label>
               
               {/* Add Student Control */}
               <div className="flex gap-2 mb-3">
                   <select 
                      className="flex-1 text-sm border rounded px-2 py-1"
                      value={selectedStudentToAdd}
                      onChange={e => setSelectedStudentToAdd(e.target.value)}
                   >
                       <option value="">Select Student...</option>
                       {students
                         .filter(s => !editForm.studentIds?.includes(s.id))
                         .map(s => <option key={s.id} value={s.id}>{s.fname} {s.lname}</option>)
                       }
                   </select>
                   <button onClick={addStudent} className="bg-emerald-600 text-white px-2 rounded hover:bg-emerald-700" disabled={!selectedStudentToAdd}>
                       <Plus size={16} />
                   </button>
               </div>

               {/* Student List */}
               <div className="max-h-32 overflow-y-auto space-y-1">
                   {(editForm.studentIds || []).map(sid => {
                       const st = students.find(s => s.id === sid);
                       return (
                           <div key={sid} className="flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-200 text-xs">
                               <span>{st ? `${st.fname} ${st.lname}` : sid}</span>
                               <button onClick={() => removeStudent(sid)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                   <UserMinus size={12} />
                               </button>
                           </div>
                       );
                   })}
                   {(editForm.studentIds || []).length === 0 && <p className="text-xs text-slate-400 italic">No students enrolled.</p>}
               </div>
           </div>

           <div className="flex gap-2 pt-2">
             <button onClick={handleSave} className="flex-1 bg-emerald-600 text-white py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-emerald-700 font-medium">
               <Save size={14} /> Save Changes
             </button>
             <button onClick={handleCancel} className="flex-1 bg-slate-200 text-slate-600 py-2 rounded text-sm flex items-center justify-center gap-1 hover:bg-slate-300 font-medium">
               <X size={14} /> Cancel
             </button>
           </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-3 pr-20">
            <div>
              <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
                {course.day}
              </span>
              <h3 className="font-bold text-lg text-slate-800">{course.name}</h3>
              <p className="text-sm text-slate-500">Instructor: {course.instructor || 'TBD'}</p>
            </div>
          </div>
          
          <div className="space-y-3 mt-4">
            <div className="flex items-center text-sm text-slate-600">
              <Clock size={16} className="mr-2 text-slate-400" />
              {course.time}
            </div>
            <div className="flex items-center text-sm text-slate-600">
              <MapPin size={16} className="mr-2 text-slate-400" />
              Studio A
            </div>
            <div className="flex items-center text-sm text-slate-600">
              <Users size={16} className="mr-2 text-slate-400" />
              {course.studentsRegistered || (course.studentIds?.length || 0)} / {course.capacity} Students
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${percentFull >= 100 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                style={{ width: `${percentFull}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-slate-400">
              <span>{percentFull}% Full</span>
              <span>{(course.capacity || 0) - (course.studentsRegistered || 0)} spots left</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface ClassScheduleProps {
  role: UserRole;
  students: Student[];
  teachers: Teacher[];
}

const ClassSchedule: React.FC<ClassScheduleProps> = ({ role, students, teachers }) => {
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();
  
  // Admins can edit courses
  const canEdit = role === 'ADMIN';

  const handleUpdateCourse = (updated: Course) => {
    updateCourse(updated);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteCourse(id);
    }
  };

  const handleCreateCourse = () => {
     const newCourse: Course = {
       id: (Date.now()).toString(),
       name: 'New Course',
       instructor: 'TBD',
       teacherId: '',
       time: '12:00 - 13:00',
       day: 'Monday',
       studentsRegistered: 0,
       studentIds: [],
       capacity: 15
     };
     addCourse(newCourse);
  };

  const getTitle = () => {
    switch (role) {
      case 'TEACHER': return 'My Courses & Schedule';
      case 'STUDENT': return 'Course Catalog'; 
      default: return 'Master Schedule';
    }
  };

  // Filter courses for student/teacher views, but Admin sees all
  // Note: Student view usually only shows enrolled, but "Course Catalog" implies all available. 
  // Let's show all for now, maybe highlight enrolled ones.
  const displayCourses = courses;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{getTitle()}</h2>
        <div className="flex space-x-2 items-center">
          {canEdit && (
             <button 
               onClick={handleCreateCourse}
               className="mr-4 flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
             >
               <Plus size={16} />
               <span>New Course</span>
             </button>
          )}
          <div className="hidden md:flex space-x-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
              <button key={day} className="px-3 py-1 text-sm rounded-full border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors bg-white text-slate-600">
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCourses.map(course => (
          <CourseCard 
            key={course.id} 
            course={course} 
            canEdit={canEdit}
            onUpdate={handleUpdateCourse}
            onDelete={handleDeleteCourse}
            students={students}
            teachers={teachers}
          />
        ))}
      </div>
    </div>
  );
};

export default ClassSchedule;
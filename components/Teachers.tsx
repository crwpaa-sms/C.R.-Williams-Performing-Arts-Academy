import React, { useState, useRef } from 'react';
import { Teacher } from '../types';
import { Search, Plus, Edit2, Trash2, Save, X, Mail, AlertTriangle, User, Camera } from 'lucide-react';
import { useTeachers } from '../hooks/useTeachers';

interface TeachersProps {}

const Teachers: React.FC<TeachersProps> = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useTeachers();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Teacher>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.specialty && t.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const startEditing = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setEditForm(teacher);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId('new');
    setEditForm({ name: '', email: '', specialty: '', status: 'Active' });
  };

  const saveTeacher = () => {
    if (isAdding) {
      const newTeacher: Teacher = {
        id: (Date.now()).toString(),
        name: editForm.name || 'New Teacher',
        email: editForm.email || '',
        specialty: editForm.specialty || 'General',
        status: editForm.status || 'Active',
        photoUrl: editForm.photoUrl
      } as Teacher;
      addTeacher(newTeacher);
      setIsAdding(false);
    } else if (editingId) {
      updateTeacher({ ...editForm, id: editingId } as Teacher);
    }
    setEditingId(null);
    setEditForm({});
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTeacher(deleteId);
      setDeleteId(null);
    }
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

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Faculty Directory</h2>
        {!isAdding && (
          <button 
            onClick={handleAddNew}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add New Teacher</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
           <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search faculty..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
              <tr>
                <th className="px-6 py-4">Name & Photo</th>
                <th className="px-6 py-4">Specialty</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {isAdding && (
                 <tr className="bg-indigo-50/30">
                   <td className="px-6 py-4">
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
                          <input 
                            placeholder="Full Name"
                            value={editForm.name || ''} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                            className="border rounded px-2 py-1 text-sm w-full bg-white"
                            autoFocus
                          />
                      </div>
                   </td>
                   <td className="px-6 py-4">
                      <input 
                        placeholder="Discipline"
                        value={editForm.specialty || ''} 
                        onChange={e => setEditForm({...editForm, specialty: e.target.value})}
                        className="border rounded px-2 py-1 text-sm w-full bg-white"
                      />
                   </td>
                   <td className="px-6 py-4">
                      <input 
                        placeholder="Email Address"
                        value={editForm.email || ''} 
                        onChange={e => setEditForm({...editForm, email: e.target.value})}
                        className="border rounded px-2 py-1 text-sm w-full bg-white"
                      />
                   </td>
                   <td className="px-6 py-4">
                      <select 
                         value={editForm.status || 'Active'}
                         onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                         className="border rounded px-2 py-1 text-sm bg-white"
                       >
                         <option>Active</option>
                         <option>On Leave</option>
                       </select>
                   </td>
                   <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end space-x-2">
                        <button onClick={saveTeacher} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded transition-colors"><Save size={18} /></button>
                        <button onClick={cancelEditing} className="text-slate-400 hover:bg-slate-100 p-1 rounded transition-colors"><X size={18} /></button>
                      </div>
                   </td>
                 </tr>
               )}
               {filteredTeachers.map(teacher => {
                 const isEditing = editingId === teacher.id;
                 return (
                   <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-4 font-medium text-slate-800">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                             <div 
                                className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 border-2 border-slate-300 shrink-0"
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
                            <input 
                                value={editForm.name || ''} 
                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                                className="border rounded px-2 py-1 text-sm w-full"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                                    {teacher.photoUrl ? (
                                        <img src={teacher.photoUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={14} className="text-slate-400"/>
                                    )}
                              </div>
                              {teacher.name}
                          </div>
                        )}
                     </td>
                     <td className="px-6 py-4 text-slate-600">
                        {isEditing ? (
                          <input 
                            value={editForm.specialty || ''} 
                            onChange={e => setEditForm({...editForm, specialty: e.target.value})}
                            className="border rounded px-2 py-1 text-sm w-full"
                          />
                        ) : teacher.specialty}
                     </td>
                     <td className="px-6 py-4 text-slate-500 text-sm flex items-center">
                        {isEditing ? (
                           <input 
                             value={editForm.email || ''} 
                             onChange={e => setEditForm({...editForm, email: e.target.value})}
                             className="border rounded px-2 py-1 text-sm w-full"
                           />
                        ) : (
                          <>
                            <Mail size={14} className="mr-2 text-slate-400" />
                            {teacher.email}
                          </>
                        )}
                     </td>
                     <td className="px-6 py-4">
                        {isEditing ? (
                           <select 
                             value={editForm.status || ''}
                             onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                             className="border rounded px-2 py-1 text-sm"
                           >
                             <option>Active</option>
                             <option>On Leave</option>
                           </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            teacher.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {teacher.status}
                          </span>
                        )}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end space-x-2">
                         {isEditing ? (
                           <>
                             <button onClick={saveTeacher} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded transition-colors"><Save size={18} /></button>
                             <button onClick={cancelEditing} className="text-slate-400 hover:bg-slate-100 p-1 rounded transition-colors"><X size={18} /></button>
                           </>
                         ) : (
                           <>
                             <button onClick={() => startEditing(teacher)} className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1 rounded transition-colors"><Edit2 size={18} /></button>
                             <button onClick={() => handleDeleteClick(teacher.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={18} /></button>
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100 opacity-100">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                 <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Remove Teacher?</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to remove this teacher from the faculty directory?
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
                Remove Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
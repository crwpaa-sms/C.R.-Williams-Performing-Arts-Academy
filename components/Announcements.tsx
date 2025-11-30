import React, { useState, useRef } from 'react';
import { Announcement, UserRole } from '../types';
import { Megaphone, Plus, Edit2, Trash2, Save, Calendar, Image as ImageIcon } from 'lucide-react';

interface AnnouncementsProps {
  role: UserRole;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

const Announcements: React.FC<AnnouncementsProps> = ({ role, announcements, setAnnouncements }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Announcement>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = role === 'ADMIN';

  const displayAnnouncements = isAdmin 
    ? announcements 
    : announcements.filter(a => a.audience === 'ALL' || a.audience === role);

  const handleEdit = (announcement: Announcement) => {
    setCurrentId(announcement.id);
    setFormData(announcement);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentId(null);
    setFormData({
      title: '',
      content: '',
      audience: 'ALL',
      date: new Date().toISOString().split('T')[0]
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (currentId) {
      setAnnouncements(prev => prev.map(a => a.id === currentId ? { ...a, ...formData } as Announcement : a));
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: formData.title || 'Untitled',
        content: formData.content || '',
        audience: formData.audience || 'ALL',
        date: formData.date || new Date().toISOString().split('T')[0],
        author: 'Admin',
        imageUrl: formData.imageUrl
      } as Announcement;
      setAnnouncements([newAnnouncement, ...announcements]);
    }
    setIsEditing(false);
    setFormData({});
    setCurrentId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#4a235a] flex items-center">
          <Megaphone className="mr-2 text-[#8e44ad]" />
          Announcements
        </h2>
        {isAdmin && !isEditing && (
          <button 
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-[#8e44ad] text-white px-4 py-2 rounded-lg hover:bg-[#4a235a] transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Post Announcement</span>
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {isEditing && (
          <div className="bg-white p-6 rounded-xl shadow-md border-2 border-indigo-100">
            <h3 className="font-bold text-lg text-slate-800 mb-4">{currentId ? 'Edit Announcement' : 'New Announcement'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Title</label>
                <input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#8e44ad] outline-none"
                  placeholder="Announcement Title"
                />
              </div>
              
              <div>
                 <label className="block text-sm font-semibold text-slate-600 mb-1">Cover Image</label>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 text-sm flex items-center"
                    >
                       <ImageIcon size={16} className="mr-2" /> Upload Image
                    </button>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {formData.imageUrl && (
                       <span className="text-xs text-emerald-600 font-medium">Image Selected</span>
                    )}
                 </div>
                 {formData.imageUrl && (
                    <div className="mt-2 w-full h-32 bg-slate-50 rounded overflow-hidden relative">
                       <img src={formData.imageUrl} className="h-full w-auto object-cover" alt="Preview"/>
                       <button 
                         onClick={() => setFormData({...formData, imageUrl: undefined})}
                         className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                       >
                         <Trash2 size={12}/>
                       </button>
                    </div>
                 )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Content (Rich Text)</label>
                <textarea 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-[#8e44ad] outline-none h-40 font-sans"
                  placeholder="Write your announcement here..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-semibold text-slate-600 mb-1">Audience</label>
                   <select 
                     value={formData.audience}
                     onChange={e => setFormData({...formData, audience: e.target.value as any})}
                     className="w-full p-2 border rounded"
                   >
                     <option value="ALL">All Users</option>
                     <option value="STUDENT">Students Only</option>
                     <option value="TEACHER">Teachers Only</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-semibold text-slate-600 mb-1">Date</label>
                   <input 
                     type="date"
                     value={formData.date}
                     onChange={e => setFormData({...formData, date: e.target.value})}
                     className="w-full p-2 border rounded"
                   />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                >
                  <Save size={18} /> Save
                </button>
              </div>
            </div>
          </div>
        )}

        {displayAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
            <Megaphone size={48} className="mx-auto mb-4 opacity-20" />
            <p>No announcements to display.</p>
          </div>
        ) : (
          displayAnnouncements.map(ann => (
            <div key={ann.id} className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group overflow-hidden">
               {ann.imageUrl && (
                 <div className="w-full h-48 bg-slate-100">
                    <img src={ann.imageUrl} className="w-full h-full object-cover" alt="Announcement Cover" />
                 </div>
               )}
              <div className="p-6">
                 <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          ann.audience === 'ALL' ? 'bg-blue-100 text-blue-700' :
                          ann.audience === 'STUDENT' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {ann.audience}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center">
                          <Calendar size={12} className="mr-1" /> {ann.date}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{ann.title}</h3>
                      <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">{ann.content}</div>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                        <button 
                          onClick={() => handleEdit(ann)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(ann.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
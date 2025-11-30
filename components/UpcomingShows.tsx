import React, { useState, useRef } from 'react';
import { Show, UserRole } from '../types';
import { Calendar, MapPin, Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Sparkles } from 'lucide-react';

interface UpcomingShowsProps {
  role: UserRole;
  shows: Show[];
  setShows: React.Dispatch<React.SetStateAction<Show[]>>;
}

const UpcomingShows: React.FC<UpcomingShowsProps> = ({ role, shows, setShows }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Show>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = role === 'ADMIN';

  const handleEdit = (show: Show) => {
    setCurrentId(show.id);
    setFormData(show);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentId(null);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (currentId) {
      setShows(prev => prev.map(s => s.id === currentId ? { ...s, ...formData } as Show : s));
    } else {
      const newShow: Show = {
        id: Date.now().toString(),
        title: formData.title || 'Untitled Show',
        description: formData.description || '',
        date: formData.date || '',
        location: formData.location || 'TBD',
        imageUrl: formData.imageUrl
      };
      setShows([newShow, ...shows]);
    }
    setIsEditing(false);
    setFormData({});
    setCurrentId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this show?')) {
      setShows(prev => prev.filter(s => s.id !== id));
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
          <Sparkles className="mr-2 text-[#8e44ad]" />
          Upcoming Shows & Events
        </h2>
        {isAdmin && !isEditing && (
          <button 
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-[#8e44ad] text-white px-4 py-2 rounded-lg hover:bg-[#4a235a] transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add Event</span>
          </button>
        )}
      </div>

      {isEditing && (
         <div className="bg-white p-6 rounded-xl shadow-md border-2 border-indigo-100">
            <h3 className="font-bold text-lg text-slate-800 mb-4">{currentId ? 'Edit Event' : 'New Event'}</h3>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Event Title</label>
                  <input 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#8e44ad] outline-none"
                    placeholder="Show Title"
                  />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-semibold text-slate-600 mb-1">Date</label>
                     <input 
                       type="date" 
                       value={formData.date}
                       onChange={e => setFormData({...formData, date: e.target.value})}
                       className="w-full p-2 border rounded"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-slate-600 mb-1">Location</label>
                     <input 
                       value={formData.location}
                       onChange={e => setFormData({...formData, location: e.target.value})}
                       className="w-full p-2 border rounded"
                       placeholder="e.g. Main Auditorium"
                     />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Poster / Image</label>
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
                        <span className="text-xs text-emerald-600 font-medium flex items-center">
                           <ImageIcon size={14} className="mr-1"/> Image Selected
                        </span>
                     )}
                  </div>
                  {formData.imageUrl && (
                     <div className="mt-2 w-32 h-32 bg-slate-100 rounded overflow-hidden">
                        <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                     </div>
                  )}
               </div>

               <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Description (Rich Text)</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full p-4 border rounded focus:ring-2 focus:ring-[#8e44ad] outline-none h-48 font-serif"
                    placeholder="Write details about the show..."
                  />
               </div>

               <div className="flex justify-end space-x-2 pt-4">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center">
                     <Save size={18} className="mr-2"/> Save Event
                  </button>
               </div>
            </div>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {shows.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
               <Calendar size={48} className="mx-auto mb-4 opacity-20" />
               <p>No upcoming shows scheduled.</p>
            </div>
         ) : (
            shows.map(show => (
               <div key={show.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
                  <div className="h-48 bg-slate-200 relative overflow-hidden">
                     {show.imageUrl ? (
                        <img src={show.imageUrl} alt={show.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4a235a] to-[#8e44ad]">
                           <Sparkles className="text-white opacity-50" size={48} />
                        </div>
                     )}
                     <div className="absolute top-0 right-0 p-4">
                        <span className="bg-white/90 backdrop-blur text-[#4a235a] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                           UPCOMING
                        </span>
                     </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                     <div className="flex items-center text-xs text-slate-500 mb-2 gap-4">
                        <span className="flex items-center"><Calendar size={14} className="mr-1"/> {show.date}</span>
                        <span className="flex items-center"><MapPin size={14} className="mr-1"/> {show.location}</span>
                     </div>
                     <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#8e44ad] transition-colors">{show.title}</h3>
                     <p className="text-slate-600 text-sm line-clamp-3 mb-4 whitespace-pre-wrap flex-1">{show.description}</p>
                     
                     {isAdmin && (
                        <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-slate-100">
                           <button onClick={() => handleEdit(show)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                              <Edit2 size={18} />
                           </button>
                           <button onClick={() => handleDelete(show.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                              <Trash2 size={18} />
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
};

export default UpcomingShows;

import React, { useRef, useState } from 'react';
import { UserRole } from '../types';
import { Camera, User, Mail, Calendar, Hash, BookOpen, MapPin, Briefcase } from 'lucide-react';

interface ProfileProps {
  user: any;
  role: UserRole;
  onUpdateProfile: (updatedData: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, role, onUpdateProfile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onUpdateProfile({ ...user, photoUrl: result });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="relative mb-20">
        {/* Banner/Background */}
        <div className="h-48 bg-gradient-to-r from-[#8e44ad] to-[#4a235a] rounded-xl shadow-md"></div>
        
        {/* Profile Card Overlay */}
        <div className="absolute -bottom-16 left-8 flex items-end">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 shadow-lg overflow-hidden flex items-center justify-center">
              {user.photoUrl ? (
                <img 
                  src={user.photoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={64} className="text-slate-400" />
              )}
            </div>
            
            <button 
              onClick={handleCameraClick}
              disabled={isUploading}
              className="absolute bottom-1 right-1 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors border-2 border-white group-hover:scale-110"
              title="Upload Photo"
            >
              <Camera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="mb-4 ml-6 pb-2">
             <h1 className="text-3xl font-bold text-slate-800 drop-shadow-sm bg-white/50 backdrop-blur-sm px-2 rounded-lg inline-block">
               {user.fname} {user.lname} {user.name}
             </h1>
             <p className="text-slate-600 font-medium bg-white/50 backdrop-blur-sm px-2 rounded-lg inline-block mt-1">
               {role === 'STUDENT' ? user.prog : user.specialty || 'Staff'}
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
         {/* Details Column */}
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Personal Information</h3>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <div className="flex items-start space-x-3">
                     <div className="p-2 bg-purple-50 rounded-lg text-[#8e44ad]"><Hash size={20} /></div>
                     <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">System ID</p>
                        <p className="text-slate-800 font-medium">{user.id}</p>
                     </div>
                  </div>

                  <div className="flex items-start space-x-3">
                     <div className="p-2 bg-purple-50 rounded-lg text-[#8e44ad]"><Mail size={20} /></div>
                     <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Email Address</p>
                        <p className="text-slate-800 font-medium">{user.email}</p>
                     </div>
                  </div>

                  {user.dob && (
                    <div className="flex items-start space-x-3">
                       <div className="p-2 bg-purple-50 rounded-lg text-[#8e44ad]"><Calendar size={20} /></div>
                       <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Date of Birth</p>
                          <p className="text-slate-800 font-medium">{user.dob}</p>
                       </div>
                    </div>
                  )}

                  {user.gender && (
                    <div className="flex items-start space-x-3">
                       <div className="p-2 bg-purple-50 rounded-lg text-[#8e44ad]"><User size={20} /></div>
                       <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Gender</p>
                          <p className="text-slate-800 font-medium">{user.gender}</p>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Academic Profile</h3>
               <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start space-x-3">
                     <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><BookOpen size={20} /></div>
                     <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Program</p>
                        <p className="text-slate-800 font-medium">{user.prog || user.dept || 'N/A'}</p>
                     </div>
                  </div>
                  <div className="flex items-start space-x-3">
                     <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Briefcase size={20} /></div>
                     <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1
                           ${(user.enrollmentStatus === 'Active' || user.status === 'Active') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'}
                        `}>
                           {user.enrollmentStatus || user.status}
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Stats Column */}
         <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4">Account</h3>
               <div className="space-y-4">
                  <button 
                    onClick={handleCameraClick}
                    className="w-full flex items-center justify-center space-x-2 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                  >
                     <Camera size={18} />
                     <span>Change Photo</span>
                  </button>
                  
                  <div className="pt-4 border-t border-slate-100">
                     <p className="text-xs text-slate-500 mb-2">Need to update other details?</p>
                     <p className="text-sm text-slate-700">Please contact the administration office to update your personal information or program details.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
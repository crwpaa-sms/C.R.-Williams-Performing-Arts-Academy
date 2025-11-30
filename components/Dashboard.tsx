import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Users, BookOpen, Star, TrendingUp, GraduationCap, Clock, FileText, Award, Megaphone, Calendar, DollarSign } from 'lucide-react';
import { UserRole, Announcement, Payment, Show } from '../types';

const enrollmentData = [
  { name: 'Ballet', students: 45 },
  { name: 'Jazz', students: 30 },
  { name: 'Tap', students: 20 },
  { name: 'Acting', students: 55 },
  { name: 'Voice', students: 40 },
  { name: 'Contemporary', students: 25 },
];

const studentPerformanceData = [
  { month: 'Sep', grade: 85 },
  { month: 'Oct', grade: 88 },
  { month: 'Nov', grade: 87 },
  { month: 'Dec', grade: 92 },
  { month: 'Jan', grade: 90 },
];

const COLORS = ['#8e44ad', '#9b59b6', '#af7ac5', '#4a235a', '#5b2c6f', '#d2b4de'];

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

interface DashboardProps {
  role: UserRole;
  announcements: Announcement[];
  payments: Payment[];
  shows: Show[];
}

const Dashboard: React.FC<DashboardProps> = ({ role, announcements, payments, shows }) => {
  
  // Filter announcements relevant to the user
  const myAnnouncements = announcements.filter(a => a.audience === 'ALL' || a.audience === role).slice(0, 3);
  const nextShows = shows.slice(0, 3);
  
  // Calculate total revenue from paid payments
  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const renderAnnouncementsWidget = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <Megaphone size={20} className="mr-2 text-[#8e44ad]" />
        Latest Announcements
      </h3>
      <div className="space-y-4 flex-1 overflow-auto">
        {myAnnouncements.length > 0 ? (
           myAnnouncements.map(ann => (
             <div key={ann.id} className="p-4 bg-purple-50 rounded-lg border border-purple-100 relative overflow-hidden">
                <div className="flex justify-between items-start mb-1 relative z-10">
                   <h4 className="font-semibold text-purple-900 text-sm">{ann.title}</h4>
                   <span className="text-xs text-purple-400">{ann.date}</span>
                </div>
                <p className="text-xs text-purple-700 line-clamp-2 relative z-10">{ann.content}</p>
                {ann.imageUrl && (
                   <div className="absolute right-0 top-0 bottom-0 w-16 opacity-10">
                      <img src={ann.imageUrl} className="w-full h-full object-cover"/>
                   </div>
                )}
             </div>
           ))
        ) : (
          <p className="text-sm text-slate-500 italic">No recent announcements.</p>
        )}
      </div>
    </div>
  );

  const renderShowsWidget = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
       <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
         <Star size={20} className="mr-2 text-amber-500" />
         Upcoming Shows
       </h3>
       <div className="space-y-4">
          {nextShows.length > 0 ? (
             nextShows.map(show => (
               <div key={show.id} className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0">
                  <div className="w-12 h-16 bg-slate-200 rounded overflow-hidden shrink-0">
                     {show.imageUrl ? (
                        <img src={show.imageUrl} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-400">
                           <Calendar size={16}/>
                        </div>
                     )}
                  </div>
                  <div>
                     <h4 className="font-bold text-sm text-slate-800">{show.title}</h4>
                     <p className="text-xs text-slate-500 mb-1">{show.date} @ {show.location}</p>
                     <p className="text-xs text-slate-400 line-clamp-1">{show.description}</p>
                  </div>
               </div>
             ))
          ) : (
             <p className="text-sm text-slate-500 italic">No upcoming shows.</p>
          )}
       </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="24" icon={<Users size={24} />} color="bg-[#8e44ad]" />
        <StatCard title="Active Courses" value="2" icon={<BookOpen size={24} />} color="bg-emerald-500" />
        <StatCard title="Upcoming Shows" value={shows.length.toString()} icon={<Star size={24} />} color="bg-amber-500" />
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign size={24} />} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Enrollment by Discipline</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="students" fill="#8e44ad" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
           {renderAnnouncementsWidget()}
           {renderShowsWidget()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Student Age Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: '4-7 yrs', value: 30 },
                    { name: '8-12 yrs', value: 80 },
                    { name: '13-17 yrs', value: 65 },
                    { name: 'Adults', value: 40 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {enrollmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeacherDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Students" value="48" icon={<Users size={24} />} color="bg-[#8e44ad]" />
        <StatCard title="Courses Today" value="3" icon={<Clock size={24} />} color="bg-emerald-500" />
        <StatCard title="Pending Grading" value="12" icon={<FileText size={24} />} color="bg-amber-500" />
        <StatCard title="Avg Attendance" value="94%" icon={<TrendingUp size={24} />} color="bg-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Schedule</h3>
          <div className="space-y-4">
            {[
              { time: '09:00 AM', course: 'Advanced Ballet', room: 'Studio A' },
              { time: '11:30 AM', course: 'Jazz Fundamentals', room: 'Studio B' },
              { time: '02:00 PM', course: 'Private Coaching', room: 'Studio C' },
            ].map((item, i) => (
              <div key={i} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="w-16 text-sm font-bold text-[#8e44ad]">{item.time}</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{item.course}</div>
                  <div className="text-xs text-slate-500">{item.room}</div>
                </div>
                <button className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
           {renderAnnouncementsWidget()}
           {renderShowsWidget()}
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Current GPA" value="3.8" icon={<GraduationCap size={24} />} color="bg-[#8e44ad]" />
        <StatCard title="Credits Earned" value="24" icon={<Award size={24} />} color="bg-emerald-500" />
        <StatCard title="Attendance" value="98%" icon={<Clock size={24} />} color="bg-blue-500" />
        <StatCard title="Next Course" value="2:00 PM" icon={<BookOpen size={24} />} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">My Performance History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="grade" stroke="#8e44ad" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="space-y-6">
           {renderAnnouncementsWidget()}
           {renderShowsWidget()}
        </div>
      </div>
    </div>
  );

  switch (role) {
    case 'TEACHER': return renderTeacherDashboard();
    case 'STUDENT': return renderStudentDashboard();
    case 'ADMIN':
    default: return renderAdminDashboard();
  }
};

export default Dashboard;
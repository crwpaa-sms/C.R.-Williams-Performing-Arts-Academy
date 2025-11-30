import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Camera, 
  Menu,
  Bell,
  Search,
  LogOut,
  GraduationCap,
  BookOpen,
  ChevronDown,
  CreditCard,
  Briefcase,
  UserCircle,
  FileText,
  Megaphone,
  Sparkles
} from 'lucide-react';
import { NavItem, TabView, UserRole, Student, Teacher, Course, GradeEntry, Announcement, Payment, Show } from './types';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Teachers from './components/Teachers';
import ClassSchedule from './components/ClassSchedule';
import PhotoStudio from './components/PhotoStudio';
import SyllabusCreator from './components/SyllabusCreator';
import StudentAcademics from './components/StudentAcademics';
import Payments from './components/Payments';
import Gradebook from './components/Gradebook';
import Profile from './components/Profile';
import Announcements from './components/Announcements';
import UpcomingShows from './components/UpcomingShows';
import { INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_TEACHERS, INITIAL_PAYMENTS, INITIAL_SHOWS } from './data/mockData';

const App: React.FC = () => {
  // Global Data State
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [shows, setShows] = useState<Show[]>(INITIAL_SHOWS);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { 
      id: '1', 
      title: 'Spring Recital Auditions', 
      content: 'Auditions for the main roles will be held next Friday in Studio A. Please prepare a 2-minute monologue.', 
      date: '2024-03-10', 
      audience: 'ALL',
      author: 'Admin'
    },
    { 
      id: '2', 
      title: 'Facility Maintenance', 
      content: 'Studio B will be closed for floor maintenance on Wednesday afternoon.', 
      date: '2024-03-12', 
      audience: 'ALL',
      author: 'Admin'
    }
  ]);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('ADMIN');
  const [currentUser, setCurrentUser] = useState<any>(null); // Full user object
  const [loginForm, setLoginForm] = useState({ role: '', user: '', pass: '' });

  // UI State
  const [activeTab, setActiveTab] = useState<TabView>(TabView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- LOGIN LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const { role, user, pass } = loginForm;

    if (role === 'ADMIN' && user === 'admin' && pass === 'password') {
       setCurrentUserRole('ADMIN');
       setCurrentUser({ name: 'Administrator' });
       setIsAuthenticated(true);
       setActiveTab(TabView.DASHBOARD);
    } else if (role === 'TEACHER') {
       // Mock Teacher Login (using email)
       const teacher = teachers.find(t => t.email.toLowerCase() === user.toLowerCase());
       if (teacher && pass === 'password') {
          setCurrentUserRole('TEACHER');
          setCurrentUser(teacher);
          setIsAuthenticated(true);
          setActiveTab(TabView.DASHBOARD);
       } else {
          alert('Invalid Teacher Credentials. Use email from directory and password "password".');
       }
    } else if (role === 'STUDENT') {
       const student = students.find(s => s.email.toLowerCase() === user.toLowerCase());
       if (student && pass === student.password) {
          setCurrentUserRole('STUDENT');
          setCurrentUser(student);
          setIsAuthenticated(true);
          setActiveTab(TabView.DASHBOARD);
       } else {
          alert('Invalid Student Credentials. Use email from directory and password "password".');
       }
    } else {
       alert('Please select a valid role and enter credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginForm({ role: '', user: '', pass: '' });
  };

  const handleProfileUpdate = (updatedUser: any) => {
     setCurrentUser(updatedUser);
     if (currentUserRole === 'STUDENT') {
        setStudents(prev => prev.map(s => s.id === updatedUser.id ? updatedUser : s));
     } else if (currentUserRole === 'TEACHER') {
        setTeachers(prev => prev.map(t => t.id === updatedUser.id ? updatedUser : t));
     }
  };

  const updateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  // --- NAVIGATION ---
  const getNavItems = (role: UserRole): NavItem[] => {
    const common = [
      { id: TabView.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { id: TabView.UPCOMING_SHOWS, label: 'Events & Shows', icon: <Sparkles size={20} /> },
    ];

    switch (role) {
      case 'ADMIN':
        return [
          ...common,
          { id: TabView.ANNOUNCEMENTS, label: 'Announcements', icon: <Megaphone size={20} /> },
          { id: TabView.STUDENTS, label: 'Students', icon: <Users size={20} /> },
          { id: TabView.TEACHERS, label: 'Faculty', icon: <Briefcase size={20} /> },
          { id: TabView.COURSES, label: 'Courses', icon: <CalendarDays size={20} /> },
          { id: TabView.GRADES, label: 'Gradebook', icon: <FileText size={20} /> },
          { id: TabView.SYLLABUS, label: 'Syllabi', icon: <BookOpen size={20} /> },
          { id: TabView.ACADEMICS, label: 'Transcripts', icon: <GraduationCap size={20} /> },
          { id: TabView.PAYMENTS, label: 'Billing', icon: <CreditCard size={20} /> },
          { id: TabView.PHOTO_STUDIO, label: 'Photo Studio', icon: <Camera size={20} /> },
        ];
      case 'TEACHER':
        return [
          ...common,
          { id: TabView.STUDENTS, label: 'Students', icon: <Users size={20} /> },
          { id: TabView.COURSES, label: 'My Schedule', icon: <CalendarDays size={20} /> },
          { id: TabView.GRADES, label: 'Gradebook', icon: <FileText size={20} /> },
          { id: TabView.SYLLABUS, label: 'Syllabus', icon: <BookOpen size={20} /> },
          { id: TabView.PHOTO_STUDIO, label: 'Photo Studio', icon: <Camera size={20} /> },
        ];
      case 'STUDENT':
        return [
          ...common,
          { id: TabView.PROFILE, label: 'My Profile', icon: <UserCircle size={20} /> },
          { id: TabView.ACADEMICS, label: 'Transcript', icon: <GraduationCap size={20} /> },
          { id: TabView.SYLLABUS, label: 'My Syllabi', icon: <BookOpen size={20} /> },
          { id: TabView.PAYMENTS, label: 'Financials', icon: <CreditCard size={20} /> },
          { id: TabView.PHOTO_STUDIO, label: 'Photo Studio', icon: <Camera size={20} /> },
        ];
      default:
        return common;
    }
  };

  const currentNavItems = getNavItems(currentUserRole);

  const renderContent = () => {
    switch (activeTab) {
      case TabView.DASHBOARD:
        return <Dashboard role={currentUserRole} announcements={announcements} payments={payments} shows={shows} />;
      case TabView.ANNOUNCEMENTS:
        return <Announcements role={currentUserRole} announcements={announcements} setAnnouncements={setAnnouncements} />;
      case TabView.UPCOMING_SHOWS:
        return <UpcomingShows role={currentUserRole} shows={shows} setShows={setShows} />;
      case TabView.STUDENTS:
        return <Students role={currentUserRole} students={students} setStudents={setStudents} courses={courses} grades={grades} />;
      case TabView.TEACHERS:
        return <Teachers teachers={teachers} setTeachers={setTeachers} />;
      case TabView.COURSES:
        return <ClassSchedule role={currentUserRole} courses={courses} setCourses={setCourses} students={students} teachers={teachers} />;
      case TabView.PHOTO_STUDIO:
        return <PhotoStudio />;
      case TabView.SYLLABUS:
        return <SyllabusCreator courses={courses} setCourses={setCourses} role={currentUserRole} currentUserId={currentUser?.id} />;
      case TabView.ACADEMICS:
        return <StudentAcademics studentId={currentUserRole === 'STUDENT' ? currentUser.id : undefined} students={students} courses={courses} grades={grades} role={currentUserRole} onUpdateStudent={updateStudent} />;
      case TabView.GRADES:
        return <Gradebook role={currentUserRole} currentUserId={currentUser?.id} courses={courses} students={students} grades={grades} setGrades={setGrades} />;
      case TabView.PAYMENTS:
        return <Payments role={currentUserRole} payments={payments} setPayments={setPayments} />;
      case TabView.PROFILE:
        return <Profile user={currentUser} role={currentUserRole} onUpdateProfile={handleProfileUpdate} />;
      default:
        return <Dashboard role={currentUserRole} announcements={announcements} payments={payments} shows={shows} />;
    }
  };

  // --- LOGIN SCREEN RENDER ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4a235a] to-[#8e44ad] p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
           <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#4a235a] rounded-lg mx-auto flex items-center justify-center mb-4 shadow-lg transform rotate-3">
                 <span className="text-white font-bold text-2xl">CR</span>
              </div>
              <h2 className="text-2xl font-bold text-[#4a235a]">C.R.Williams Portal</h2>
              <p className="text-slate-500 text-sm">Performing Arts Academy</p>
           </div>
           
           <form onSubmit={handleLogin} className="space-y-4">
              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Select Role</label>
                 <select 
                   className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8e44ad] outline-none"
                   value={loginForm.role}
                   onChange={e => setLoginForm({...loginForm, role: e.target.value})}
                   required
                 >
                    <option value="" disabled>Choose your role...</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="STUDENT">Student</option>
                 </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Username / Email</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8e44ad] outline-none"
                  placeholder={loginForm.role === 'ADMIN' ? 'admin' : 'email@example.com'}
                  value={loginForm.user}
                  onChange={e => setLoginForm({...loginForm, user: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8e44ad] outline-none"
                  placeholder="••••••••"
                  value={loginForm.pass}
                  onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="w-full bg-[#8e44ad] hover:bg-[#4a235a] text-white font-bold py-3 rounded-lg transition-colors shadow-lg mt-2">
                 Login to Portal
              </button>
           </form>
           
           <div className="mt-6 p-4 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-100">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <p>Admin: admin / password</p>
              <p>Student: msrdharangit23@gmail.com / password</p>
              <p>Teacher: director@academy.com / password</p>
           </div>
        </div>
      </div>
    );
  }

  // --- APP RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#2c3e50] text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:shadow-xl
        print:hidden
      `}>
        <div className="h-20 flex items-center px-6 border-b border-slate-700 bg-[#4a235a]">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mr-3 shrink-0 backdrop-blur-sm">
             <span className="font-bold text-white text-lg">CR</span>
          </div>
          <div>
             <h1 className="font-bold text-white leading-tight">C.R.Williams</h1>
             <p className="text-xs text-purple-200">Performing Arts</p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="p-6 border-b border-slate-700 bg-[#34495e]">
           <div className="flex items-center space-x-3">
              <div className="bg-slate-200 text-[#4a235a] p-0.5 rounded-full overflow-hidden w-12 h-12 flex items-center justify-center shrink-0 border-2 border-slate-300">
                {currentUser?.photoUrl ? (
                   <img src={currentUser.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   <UserCircle size={36} className="text-[#4a235a]" />
                )}
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-bold text-white truncate w-full" title={currentUser?.fname ? `${currentUser.fname} ${currentUser.lname}` : currentUser?.name}>
                   {currentUser?.fname ? `${currentUser.fname} ${currentUser.lname}` : currentUser?.name}
                 </p>
                 <p className="text-xs text-slate-400 font-medium tracking-wide">{currentUserRole}</p>
              </div>
           </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {currentNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-white text-[#8e44ad] font-bold shadow-md' 
                  : 'text-slate-300 hover:bg-[#4a235a] hover:text-white'
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-300 hover:text-white hover:bg-red-500/20 w-full px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shadow-sm z-10 print:hidden">
          <div className="flex items-center">
            <button 
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden mr-4"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-[#4a235a]">
              {currentNavItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="pl-9 pr-4 py-2 rounded-full bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-[#8e44ad] focus:border-transparent text-sm w-64 transition-all"
               />
            </div>
            <button className="relative p-2 text-slate-500 hover:text-[#8e44ad] transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 bg-slate-50 scroll-smooth print:overflow-visible print:bg-white print:p-0">
          <div className="max-w-7xl mx-auto h-full print:w-full print:max-w-none">
             {renderContent()}
          </div>
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm print:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
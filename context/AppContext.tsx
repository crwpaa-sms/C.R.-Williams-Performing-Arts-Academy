import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  Student, 
  Teacher, 
  Course, 
  GradeEntry, 
  Announcement, 
  Payment, 
  Show, 
  UserRole 
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_TEACHERS, 
  INITIAL_COURSES, 
  INITIAL_PAYMENTS, 
  INITIAL_SHOWS 
} from '../data/mockData';

// Define the state interface
interface AppState {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  payments: Payment[];
  shows: Show[];
  grades: GradeEntry[];
  announcements: Announcement[];
  isAuthenticated: boolean;
  currentUserRole: UserRole;
  currentUser: any;
  loginForm: {
    role: string;
    user: string;
    pass: string;
  };
}

// Define actions
type AppAction = 
  | { type: 'SET_AUTH'; isAuthenticated: boolean; currentUserRole: UserRole; currentUser: any }
  | { type: 'SET_LOGIN_FORM'; loginForm: { role: string; user: string; pass: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_STUDENTS'; students: Student[] }
  | { type: 'UPDATE_TEACHERS'; teachers: Teacher[] }
  | { type: 'UPDATE_COURSES'; courses: Course[] }
  | { type: 'UPDATE_PAYMENTS'; payments: Payment[] }
  | { type: 'UPDATE_SHOWS'; shows: Show[] }
  | { type: 'UPDATE_GRADES'; grades: GradeEntry[] }
  | { type: 'UPDATE_ANNOUNCEMENTS'; announcements: Announcement[] }
  | { type: 'UPDATE_CURRENT_USER'; user: any }
  | { type: 'UPDATE_STUDENT'; student: Student };

// Initial state
const initialState: AppState = {
  students: INITIAL_STUDENTS,
  teachers: INITIAL_TEACHERS,
  courses: INITIAL_COURSES,
  payments: INITIAL_PAYMENTS,
  shows: INITIAL_SHOWS,
  grades: [],
  announcements: [
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
  ],
  isAuthenticated: false,
  currentUserRole: 'ADMIN',
  currentUser: null,
  loginForm: { role: '', user: '', pass: '' },
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        currentUserRole: action.currentUserRole,
        currentUser: action.currentUser,
      };
    case 'SET_LOGIN_FORM':
      return {
        ...state,
        loginForm: action.loginForm,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        currentUser: null,
        loginForm: { role: '', user: '', pass: '' },
      };
    case 'UPDATE_STUDENTS':
      return { ...state, students: action.students };
    case 'UPDATE_TEACHERS':
      return { ...state, teachers: action.teachers };
    case 'UPDATE_COURSES':
      return { ...state, courses: action.courses };
    case 'UPDATE_PAYMENTS':
      return { ...state, payments: action.payments };
    case 'UPDATE_SHOWS':
      return { ...state, shows: action.shows };
    case 'UPDATE_GRADES':
      return { ...state, grades: action.grades };
    case 'UPDATE_ANNOUNCEMENTS':
      return { ...state, announcements: action.announcements };
    case 'UPDATE_CURRENT_USER':
      return { ...state, currentUser: action.user };
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(s => 
          s.id === action.student.id ? action.student : s
        ),
      };
    default:
      return state;
  }
};

// Create context
interface AppContextType extends AppState {
  dispatch: React.Dispatch<AppAction>;
  handleLogin: (e: React.FormEvent) => void;
  handleLogout: () => void;
  handleProfileUpdate: (updatedUser: any) => void;
  updateStudent: (updated: Student) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const { role, user, pass } = state.loginForm;

    if (role === 'ADMIN' && user === 'admin' && pass === 'password') {
      dispatch({
        type: 'SET_AUTH',
        isAuthenticated: true,
        currentUserRole: 'ADMIN',
        currentUser: { name: 'Administrator' },
      });
    } else if (role === 'TEACHER') {
      const teacher = state.teachers.find(t => t.email.toLowerCase() === user.toLowerCase());
      if (teacher && pass === 'password') {
        dispatch({
          type: 'SET_AUTH',
          isAuthenticated: true,
          currentUserRole: 'TEACHER',
          currentUser: teacher,
        });
      } else {
        alert('Invalid Teacher Credentials. Use email from directory and password "password".');
      }
    } else if (role === 'STUDENT') {
      const student = state.students.find(s => s.email.toLowerCase() === user.toLowerCase());
      if (student && pass === student.password) {
        dispatch({
          type: 'SET_AUTH',
          isAuthenticated: true,
          currentUserRole: 'STUDENT',
          currentUser: student,
        });
      } else {
        alert('Invalid Student Credentials. Use email from directory and password "password".');
      }
    } else {
      alert('Please select a valid role and enter credentials.');
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const handleProfileUpdate = (updatedUser: any) => {
    dispatch({ type: 'UPDATE_CURRENT_USER', user: updatedUser });
    
    if (state.currentUserRole === 'STUDENT') {
      dispatch({ type: 'UPDATE_STUDENT', student: updatedUser });
    } else if (state.currentUserRole === 'TEACHER') {
      dispatch({
        type: 'UPDATE_TEACHERS',
        teachers: state.teachers.map(t => 
          t.id === updatedUser.id ? updatedUser : t
        ),
      });
    }
  };

  const updateStudent = (updated: Student) => {
    dispatch({ type: 'UPDATE_STUDENT', student: updated });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        dispatch,
        handleLogin,
        handleLogout,
        handleProfileUpdate,
        updateStudent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
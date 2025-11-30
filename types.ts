import React from 'react';

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface Student {
  id: string;
  email: string;
  fname: string;
  mname: string;
  lname: string;
  dob: string;
  gender: 'MALE' | 'FEMALE';
  prog: string;
  password?: string;
  enrollmentStatus: 'Active' | 'Inactive' | 'Pending';
  photoUrl?: string;
  gpa?: number; // Calculated dynamically usually, but kept for cache
  transcriptNotes?: string; // Admin notes for transcript
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  dept?: string;
  specialty?: string;
  status: 'Active' | 'On Leave';
  photoUrl?: string;
}

export interface Course {
  id: string;
  code?: string;
  name: string;
  credits?: number;
  teacherId?: string;
  studentIds?: string[]; // List of enrolled student IDs
  time?: string;
  day?: string;
  syllabus?: Syllabus;
  instructor?: string;
  capacity?: number;
  studentsRegistered?: number;
}

export interface GradeEntry {
  sid: string;
  cid: string;
  val: string; // Grade Letter or Score
  score?: number;
  semester?: string;
}

export interface Syllabus {
  desc: string;
  obj: string;
  out: string;
  content: string;
  strat: string;
  assess: string;
  res: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  method?: string;
  date: string;
  description: string;
  status: 'Pending' | 'Paid' | 'Overdue';
}

export interface FinancialRecord {
  sid: string;
  cost: number;
  payments: Payment[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  audience: 'ALL' | 'STUDENT' | 'TEACHER';
  author: string;
  imageUrl?: string;
}

export interface Show {
  id: string;
  title: string;
  date: string;
  description: string; // Rich text (HTML/Markdown simulated)
  location: string;
  imageUrl?: string; // Poster
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  STUDENTS = 'STUDENTS',
  TEACHERS = 'TEACHERS',
  COURSES = 'COURSES',
  PHOTO_STUDIO = 'PHOTO_STUDIO',
  SYLLABUS = 'SYLLABUS',
  ACADEMICS = 'ACADEMICS', // Grades & Transcript for students
  GRADES = 'GRADES', // For teachers
  PAYMENTS = 'PAYMENTS',
  PROFILE = 'PROFILE',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS',
  UPCOMING_SHOWS = 'UPCOMING_SHOWS'
}

export interface NavItem {
  id: TabView;
  label: string;
  icon: React.ReactNode;
}
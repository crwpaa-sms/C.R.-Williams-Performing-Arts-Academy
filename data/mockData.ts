import { Student, Teacher, Course, Payment, Show } from '../types';

export const INITIAL_STUDENTS: Student[] = [
    {id:"101", email:"msrdharangit23@gmail.com", fname:"Dexena", mname:"Tina", lname:"Dharangit", dob:"1998-09-23", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"102", email:"lilleennedd@gmail.com", fname:"Lilleen", mname:"J.Y.N", lname:"Nedd", dob:"1991-02-07", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"103", email:"tracy.fshsdacc@gmail.com", fname:"Tracy", mname:"Jenelle", lname:"Francois", dob:"1979-07-29", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"104", email:"roservfraser@gmail.com", fname:"Rose", mname:"Raquel", lname:"Fraser", dob:"1979-09-14", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"105", email:"selenanoel11@gmail.com", fname:"Selena", mname:"Kristie", lname:"Noel", dob:"2007-10-12", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"106", email:"yoggie758@gmail.com", fname:"Yoggie", mname:"Nichola", lname:"Brizan", dob:"1983-04-17", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"107", email:"milindad.work@gmail.com", fname:"Milinda", mname:"Dianne Deslyn", lname:"Mc Intosh", dob:"2003-11-25", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"108", email:"liscarale1@gmail.com", fname:"Lisa", mname:"Carona", lname:"Alexis", dob:"1987-01-07", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"109", email:"leisaalexander6@gmail.com", fname:"Leisa", mname:"Monica", lname:"Alexander-Francis", dob:"1971-10-29", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"110", email:"kysemef@gmail.com", fname:"Chad", mname:"Kyseme", lname:"Welsh", dob:"1999-07-17", gender:"MALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"111", email:"akrholuwork@gmail.com", fname:"Aklemia", mname:"Ronda", lname:"Lucas", dob:"1985-03-23", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"112", email:"rockeljosephjohn@gmail.com", fname:"Rockel", mname:"C.", lname:"Joseph John", dob:"1991-04-07", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"113", email:"nakrysprwilliams@gmail.com", fname:"Nakrys", mname:"Roger Peter", lname:"Williams", dob:"2010-02-16", gender:"MALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"114", email:"karisalexander6@gmail.com", fname:"Karisa", mname:"Kanilla and Sarah", lname:"Alexander", dob:"2015-04-20", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"115", email:"cassidyfarray102@gmail.com", fname:"Cassidy", mname:"Elizabeth Kimora", lname:"Farray", dob:"2009-04-02", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"116", email:"naethaniel.felix10@gmail.com", fname:"Naethaniel", mname:"Michael", lname:"Alexander Felix", dob:"2010-12-30", gender:"MALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"117", email:"roniquea8@gmail.com", fname:"Ronique", mname:"Adiesha Naomi Karina", lname:"Alexander", dob:"2013-03-19", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"118", email:"natanya.gidharry@placeholder.com", fname:"Natanya", mname:"Mackada Abigail", lname:"Gidharry", dob:"2013-11-25", gender:"FEMALE", prog:"Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"119", email: "sabra.rose27@gmail.com", fname: "Beth", mname: "Sabra Tracyanna", lname: "Frederick", dob: "2008-10-20", gender: "FEMALE", prog: "Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"120", email: "gisellealexander965@gmail.com", fname: "Giselle", mname: "Tarisha", lname: "Alexander", dob: "1996-01-02", gender: "FEMALE", prog: "Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"121", email: "sylvesterchris1988@gmail.com", fname: "Andre", mname: "Christopher", lname: "Sylvester", dob: "1988-10-31", gender: "MALE", prog: "Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"122", email: "esthermarrast247@gmail.com", fname: "Esther", mname: "Kamel", lname: "Marrast", dob: "2000-11-13", gender: "FEMALE", prog: "Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"123", email: "abrahamkazia05@gmail.com", fname: "Kazia", mname: "Akiva Danielle", lname: "Abraham", dob: "2005-06-19", gender: "FEMALE", prog: "Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'},
    {id:"124", email: "bbrathwa29@gmail.com", fname: "Brandon", mname: "Isaiah", lname: "Brathwaite", dob: "1997-12-29", gender: "MALE", prog: "Cape Performing Arts Drama", password:"password", enrollmentStatus: 'Active'}
];

export const INITIAL_TEACHERS: Teacher[] = [
    {id: "1", name: "Mrs. C.R. Williams", email: "director@academy.com", dept: "Drama", specialty: "Drama", status: "Active"},
    { id: '2', name: 'Mme. Dubois', email: 'dubois@crpa.edu', specialty: 'Ballet', status: 'Active' },
    { id: '3', name: 'Mr. Rogers', email: 'rogers@crpa.edu', specialty: 'Jazz', status: 'Active' },
    { id: '4', name: 'Sarah J.', email: 'sarahj@crpa.edu', specialty: 'Acting', status: 'Active' },
    { id: '5', name: 'Prof. Alighieri', email: 'dante@crpa.edu', specialty: 'Voice', status: 'On Leave' },
];

export const INITIAL_COURSES: Course[] = [
    {
        id: "1", 
        code: "DRAM101", 
        name: "Intro Acting", 
        credits: 3, 
        teacherId: "1", 
        studentIds: ["101", "102", "110", "124"],
        syllabus: {
            desc: "An introduction to the fundamental principles of acting.",
            obj: "To understand the basics of stage presence and voice projection.",
            out: "Students will be able to perform a 2-minute monologue.",
            content: "Week 1: Breath\nWeek 2: Movement\nWeek 3: Voice\nWeek 4: Text Analysis",
            strat: "Workshops, rehearsals, and peer review.",
            assess: "40% Practical, 60% Final Performance",
            res: "Acting Handbook Vol 1"
        }
    },
    {
        id: "2",
        code: "DRAM102",
        name: "Voice & Speech",
        credits: 3,
        teacherId: "1",
        studentIds: ["103", "104", "105"],
        syllabus: { desc: "", obj: "", out: "", content: "", strat: "", assess: "", res: "" }
    }
];

export const INITIAL_PAYMENTS: Payment[] = [
  { id: '1', studentId: '101', studentName: 'Dexena Dharangit', amount: 450.00, description: 'Fall Semester Tuition', date: '2024-09-01', status: 'Paid', method: 'Bank Transfer' },
  { id: '2', studentId: '102', studentName: 'Lilleen Nedd', amount: 450.00, description: 'Fall Semester Tuition', date: '2024-09-01', status: 'Pending', method: 'Credit Card' },
  { id: '3', studentId: '103', studentName: 'Tracy Francois', amount: 150.00, description: 'Uniform Fee', date: '2024-09-15', status: 'Overdue', method: 'Cash' },
];

export const INITIAL_SHOWS: Show[] = [
    {
        id: '1',
        title: 'Spring Showcase: Awakening',
        date: '2024-04-15',
        location: 'Main Auditorium',
        description: 'Join us for an evening of contemporary dance and drama featuring our senior students. This year\'s theme explores the concept of rebirth and new beginnings through movement and spoken word.',
    }
];

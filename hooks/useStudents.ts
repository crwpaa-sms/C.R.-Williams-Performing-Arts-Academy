import { useAppContext } from '../context/AppContext';
import { Student } from '../types';

export const useStudents = () => {
  const { students, dispatch } = useAppContext();

  const addStudent = (student: Student) => {
    dispatch({
      type: 'UPDATE_STUDENTS',
      students: [...students, student]
    });
  };

  const updateStudent = (updatedStudent: Student) => {
    dispatch({
      type: 'UPDATE_STUDENTS',
      students: students.map(s => s.id === updatedStudent.id ? updatedStudent : s)
    });
  };

  const deleteStudent = (id: string) => {
    dispatch({
      type: 'UPDATE_STUDENTS',
      students: students.filter(s => s.id !== id)
    });
  };

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById
  };
};
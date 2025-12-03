import { useAppContext } from '../context/AppContext';
import { Teacher } from '../types';

export const useTeachers = () => {
  const { teachers, dispatch } = useAppContext();

  const addTeacher = (teacher: Teacher) => {
    dispatch({
      type: 'UPDATE_TEACHERS',
      teachers: [...teachers, teacher]
    });
  };

  const updateTeacher = (updatedTeacher: Teacher) => {
    dispatch({
      type: 'UPDATE_TEACHERS',
      teachers: teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t)
    });
  };

  const deleteTeacher = (id: string) => {
    dispatch({
      type: 'UPDATE_TEACHERS',
      teachers: teachers.filter(t => t.id !== id)
    });
  };

  const getTeacherById = (id: string) => {
    return teachers.find(teacher => teacher.id === id);
  };

  return {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById
  };
};
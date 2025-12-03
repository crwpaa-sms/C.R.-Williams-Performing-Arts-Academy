import { useAppContext } from '../context/AppContext';
import { GradeEntry } from '../types';

export const useGrades = () => {
  const { grades, dispatch } = useAppContext();

  const addGrade = (grade: GradeEntry) => {
    dispatch({
      type: 'UPDATE_GRADES',
      grades: [...grades, grade]
    });
  };

  const updateGrade = (updatedGrade: GradeEntry) => {
    dispatch({
      type: 'UPDATE_GRADES',
      grades: grades.map(g => g.id === updatedGrade.id ? updatedGrade : g)
    });
  };

  const deleteGrade = (id: string) => {
    dispatch({
      type: 'UPDATE_GRADES',
      grades: grades.filter(g => g.id !== id)
    });
  };

  const getGradeById = (id: string) => {
    return grades.find(grade => grade.id === id);
  };

  const getGradesByStudentId = (studentId: string) => {
    return grades.filter(grade => grade.sid === studentId);
  };

  const getGradesByCourseId = (courseId: string) => {
    return grades.filter(grade => grade.cid === courseId);
  };

  return {
    grades,
    addGrade,
    updateGrade,
    deleteGrade,
    getGradeById,
    getGradesByStudentId,
    getGradesByCourseId
  };
};
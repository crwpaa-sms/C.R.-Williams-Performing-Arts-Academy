import { useAppContext } from '../context/AppContext';
import { Course } from '../types';

export const useCourses = () => {
  const { courses, dispatch } = useAppContext();

  const addCourse = (course: Course) => {
    dispatch({
      type: 'UPDATE_COURSES',
      courses: [...courses, course]
    });
  };

  const updateCourse = (updatedCourse: Course) => {
    dispatch({
      type: 'UPDATE_COURSES',
      courses: courses.map(c => c.id === updatedCourse.id ? updatedCourse : c)
    });
  };

  const deleteCourse = (id: string) => {
    dispatch({
      type: 'UPDATE_COURSES',
      courses: courses.filter(c => c.id !== id)
    });
  };

  const getCourseById = (id: string) => {
    return courses.find(course => course.id === id);
  };

  return {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById
  };
};
import { useAppContext } from '../context/AppContext';
import { Show } from '../types';

export const useShows = () => {
  const { shows, dispatch } = useAppContext();

  const addShow = (show: Show) => {
    dispatch({
      type: 'UPDATE_SHOWS',
      shows: [...shows, show]
    });
  };

  const updateShow = (updatedShow: Show) => {
    dispatch({
      type: 'UPDATE_SHOWS',
      shows: shows.map(s => s.id === updatedShow.id ? updatedShow : s)
    });
  };

  const deleteShow = (id: string) => {
    dispatch({
      type: 'UPDATE_SHOWS',
      shows: shows.filter(s => s.id !== id)
    });
  };

  const getShowById = (id: string) => {
    return shows.find(show => show.id === id);
  };

  return {
    shows,
    addShow,
    updateShow,
    deleteShow,
    getShowById
  };
};
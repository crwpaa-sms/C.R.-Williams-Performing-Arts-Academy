import { useAppContext } from '../context/AppContext';
import { Announcement } from '../types';

export const useAnnouncements = () => {
  const { announcements, dispatch } = useAppContext();

  const addAnnouncement = (announcement: Announcement) => {
    dispatch({
      type: 'UPDATE_ANNOUNCEMENTS',
      announcements: [...announcements, announcement]
    });
  };

  const updateAnnouncement = (updatedAnnouncement: Announcement) => {
    dispatch({
      type: 'UPDATE_ANNOUNCEMENTS',
      announcements: announcements.map(a => a.id === updatedAnnouncement.id ? updatedAnnouncement : a)
    });
  };

  const deleteAnnouncement = (id: string) => {
    dispatch({
      type: 'UPDATE_ANNOUNCEMENTS',
      announcements: announcements.filter(a => a.id !== id)
    });
  };

  const getAnnouncementById = (id: string) => {
    return announcements.find(announcement => announcement.id === id);
  };

  return {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getAnnouncementById
  };
};
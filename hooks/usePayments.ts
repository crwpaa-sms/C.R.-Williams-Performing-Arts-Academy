import { useAppContext } from '../context/AppContext';
import { Payment } from '../types';

export const usePayments = () => {
  const { payments, dispatch } = useAppContext();

  const addPayment = (payment: Payment) => {
    dispatch({
      type: 'UPDATE_PAYMENTS',
      payments: [...payments, payment]
    });
  };

  const updatePayment = (updatedPayment: Payment) => {
    dispatch({
      type: 'UPDATE_PAYMENTS',
      payments: payments.map(p => p.id === updatedPayment.id ? updatedPayment : p)
    });
  };

  const deletePayment = (id: string) => {
    dispatch({
      type: 'UPDATE_PAYMENTS',
      payments: payments.filter(p => p.id !== id)
    });
  };

  const getPaymentById = (id: string) => {
    return payments.find(payment => payment.id === id);
  };

  return {
    payments,
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentById
  };
};
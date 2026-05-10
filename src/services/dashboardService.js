import { apiGet } from '../api';

export const getDashboardStats = async () => {
  return await apiGet('/dashboard/stats');
};

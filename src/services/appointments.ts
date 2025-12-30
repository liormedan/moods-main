import apiClient from './api';

export interface Appointment {
  id: string;
  user_id: string;
  title: string;
  date: string;
  notes?: string;
  created_at?: string;
}

export interface AppointmentCreate {
  title: string;
  date: string; // ISO string format
  notes?: string;
}

export const appointmentsApi = {
  /**
   * Get all appointments for current user
   */
  getAll: async (): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>('/appointments/');
    return response.data;
  },

  /**
   * Create a new appointment
   */
  create: async (data: AppointmentCreate): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>('/appointments/', data);
    return response.data;
  },
};




import apiClient from './api';

export interface UserSettings {
  id: string;
  email: string;
  theme?: string;
  language?: string;
  notifications?: boolean;
  [key: string]: any;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relation?: string;
  created_at: string;
}

export interface EmergencyContactCreate {
  name: string;
  phone: string;
  relation?: string;
}

export interface TherapistInfo {
  user_id: string;
  name?: string;
  email?: string;
  phone?: string;
  updated_at?: string;
}

export interface TherapistInfoCreate {
  name?: string;
  email?: string;
  phone?: string;
}

export interface TherapistTask {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
}

export interface TherapistTaskCreate {
  title: string;
  is_completed?: boolean;
}

export const usersApi = {
  /**
   * Get user settings
   */
  getSettings: async (): Promise<UserSettings> => {
    const response = await apiClient.get<UserSettings>('/users/me/settings');
    return response.data;
  },

  /**
   * Update user settings
   */
  updateSettings: async (data: Partial<UserSettings>): Promise<UserSettings> => {
    const response = await apiClient.put<UserSettings>('/users/me/settings', data);
    return response.data;
  },

  /**
   * Get all emergency contacts
   */
  getContacts: async (): Promise<EmergencyContact[]> => {
    const response = await apiClient.get<EmergencyContact[]>('/users/me/contacts');
    return response.data;
  },

  /**
   * Create a new emergency contact
   */
  addContact: async (data: EmergencyContactCreate): Promise<EmergencyContact> => {
    const response = await apiClient.post<EmergencyContact>('/users/me/contacts', data);
    return response.data;
  },

  /**
   * Delete an emergency contact
   */
  deleteContact: async (id: string): Promise<{ msg: string }> => {
    const response = await apiClient.delete<{ msg: string }>(`/users/me/contacts/${id}`);
    return response.data;
  },

  /**
   * Get therapist info
   */
  getTherapistInfo: async (): Promise<TherapistInfo> => {
    const response = await apiClient.get<TherapistInfo>('/users/me/therapist/info');
    return response.data;
  },

  /**
   * Update therapist info
   */
  updateTherapistInfo: async (data: TherapistInfoCreate): Promise<TherapistInfo> => {
    const response = await apiClient.put<TherapistInfo>('/users/me/therapist/info', data);
    return response.data;
  },

  /**
   * Get all therapist tasks
   */
  getTherapistTasks: async (): Promise<TherapistTask[]> => {
    const response = await apiClient.get<TherapistTask[]>('/users/me/therapist/tasks');
    return response.data;
  },

  /**
   * Create a new therapist task
   */
  addTask: async (data: TherapistTaskCreate): Promise<TherapistTask> => {
    const response = await apiClient.post<TherapistTask>('/users/me/therapist/tasks', data);
    return response.data;
  },

  /**
   * Update a therapist task
   */
  updateTask: async (id: string, data: TherapistTaskCreate): Promise<TherapistTask> => {
    const response = await apiClient.put<TherapistTask>(`/users/me/therapist/tasks/${id}`, data);
    return response.data;
  },
};




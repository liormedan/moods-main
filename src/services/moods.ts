import apiClient from './api';

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_level: number;
  energy_level: number;
  stress_level: number;
  note: string | null;
  custom_metrics: any;
  created_at: string;
}

export interface MoodCreate {
  mood_level: number;
  energy_level: number;
  stress_level: number;
  note?: string;
  custom_metrics?: any;
}

export const moodsApi = {
  /**
   * Get all mood entries for current user
   */
  getAll: async (skip: number = 0, limit: number = 100): Promise<MoodEntry[]> => {
    const response = await apiClient.get<MoodEntry[]>('/moods/', {
      params: { skip, limit },
    });
    return response.data;
  },

  /**
   * Create a new mood entry
   */
  create: async (data: MoodCreate): Promise<MoodEntry> => {
    const response = await apiClient.post<MoodEntry>('/moods/', data);
    return response.data;
  },

  /**
   * Delete all mood entries for current user
   */
  deleteAll: async (): Promise<{ msg: string }> => {
    const response = await apiClient.delete<{ msg: string }>('/moods/');
    return response.data;
  },
};




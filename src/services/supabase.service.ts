import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Project, Profile } from '@/types/index';

export class SupabaseService {
  static isConfigured(): boolean {
    return isSupabaseConfigured();
  }

  static async fetchProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Project[];
  }

  static async saveProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const payload = {
      ...project,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await (supabase.from('projects') as any)
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  }

  static async updateProject(id: string, patch: Partial<Project>): Promise<Project> {
    const { data, error } = await (supabase.from('projects') as any)
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  }

  static async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  }

  static async fetchProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data as Profile;
  }

  static async updateProfile(id: string, patch: Partial<Profile>): Promise<Profile> {
    const { data, error } = await (supabase.from('profiles') as any)
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  }
}

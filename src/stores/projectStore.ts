import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Project, Profile } from '@/types/index';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface ProjectActions {
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setSelectedProject: (id: string | null) => void;
  fetchProjects: () => Promise<void>;
  saveProject: (
    project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => Promise<Project | null>;
  loadProject: (id: string) => Promise<Project | null>;
}

export interface ProfileActions {
  setProfile: (profile: Profile | null) => void;
  updateAccessibility: (settings: Partial<Profile['accessibility_settings']>) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

type ProjectStore = {
  projects: Project[];
  selectedProjectId: string | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
} & ProjectActions &
  ProfileActions;

const initialProfile: Profile | null = null;

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      selectedProjectId: null,
      profile: initialProfile,
      loading: false,
      error: null,

      setProjects: (projects) => set({ projects }),
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, patch) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),
      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          selectedProjectId:
            state.selectedProjectId === id ? null : state.selectedProjectId,
        })),
      setSelectedProject: (id) => set({ selectedProjectId: id }),

      fetchProjects: async () => {
        if (!isSupabaseConfigured()) {
          set({ error: 'Supabase no configurado' });
          return;
        }
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Usuario no autenticado');
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
          if (error) throw error;
          set({ projects: (data ?? []) as Project[], loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      saveProject: async (project) => {
        if (!isSupabaseConfigured()) {
          set({ error: 'Supabase no configurado' });
          return null;
        }
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Usuario no autenticado');
          const payload = {
            ...project,
            user_id: user.id,
            updated_at: new Date().toISOString(),
          };
          const { data, error } = await (supabase.from('projects') as any)
            .insert([payload])
            .select()
            .single();
          if (error) throw error;
          const saved = data as Project;
          set((state) => ({
            projects: [saved, ...state.projects],
            selectedProjectId: saved.id,
            loading: false,
          }));
          return saved;
        } catch (err: any) {
          set({ error: err.message, loading: false });
          return null;
        }
      },

      loadProject: async (id) => {
        if (!isSupabaseConfigured()) {
          set({ error: 'Supabase no configurado' });
          return null;
        }
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
          if (error) throw error;
          const project = data as Project;
          set({
            selectedProjectId: id,
            loading: false,
          });
          return project;
        } catch (err: any) {
          set({ error: err.message, loading: false });
          return null;
        }
      },

      setProfile: (profile) => set({ profile }),

      updateAccessibility: async (settings) => {
        const { profile } = get();
        if (!profile) return;
        if (!isSupabaseConfigured()) {
          set({ error: 'Supabase no configurado' });
          return;
        }
        try {
          const { data, error } = await (supabase.from('profiles') as any)
            .update({ accessibility_settings: { ...profile.accessibility_settings, ...settings }, updated_at: new Date().toISOString() })
            .eq('id', profile.id)
            .select()
            .single();
          if (error) throw error;
          set({ profile: data as Profile });
        } catch (err: any) {
          set({ error: err.message });
        }
      },

      fetchProfile: async () => {
        if (!isSupabaseConfigured()) return;
        set({ loading: true });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Usuario no autenticado');
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (error) throw error;
          set({ profile: data as Profile, loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
    }),
    {
      name: 'project-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projects: state.projects,
        selectedProjectId: state.selectedProjectId,
        profile: state.profile,
      }),
    },
  ),
);

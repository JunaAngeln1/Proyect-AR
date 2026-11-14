import { create } from 'zustand';
import type { AuthUser } from '@/types/index';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ loading: true, error: null });
    if (!isSupabaseConfigured()) {
      set({ error: 'Supabase no configurado', loading: false });
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.user) {
        set({
          user: { id: data.user.id, email: data.user.email ?? null },
          isAuthenticated: true,
          loading: false,
        });
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  signup: async (email, password) => {
    set({ loading: true, error: null });
    if (!isSupabaseConfigured()) {
      set({ error: 'Supabase no configurado', loading: false });
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        set({
          user: { id: data.user.id, email: data.user.email ?? null },
          isAuthenticated: true,
          loading: false,
        });
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    set({ user: null, isAuthenticated: false, loading: false, error: null });
  },

  resetPassword: async (email) => {
    set({ loading: true, error: null });
    if (!isSupabaseConfigured()) {
      set({ error: 'Supabase no configurado', loading: false });
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  initAuth: async () => {
    set({ loading: true });
    if (!isSupabaseConfigured()) {
      set({ loading: false });
      return;
    }
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        set({
          user: { id: session.user.id, email: session.user.email ?? null },
          isAuthenticated: true,
          loading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, loading: false });
      }
    });
    // sesión inicial
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      set({
        user: { id: data.session.user.id, email: data.session.user.email ?? null },
        isAuthenticated: true,
      });
    }
    set({ loading: false });
  },
}));

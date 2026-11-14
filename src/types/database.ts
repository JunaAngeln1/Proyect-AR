/**
 * Tipos de la base de datos Supabase (generados conceptualmente).
 * Ejecutar supabase/migrations/001_initial.sql en tu proyecto de Supabase.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          accessibility_settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          accessibility_settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          accessibility_settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          scene: Json;
          thumbnail_url: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          scene: Json;
          thumbnail_url?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          scene?: Json;
          thumbnail_url?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      models: {
        Row: {
          id: string;
          project_id: string | null;
          name: string;
          size: number;
          url: string;
          path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          name: string;
          size: number;
          url: string;
          path: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          name?: string;
          size?: number;
          url?: string;
          path?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

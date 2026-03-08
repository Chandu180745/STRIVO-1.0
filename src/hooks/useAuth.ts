import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  userId: string;
  avatarUrl?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  // Backward compat stubs
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  signupWithEmail: (name: string, email: string, password: string) => Promise<boolean>;
}

const fetchProfile = async (authUser: SupabaseUser): Promise<UserProfile | null> => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_id', authUser.id)
    .maybeSingle();

  if (data) {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      userId: data.user_code,
      avatarUrl: data.avatar_url || undefined,
    };
  }
  return null;
};

export const useAuth = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setTimeout(async () => {
          const profile = await fetchProfile(session.user);
          set({ user: profile, isAuthenticated: true, isLoading: false });
        }, 0);
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfile(session.user);
      set({ user: profile, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
  },

  loginWithApple: async () => {
    await lovable.auth.signInWithOAuth('apple', {
      redirect_uri: window.location.origin,
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  updateName: async (name) => {
    const user = get().user;
    if (!user) return;
    await supabase.from('profiles').update({ name }).eq('id', user.id);
    set({ user: { ...user, name } });
  },

  // Backward compat stubs
  login: async () => false,
  signup: async () => false,
  loginWithEmail: async () => false,
  signupWithEmail: async () => false,
}));

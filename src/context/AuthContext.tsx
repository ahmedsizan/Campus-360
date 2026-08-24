import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getResolvedAvatar, saveLocalAvatar } from '../lib/supabaseClient';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole,
    department: string, 
    idNo: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch or upsert user profile directly from/to Supabase
  const fetchProfile = async (authEmail: string, authUser?: User | null) => {
    try {
      const emailLower = authEmail.toLowerCase().trim();
      
      // 1. Query Supabase profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', emailLower)
        .maybeSingle();

      if (data && !error) {
        const resolvedAvatar = getResolvedAvatar(emailLower, data.avatar);
        const resolvedProfile: UserProfile = {
          ...data,
          avatar: resolvedAvatar,
        };
        setProfile(resolvedProfile);
        localStorage.setItem('gub_user', JSON.stringify(resolvedProfile));
        return;
      }

      // 2. Determine default role if not yet populated
      let role: UserRole = 'student';
      if (emailLower.includes('admin')) {
        role = 'admin';
      } else if (
        emailLower.includes('teacher') ||
        emailLower.includes('faculty') ||
        emailLower.includes('prof')
      ) {
        role = 'teacher';
      }

      const rawMeta = authUser?.user_metadata || {};
      const newProfile: UserProfile = {
        id: authUser?.id || `usr-${Date.now()}`,
        email: emailLower,
        name: rawMeta.name || emailLower.split('@')[0].replace(/[._-]/g, ' ').toUpperCase(),
        role: (rawMeta.role as UserRole) || role,
        department: rawMeta.department || 'Computer Science & Engineering',
        id_no: rawMeta.id_no || `GUB-22100${Math.floor(Math.random() * 800 + 100)}`,
        semester: 'Spring 2026',
        avatar: getResolvedAvatar(emailLower, rawMeta.avatar),
        bio: `${role === 'teacher' ? 'Faculty Member' : role === 'admin' ? 'Administrator' : 'Student'} at Green University of Bangladesh`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setProfile(newProfile);
      localStorage.setItem('gub_user', JSON.stringify(newProfile));

      // 3. Upsert to Supabase profiles table
      if (authUser?.id) {
        await supabase.from('profiles').upsert([newProfile]);
      }
    } catch (err) {
      console.error('Error syncing user profile from Supabase:', err);
    }
  };

  const refreshProfile = async () => {
    if (user?.email) {
      await fetchProfile(user.email, user);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user && mounted) {
          setUser(session.user);
          await fetchProfile(session.user.email || '', session.user);
        } else {
          // Clear any local cache if no active Supabase session
          if (mounted) {
            setUser(null);
            setProfile(null);
            localStorage.removeItem('gub_user');
          }
        }
      } catch (err) {
        console.error('Supabase Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Supabase Real-time Auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.email || '', session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('gub_user');
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Direct Supabase Auth Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const emailClean = email.toLowerCase().trim();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailClean,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.email || emailClean, data.user);
      }
      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  };

  // Direct Supabase Auth Sign Up
  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    department: string,
    idNo: string
  ) => {
    try {
      const emailClean = email.toLowerCase().trim();

      const { data, error } = await supabase.auth.signUp({
        email: emailClean,
        password,
        options: {
          data: {
            name,
            role,
            department,
            id_no: idNo,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          }
        }
      });

      if (error) return { error };

      if (data.user) {
        setUser(data.user);
        const newProf: UserProfile = {
          id: data.user.id,
          email: emailClean,
          name,
          role,
          department,
          id_no: idNo,
          semester: 'Spring 2026',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          bio: `${role === 'teacher' ? 'Faculty Member' : role === 'admin' ? 'Administrator' : 'Student'} at Green University of Bangladesh`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setProfile(newProf);
        localStorage.setItem('gub_user', JSON.stringify(newProf));

        // Insert row into Supabase profiles table
        await supabase.from('profiles').upsert([newProf]);
      }

      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  };

  // Direct Supabase Auth Sign Out
  const signOut = async () => {
    localStorage.removeItem('gub_user');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Update Profile on Supabase
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!profile) return { error: new Error('Not logged in') };

      const updated: UserProfile = {
        ...profile,
        ...data,
        updated_at: new Date().toISOString()
      };

      if (data.avatar && profile.email) {
        saveLocalAvatar(profile.email, data.avatar);
      }

      setProfile(updated);
      localStorage.setItem('gub_user', JSON.stringify(updated));

      // Direct write to Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert([updated]);

      if (error) {
        console.error('Supabase profile update error:', error);
        return { error };
      }

      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

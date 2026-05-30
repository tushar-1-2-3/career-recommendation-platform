import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { setStorageOwner } from '../lib/storage';

const AuthContext = createContext(null);

const toAppUser = (authUser) => {
  if (!authUser) return null;

  const metadata = authUser.user_metadata || {};
  const name = metadata.name || metadata.full_name || authUser.email?.split('@')[0] || 'Student';

  return {
    ...authUser,
    name,
    email: authUser.email,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const appUser = toAppUser(session?.user);
      setStorageOwner(appUser?.id);
      setUser(appUser);
      setInitializing(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const appUser = toAppUser(session?.user);
        setStorageOwner(appUser?.id);
        setUser(appUser);
        setInitializing(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (!data.user?.email_confirmed_at && !data.user?.confirmed_at) {
        await supabase.auth.signOut();
        setSession(null);
        setStorageOwner(null);
        setUser(null);
        throw new Error('Email not confirmed. Please verify your email before signing in.');
      }
      setStorageOwner(data.user.id);
      setSession(data.session);
      setUser(toAppUser(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name,
          },
        },
      });
      if (error) throw error;
      if (data.session) {
        await supabase.auth.signOut();
      }
      setSession(null);
      setStorageOwner(null);
      setUser(null);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setStorageOwner(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (fields) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: fields,
      });
      if (error) throw error;
      setUser(toAppUser(data.user));
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading: initializing,
    authLoading: loading,
    signIn,
    signUp,
    signOut,
    logout: signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

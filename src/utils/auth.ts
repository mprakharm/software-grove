
import { supabase } from './supabase';
import { toast } from '@/components/ui/use-toast';

export type AuthUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

// Sign up a new user
export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast({
      title: "Registration failed",
      description: errorMessage,
      variant: "destructive"
    });
    return { user: null, error: errorMessage };
  }
}

// Sign in an existing user
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      return { user: null, error: error.message };
    }

    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });
    
    return { user: data.user, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast({
      title: "Login failed",
      description: errorMessage,
      variant: "destructive"
    });
    return { user: null, error: errorMessage };
  }
}

// Sign out the current user
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
      return { error: error.message };
    }
    
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    
    return { error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast({
      title: "Sign out failed",
      description: errorMessage,
      variant: "destructive"
    });
    return { error: errorMessage };
  }
}

// Get the current user
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return { user: null, error: error.message };
    }
    
    if (!data?.user) {
      return { user: null, error: null };
    }
    
    return { user: data.user, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { user: null, error: errorMessage };
  }
}

// Create an auth context for the app
export function createAuthContext() {
  const contextValue = {
    user: null as AuthUser | null,
    loading: true,
    signIn,
    signUp,
    signOut,
  };
  
  return contextValue;
}

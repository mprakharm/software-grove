
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { AuthUser, signIn, signUp, signOut } from '@/utils/auth';
import { useToast } from '@/components/ui/use-toast';
import { SubscriptionAPI } from '@/utils/api';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  userSubscriptions: any[];
  subscriptionsLoading: boolean;
  subscriptions: any[]; // Add this as an alias for userSubscriptions
  signIn: (email: string, password: string) => Promise<{ user: any | null; error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ user: any | null; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  refreshSubscriptions: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userSubscriptions, setUserSubscriptions] = useState<any[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const { toast } = useToast();

  // Function to fetch user subscriptions
  const fetchUserSubscriptions = async (userId: string) => {
    if (!userId) return;
    
    setSubscriptionsLoading(true);
    try {
      const subscriptions = await SubscriptionAPI.getUserSubscriptions(userId);
      setUserSubscriptions(subscriptions || []);
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      toast({
        title: "Failed to load subscriptions",
        description: "Could not retrieve your subscription data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubscriptionsLoading(false);
    }
  };

  // Function to refresh subscriptions (can be called after adding a new subscription)
  const refreshSubscriptions = async () => {
    if (user?.id) {
      await fetchUserSubscriptions(user.id);
    }
  };

  useEffect(() => {
    // Check for user on initial load
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data && data.session?.user) {
          const { id, email } = data.session.user;
          setUser({ id, email: email || '' });
          
          // Fetch user subscriptions once we have the user ID
          fetchUserSubscriptions(id);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { id, email } = session.user;
          setUser({ id, email: email || '' });
          
          // Fetch user subscriptions when user signs in
          fetchUserSubscriptions(id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserSubscriptions([]);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userSubscriptions,
        subscriptions: userSubscriptions, // Add this alias for backward compatibility
        subscriptionsLoading,
        signIn,
        signUp,
        signOut,
        refreshSubscriptions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

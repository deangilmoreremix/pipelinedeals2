import { useEffect, useState, useRef } from 'react';
import { getSupabaseService } from '../services/supabaseService';
import { Contact } from '../types/contact';
import { Deal } from '../types';

export const useRealTimeContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    const supabase = getSupabaseService();

    // Initial load
    const loadContacts = async () => {
      try {
        setIsLoading(true);
        const data = await supabase.getContacts();
        setContacts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contacts');
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();

    // Real-time subscription with proper cleanup
    subscriptionRef.current = supabase.subscribeToContacts((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      setContacts(prev => {
        switch (eventType) {
          case 'INSERT':
            return [...prev, newRecord];
          case 'UPDATE':
            return prev.map(contact =>
              contact.id === newRecord.id ? newRecord : contact
            );
          case 'DELETE':
            return prev.filter(contact => contact.id !== oldRecord.id);
          default:
            return prev;
        }
      });
    });

    return () => {
      // Proper cleanup to prevent memory leaks
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []);

  return { contacts, isLoading, error };
};

export const useRealTimeDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    const supabase = getSupabaseService();

    // Initial load
    const loadDeals = async () => {
      try {
        setIsLoading(true);
        const data = await supabase.getDeals();
        setDeals(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deals');
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();

    // Real-time subscription with proper cleanup
    subscriptionRef.current = supabase.subscribeToDeals((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      setDeals(prev => {
        switch (eventType) {
          case 'INSERT':
            return [...prev, newRecord];
          case 'UPDATE':
            return prev.map(deal =>
              deal.id === newRecord.id ? newRecord : deal
            );
          case 'DELETE':
            return prev.filter(deal => deal.id !== oldRecord.id);
          default:
            return prev;
        }
      });
    });

    return () => {
      // Proper cleanup to prevent memory leaks
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []);

  return { deals, isLoading, error };
};

export const useActivityTracking = () => {
  const logActivity = async (activity: {
    type: string;
    entity_type: 'contact' | 'deal';
    entity_id: string;
    description: string;
    metadata?: any;
  }) => {
    try {
      const supabase = getSupabaseService();
      const user = await supabase.getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      await supabase.logActivity({
        ...activity,
        user_id: user.id,
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  return { logActivity };
};
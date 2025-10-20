import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Contact } from '../types';
import { Deal } from '../types';

interface Automation {
  id: string;
  name: string;
  description: string;
  type: 'drip' | 'event' | 'date' | 'ai';
  status: 'active' | 'paused' | 'completed' | 'draft';
  progress?: number;
  steps: {
    id: string;
    type: 'email' | 'call' | 'task' | 'ai' | 'delay';
    name: string;
    details: string;
    status: 'pending' | 'active' | 'completed' | 'failed';
    scheduledAt?: Date;
    completedAt?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  nextRun?: Date;
  dealId: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  dealId: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Communication {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  subject?: string;
  content: string;
  direction: 'inbound' | 'outbound';
  dealId: string;
  contactId?: string;
  createdAt: Date;
  createdBy: string;
}

interface Database {
  public: {
    Tables: {
      contacts: {
        Row: Contact;
        Insert: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Contact, 'id' | 'createdAt'>>;
      };
      deals: {
        Row: Deal;
        Insert: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Deal, 'id' | 'createdAt'>>;
      };
      automations: {
        Row: Automation;
        Insert: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Automation, 'id' | 'createdAt'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Task, 'id' | 'createdAt'>>;
      };
      communications: {
        Row: Communication;
        Insert: Omit<Communication, 'id' | 'createdAt'>;
        Update: Partial<Communication>;
      };
      activities: {
        Row: {
          id: string;
          type: string;
          entity_type: 'contact' | 'deal' | 'automation' | 'task';
          entity_id: string;
          description: string;
          metadata: any;
          created_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['activities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['activities']['Row']>;
      };
    };
  };
}

class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'];
    const supabaseAnonKey = import.meta.env['VITE_SUPABASE_ANON_KEY'];

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing. Please check your environment variables.');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  // Contact methods
  async getContacts(): Promise<Contact[]> {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    const { data, error } = await this.supabase
      .from('contacts')
      .insert({
        ...contact,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    const { data, error } = await this.supabase
      .from('contacts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteContact(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async searchContacts(query: string): Promise<Contact[]> {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Deal methods
  async getDeals(): Promise<Deal[]> {
    const { data, error } = await this.supabase
      .from('deals')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createDeal(deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> {
    const { data, error } = await this.supabase
      .from('deals')
      .insert({
        ...deal,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
    const { data, error } = await this.supabase
      .from('deals')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteDeal(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Automation methods
  async getAutomations(dealId?: string): Promise<Automation[]> {
    let query = this.supabase
      .from('automations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (dealId) {
      query = query.eq('deal_id', dealId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createAutomation(automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Automation> {
    const { data, error } = await this.supabase
      .from('automations')
      .insert({
        ...automation,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateAutomation(id: string, updates: Partial<Automation>): Promise<Automation> {
    const { data, error } = await this.supabase
      .from('automations')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteAutomation(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('automations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Task methods
  async getTasks(dealId?: string): Promise<Task[]> {
    let query = this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (dealId) {
      query = query.eq('deal_id', dealId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const { data, error } = await this.supabase
      .from('tasks')
      .insert({
        ...task,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Communication methods
  async getCommunications(dealId?: string): Promise<Communication[]> {
    let query = this.supabase
      .from('communications')
      .select('*')
      .order('created_at', { ascending: false });

    if (dealId) {
      query = query.eq('deal_id', dealId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createCommunication(communication: Omit<Communication, 'id' | 'createdAt'>): Promise<Communication> {
    const { data, error } = await this.supabase
      .from('communications')
      .insert({
        ...communication,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Activity tracking
  async logActivity(activity: {
    type: string;
    entity_type: 'contact' | 'deal';
    entity_id: string;
    description: string;
    metadata?: any;
    user_id: string;
  }): Promise<void> {
    const { error } = await this.supabase
      .from('activities')
      .insert(activity);

    if (error) throw error;
  }

  async getActivities(entityType: 'contact' | 'deal', entityId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('activities')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Real-time subscriptions
  subscribeToContacts(callback: (payload: any) => void) {
    return this.supabase
      .channel('contacts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, callback)
      .subscribe();
  }

  subscribeToDeals(callback: (payload: any) => void) {
    return this.supabase
      .channel('deals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, callback)
      .subscribe();
  }

  subscribeToAutomations(dealId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`automations-${dealId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'automations',
        filter: `deal_id=eq.${dealId}`
      }, callback)
      .subscribe();
  }

  subscribeToTasks(dealId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`tasks-${dealId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `deal_id=eq.${dealId}`
      }, callback)
      .subscribe();
  }

  subscribeToCommunications(dealId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`communications-${dealId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'communications',
        filter: `deal_id=eq.${dealId}`
      }, callback)
      .subscribe();
  }

  // Authentication helpers
  async getCurrentUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }
}

// Singleton instance
let supabaseService: SupabaseService | null = null;

export const getSupabaseService = (): SupabaseService => {
  if (!supabaseService) {
    supabaseService = new SupabaseService();
  }
  return supabaseService;
};

export { SupabaseService };
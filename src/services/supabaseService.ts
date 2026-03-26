import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Contact } from '../types';
import { Deal } from '../types';

interface Automation {
  id: string;
  userId: string;
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
  userId: string;
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
  userId: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  subject?: string;
  content: string;
  direction: 'inbound' | 'outbound';
  dealId: string;
  contactId?: string;
  createdAt: Date;
  createdBy: string;
}

interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  timezone: string;
  dateFormat: string;
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserStorage {
  id: string;
  userId: string;
  fileName: string;
  filePath: string;
  fileType?: string;
  fileSize?: number;
  bucketId: string;
  entityType?: string;
  entityId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Database {
  public: {
    Tables: {
      contacts: {
        Row: Contact & { user_id: string };
        Insert: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> & { user_id?: string };
        Update: Partial<Omit<Contact, 'id' | 'createdAt'>>;
      };
      deals: {
        Row: Deal & { user_id: string };
        Insert: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> & { user_id?: string };
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
          user_id: string;
          type: string;
          entity_type: 'contact' | 'deal' | 'automation' | 'task';
          entity_id: string;
          description: string;
          metadata: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['activities']['Row']>;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: Omit<UserPreferences, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<UserPreferences, 'id' | 'createdAt'>>;
      };
      user_storage: {
        Row: UserStorage;
        Insert: Omit<UserStorage, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<UserStorage, 'id' | 'createdAt'>>;
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

  // ==================== AUTHENTICATION ====================

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  // ==================== CONTACTS ====================

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
    // Delete associated avatar from storage if exists
    const { data: contact } = await this.supabase
      .from('contacts')
      .select('avatar_url')
      .eq('id', id)
      .single();

    if (contact?.avatar_url) {
      const path = contact.avatar_url.split('/').pop();
      if (path) {
        await this.deleteFile('avatars', path);
      }
    }

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

  // ==================== DEALS ====================

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

  // ==================== AUTOMATIONS ====================

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

  async createAutomation(automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Automation> {
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

  // ==================== TASKS ====================

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

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Task> {
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

  // ==================== COMMUNICATIONS ====================

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

  async createCommunication(communication: Omit<Communication, 'id' | 'createdAt' | 'userId'>): Promise<Communication> {
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

  // ==================== ACTIVITIES ====================

  async logActivity(activity: {
    type: string;
    entity_type: 'contact' | 'deal';
    entity_id: string;
    description: string;
    metadata?: any;
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

  // ==================== USER PREFERENCES ====================

  async getUserPreferences(): Promise<UserPreferences | null> {
    const { data, error } = await this.supabase
      .from('user_preferences')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createUserPreferences(preferences: Omit<UserPreferences, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<UserPreferences> {
    const { data, error } = await this.supabase
      .from('user_preferences')
      .insert({
        ...preferences,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserPreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const { data, error } = await this.supabase
      .from('user_preferences')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ==================== FILE STORAGE ====================

  async uploadFile(bucket: 'avatars' | 'documents' | 'attachments' | 'exports', filePath: string, file: File): Promise<string> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const fullPath = `${user.id}/${filePath}`;
    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        upsert: true,
      });

    if (error) throw error;

    const { data: { publicUrl } } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath);

    return publicUrl;
  }

  async deleteFile(bucket: 'avatars' | 'documents' | 'attachments' | 'exports', filePath: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const fullPath = filePath.startsWith(user.id) ? filePath : `${user.id}/${filePath}`;
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([fullPath]);

    if (error) throw error;
  }

  async listFiles(bucket: 'avatars' | 'documents' | 'attachments' | 'exports', path?: string): Promise<any[]> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const prefix = path ? `${user.id}/${path}` : user.id;
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(prefix);

    if (error) throw error;
    return data || [];
  }

  async downloadFile(bucket: 'avatars' | 'documents' | 'attachments' | 'exports', filePath: string): Promise<Blob> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const fullPath = filePath.startsWith(user.id) ? filePath : `${user.id}/${filePath}`;
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(fullPath);

    if (error) throw error;
    return data;
  }

  // ==================== REAL-TIME SUBSCRIPTIONS ====================

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
export type { Automation, Task, Communication, UserPreferences, UserStorage };

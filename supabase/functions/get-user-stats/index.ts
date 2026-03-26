import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client with auth context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Get user's storage usage
    const { data: storageData, error: storageError } = await supabaseClient
      .from('user_storage')
      .select('file_size')
      .eq('user_id', user.id);

    if (storageError) throw storageError;

    const totalSize = storageData?.reduce((sum, file) => sum + (file.file_size || 0), 0) || 0;

    // Get user's record counts
    const [
      { count: contactsCount, error: contactsError },
      { count: dealsCount, error: dealsError },
      { count: automationsCount, error: automationsError },
      { count: tasksCount, error: tasksError },
    ] = await Promise.all([
      supabaseClient.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabaseClient.from('deals').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabaseClient.from('automations').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabaseClient.from('tasks').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);

    if (contactsError) throw contactsError;
    if (dealsError) throw dealsError;
    if (automationsError) throw automationsError;
    if (tasksError) throw tasksError;

    return new Response(JSON.stringify({
      data: {
        user_id: user.id,
        email: user.email,
        storage: {
          used_bytes: totalSize,
          used_mb: (totalSize / (1024 * 1024)).toFixed(2),
          file_count: storageData?.length || 0,
        },
        records: {
          contacts: contactsCount || 0,
          deals: dealsCount || 0,
          automations: automationsCount || 0,
          tasks: tasksCount || 0,
        },
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

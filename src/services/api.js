import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qaadwpjxprztwkxoyovd.supabase.co';
const supabaseKey = 'sb_publishable_S_0ktujPc8viYOn1X15dqA_6YVK7t7h'; 

export const supabase = createClient(supabaseUrl, supabaseKey);

const api = {
  get: async (path) => {
    console.warn("api.get is deprecated, use supabase directly");
    return { data: [] };
  },
  post: async (path, data) => {
    console.warn("api.post is deprecated, use supabase directly");
    return { data: {} };
  }
};

export default api;

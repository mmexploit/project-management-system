import { supabase } from "@/utils/supabase/admin-client";

export async function getUsers() {
  const { data, error } = await supabase.auth.admin.listUsers();
  return { data, error };
}

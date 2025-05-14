import { supabase } from "@/services/supabaseClient";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
}

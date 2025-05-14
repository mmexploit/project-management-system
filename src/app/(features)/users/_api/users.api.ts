import { supabase } from "@/utils/supabase/admin-client";
import { SignUpWithPasswordCredentials, User } from "@supabase/supabase-js";

export async function getUsers(page: number, perPage: number) {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: page,
    perPage: perPage,
  });
  return { data, error };
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  return data;
}

export async function createUser(user: any) {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        full_name: user.name,
        role: user.role,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  return data;
}

export async function updateUser(userId: string, user: Partial<any>) {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    email: user.email,
    password: user.password,
    user_metadata: { full_name: user.name, role: user.role },
  });
  return data;
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.from("users").delete().eq("id", userId);
  return error;
}

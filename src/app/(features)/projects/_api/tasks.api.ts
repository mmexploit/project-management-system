import { Task } from "@/models/task.model";
import { supabase } from "@/services/supabaseClient";

export async function getTasks(projectId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId);
  return { data, error };
}

export async function createTask(task: Partial<Task>) {
  const { data, error } = await supabase.from("tasks").insert(task).select();
  return { data, error };
}

export async function updateTask(task: any) {
  const { data, error } = await supabase
    .from("tasks")
    .update(task)
    .eq("id", task.id)
    .select();
  return { data, error };
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  return { error };
}

export async function getTaskById(taskId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId);
  return { data, error };
}

export async function updateTaskStatus(taskId: string, status: string) {
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId);
  return { error };
}

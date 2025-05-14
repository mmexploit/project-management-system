import { Project } from "@/models/project.model";
import { supabase } from "@/services/supabaseClient";

export default async function getProjects(
  skip: number,
  take: number,
  where: any[],
  sort: any[]
) {
  let query = supabase.from("projects").select("*", { count: "exact" });

  // Apply filters
  if (where.length > 0) {
    where.forEach((condition) => {
      if (Array.isArray(condition)) {
        condition.forEach((c) => {
          if (c.operator === "ilike") {
            query = query.ilike(c.field, `%${c.value}%`);
          }
        });
      }
    });
  }

  // Apply sorting
  if (sort.length > 0) {
    sort.forEach((s) => {
      query = query.order(s.field, { ascending: s.direction === "ASC" });
    });
  }

  // Apply pagination
  query = query.range(skip, skip + take - 1);

  const { data, error, count } = await query;

  return { data, error, count };
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

export async function createProject(project: Project) {
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select();

  return { data, error };
}

export async function updateProject(id: string, project: Project) {
  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", id)
    .select();

  return { data, error };
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);

  return { error };
}

"use client";
import { Entity } from "@/shared/entity/entity";
import { EntityConfigProps } from "@/shared/entity/model/entity.model";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const supabase = createClient();

  const config: EntityConfigProps<Project> = {
    title: "Recent projects",
    baseUrl: "projects",
    detailUrl: "projects/detail",
    primaryColumn: "name",
    columns: [
      {
        accessor: "name",
      },
      {
        accessor: "description",
      },
      {
        accessor: "created_at",
        title: "Created At",
        render: (record) => new Date(record.created_at).toLocaleDateString(),
      },
    ],
  };

  const fetchProjects = async (
    skip = 0,
    take = 10,
    where: any[] = [],
    sort: any[] = []
  ) => {
    try {
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

      if (error) throw error;

      setProjects(data || []);
      setTotal(count || 0);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleRequestChange = (params: any) => {
    fetchProjects(params.skip, params.take, params.where, params.sort);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;

      // Refresh the list
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Entity
      config={config}
      data={projects}
      total={total}
      onRequestChange={handleRequestChange}
      onDelete={handleDelete}
    />
  );
}

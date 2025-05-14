"use client";
import { Entity } from "@/shared/entity/entity";
import { EntityConfigProps } from "@/shared/entity/model/entity.model";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import getProjects, { deleteProject } from "./_api/project.api";
import { notifications } from "@mantine/notifications";

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function Projects() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [params, setParams] = useState({
    skip: 0,
    take: 10,
    where: [],
    sort: [],
  });
  const { data, error, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () =>
      getProjects(params.skip, params.take, params.where, params.sort),
  });

  const { mutate: deleteProjectHandler } = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      notifications.show({
        title: "Project deleted",
        message: "Project deleted successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      notifications.show({
        title: "Project deleted",
        message: "Project deleted successfully",
        color: "red",
      });
    },
  });

  const config: EntityConfigProps<Project> = {
    title: "Recent projects",
    baseUrl: "projects",
    detailUrl: "projects/detail",
    primaryColumn: "name",
    isFetching: isLoading,
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

  const handleRequestChange = (params: any) => {
    setParams(params);
  };

  return (
    <Entity
      config={config}
      data={data?.data ?? []}
      total={data?.count ?? 0}
      onRequestChange={handleRequestChange}
      onDelete={(id) => deleteProjectHandler(id)}
    />
  );
}

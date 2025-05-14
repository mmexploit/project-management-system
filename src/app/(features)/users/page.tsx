"use client";
import { Entity } from "@/shared/entity/entity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { getUsers, deleteUser } from "./_api/users.api";
import { User } from "@supabase/supabase-js";
import { EntityConfigProps } from "@/shared/entity/model/entity.model";

export default function Users() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState({
    skip: 0,
    take: 10,
    where: [],
    sort: [],
  });
  const { data, error, isLoading } = useQuery({
    queryKey: ["Users"],
    queryFn: () => getUsers(params.skip, params.take),
  });

  const { mutate: deleteUserHandler } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      notifications.show({
        title: "User deleted",
        message: "User deleted successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
    onError: () => {
      notifications.show({
        title: "User deleted",
        message: "User deleted successfully",
        color: "red",
      });
    },
  });

  const config: EntityConfigProps<User> = {
    title: "Recent Users",
    baseUrl: "users",
    detailUrl: "users",
    primaryColumn: "name",
    isFetching: isLoading,
    columns: [
      {
        accessor: "name",
        render: (record) => record?.user_metadata?.full_name,
      },
      {
        accessor: "email",
      },
      {
        accessor: "created_at",
        title: "Created At",
        render: (record) => new Date(record.created_at).toDateString(),
      },
    ],
  };

  const handleRequestChange = (params: any) => {
    setParams(params);
  };

  return (
    <Entity
      config={config}
      data={data?.data?.users ?? []}
      // total={data?.data ?? 0}
      onRequestChange={handleRequestChange}
      onDelete={(id) => deleteUserHandler(id)}
    />
  );
}

"use client";

import { Modal, Select, Stack, TextInput, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Task } from "@/models/task.model";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { notifications } from "@mantine/notifications";
import { supabase } from "@/utils/supabase/admin-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTask, getTaskById, updateTask } from "../_api/tasks.api";
import { getUsers } from "../_api/users.api";
const schema = z.object({
  name: z.string().min(1),
  assignee_id: z.string().min(1),
});

type TaskForm = z.infer<typeof schema>;

const defaultValues: TaskForm = {
  name: "",
  assignee_id: "",
};

export default function AddTask({
  addTask,
  selectedTask,
  close,
}: {
  addTask: (task: Task) => void;
  selectedTask?: string | null;
  close: () => void;
}) {
  const { data: task } = useQuery({
    queryKey: ["task", selectedTask],
    queryFn: () => getTaskById(selectedTask ?? ""),
    enabled: !!selectedTask,
    refetchOnMount: true,
  });
  const { mutateAsync: deleteTaskHandler } = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      notifications.show({
        title: "Task deleted",
        message: "Task deleted successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", selectedTask] });
      close();
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message ?? "Failed to delete task",
        color: "red",
      });
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(schema),
    values: selectedTask ? task?.data?.[0] : defaultValues,
  });
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
  const queryClient = useQueryClient();
  const { mutateAsync: updateTaskHandler, isPending: isUpdatingTask } =
    useMutation({
      mutationFn: (task: any) => updateTask(task),
      onSuccess: () => {
        notifications.show({
          title: "Task updated",
          message: "Task updated successfully",
          color: "green",
        });
        reset();
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        close();
      },
      onError: (error) => {
        notifications.show({
          title: "Error",
          message: error.message ?? "Failed to update task",
          color: "red",
        });
      },
    });

  const onSubmit = (data: TaskForm) => {
    if (selectedTask) {
      updateTaskHandler({
        id: selectedTask,
        name: data.name,
        assignee_id: data?.assignee_id,
      });
      close();
    } else {
      addTask({
        id: crypto.randomUUID(),
        name: data.name,
        assignee: {
          name:
            users?.data?.users?.find((user) => user.id == data.assignee_id)
              ?.email ?? "",
          assignee_id: data?.assignee_id,
        },
        status: "to-do",
      });
      reset();
    }
  };

  return (
    <Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label="Name"
            {...register("name")}
            error={errors?.name?.message}
          />
          <Controller
            name="assignee_id"
            control={control}
            render={({ field: { name, value, onChange } }) => (
              <Select
                name={name}
                label="Assignee"
                className="w-full"
                placeholder="Select Assignee"
                value={value}
                onChange={onChange}
                data={
                  users?.data?.users?.map((user) => ({
                    value: user.id ?? "",
                    label: user.email ?? "",
                  })) ?? []
                }
                error={errors?.name?.message}
              />
            )}
          />
          <Button type="submit">{selectedTask ? "Update" : "Add"}</Button>
          <Button
            onClick={() => deleteTaskHandler(selectedTask ?? "")}
            color="red"
          >
            Delete
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

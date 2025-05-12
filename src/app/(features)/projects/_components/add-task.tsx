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

const schema = z.object({
  name: z.string().min(1),
  assignee_id: z.string().min(1),
});

type TaskForm = z.infer<typeof schema>;

export default function AddTask({
  addTask,
}: {
  addTask: (task: Task) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(schema),
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error(error);
        notifications.show({
          title: "Error",
          message: error.message ?? "Failed to fetch users",
          color: "red",
        });
      } else {
        setUsers(data?.users ?? []);
      }
    };
    fetchUsers();
  }, []);

  const onSubmit = (data: TaskForm) => {
    addTask({
      id: crypto.randomUUID(),
      name: data.name,
      assignee: {
        name: users.find((user) => user.id == data.assignee_id)?.email,
        assignee_id: data?.assignee_id,
      },
    });
    close();
  };

  return (
    <Stack>
      <Button onClick={open}>Add Task</Button>
      <Modal opened={opened} onClose={close} title="Add Task">
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
                  data={users.map((user) => ({
                    value: user.id,
                    label: user.email,
                  }))}
                  error={errors?.name?.message}
                />
              )}
            />
            <Button type="submit">Add</Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}

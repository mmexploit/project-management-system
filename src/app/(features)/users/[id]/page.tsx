"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { createUser, getUserById, updateUser } from "../_api/users.api";
import { useParams } from "next/navigation";
import {
  Button,
  Flex,
  LoadingOverlay,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import Section from "@/shared/section/section.component";
import { IconArrowLeft } from "@tabler/icons-react";

const defaultValues = {
  name: "",
  email: "",
  password: "",
  role: "user" as "user" | "admin",
};

export default function UserDetail() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id?.toString() ?? ""),
    enabled: id !== "new",
  });

  const schema = z
    .object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().nullable().default(null).optional(),
      role: z.enum(["user", "admin"]),
    })
    .refine(
      (data) =>
        id !== "new" && (data.password !== null || data.password !== ""),
      {
        path: ["password"],
        message: "Password is required.",
      }
    );

  type UserForm = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm<UserForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (data?.user) {
      setValue("name", data.user.user_metadata.full_name ?? "");
      setValue("email", data.user.email ?? "");
      setValue("role", data.user.user_metadata.role ?? "user");
    }
  }, [data]);

  const { mutate: updateUserHandler, isPending: isUpdatingUser } = useMutation({
    mutationFn: (user: Partial<UserForm>) =>
      updateUser(id?.toString() ?? "", user),
    onSuccess: () => {
      reset(defaultValues);
      notifications.show({
        title: "User updated",
        message: "User updated successfully",
        color: "green",
      });
      router.push("/users");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
    onError: () => {
      notifications.show({
        title: "User update failed",
        message: "User update failed",
        color: "red",
      });
    },
  });

  const { mutate: createUserHandler, isPending: isCreatingUser } = useMutation({
    mutationFn: (user: UserForm) => createUser(user),
    onSuccess: () => {
      reset(defaultValues);
      notifications.show({
        title: "User created",
        message: "User created successfully",
        color: "green",
      });
      router.push("/users");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit = (data: UserForm) => {
    if (id === "new") {
      createUserHandler(data);
    } else {
      const { password, ...rest } = data;
      updateUserHandler(rest);
    }
  };

  return (
    <Stack>
      {
        <Flex className="items-center justify-between">
          <Text fz={"h3"} className="font-semibold">
            User Details
          </Text>
          <Button
            variant="outline"
            leftSection={<IconArrowLeft />}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Flex>
      }
      <Section title={id == "new" ? "Create User" : "Update User"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <LoadingOverlay visible={isLoading} />
          <Stack>
            <Flex className="w-3/4 gap-4">
              <TextInput
                label="Name"
                placeholder="Name"
                className="w-1/2"
                {...register("name")}
                error={errors?.name?.message}
              />
              <TextInput
                label="Email"
                placeholder="Email"
                className="w-1/2"
                {...register("email")}
                error={errors?.email?.message}
              />
            </Flex>
            <Flex className="w-3/4 gap-4">
              <Controller
                name="role"
                control={control}
                render={({ field: { name, value, onChange } }) => (
                  <Select
                    name={name}
                    label="Role"
                    className="w-1/2"
                    withAsterisk
                    placeholder="Enter Role"
                    value={value}
                    onChange={onChange}
                    data={[
                      { label: "User", value: "user" },
                      { label: "Admin", value: "admin" },
                    ]}
                    error={errors?.role?.message}
                  />
                )}
              />
              {id !== "new" && (
                <PasswordInput
                  label="Password"
                  placeholder="Password"
                  className="w-1/2"
                  {...register("password")}
                  error={errors?.password?.message}
                />
              )}
            </Flex>
            <Button
              type="submit"
              loading={isUpdatingUser || isCreatingUser}
              className="ml-auto"
            >
              {id === "new" ? "Create" : "Update"}
            </Button>
          </Stack>
        </form>
      </Section>
    </Stack>
  );
}

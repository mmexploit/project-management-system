"use client";
import { createClient } from "@/utils/supabase/client";
import Section from "@/shared/section/section.component";
import {
  Flex,
  Button,
  Stack,
  Text,
  TextInput,
  LoadingOverlay,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { Project } from "@/models/project.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  getProjectById,
  updateProject,
} from "../_api/project.api";

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().default(null).optional(),
});

type ProjectFormSchema = z.infer<typeof projectSchema>;

export default function ProjectForm() {
  const { id } = useParams();
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id?.toString() ?? ""),
    enabled: id !== "new",
  });
  const { mutate: createProjectHandler, isPending: isLoading } = useMutation({
    mutationFn: (project: Project) =>
      id == "new"
        ? createProject(project)
        : updateProject(id?.toString() ?? "", project),
    onSuccess: (data: any) => {
      notifications.show({
        title: "Project created",
        message: "Project created successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      id == "new"
        ? router.push(`/projects/detail/${data?.data?.[0]?.id}`)
        : router.push(`/projects`);
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message ?? "Failed to create project",
        color: "red",
      });
    },
  });
  const { register, handleSubmit } = useForm<ProjectFormSchema>({
    resolver: zodResolver(projectSchema),
    values: id !== "new" ? project?.data : undefined,
  });

  const onSubmit = async (data: any) => {
    createProjectHandler(data);
  };

  return (
    <Stack>
      {
        <Flex className="items-center justify-between">
          <Text fz={"h3"} className="font-semibold">
            Project Details
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
      <Section title={id == "new" ? "Create Project" : "Update Project"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <LoadingOverlay visible={isProjectLoading} />
            <Flex className="gap-4 w-3/4">
              <TextInput
                label="Name"
                placeholder="Name"
                className="w-1/2"
                {...register("name")}
              />
              <TextInput
                label="Description"
                placeholder="Description"
                className="w-1/2"
                {...register("description")}
              />
            </Flex>
            <Button type="submit" className="ml-auto" loading={isLoading}>
              Submit
            </Button>
          </Stack>
        </form>
      </Section>
    </Stack>
  );
}

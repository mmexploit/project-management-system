"use client";
import { createClient } from "@/utils/supabase/client";
import Section from "@/shared/section/section.component";
import { Flex, Button, Stack, Text, TextInput } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { Project } from "@/models/project.model";

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

type ProjectFormSchema = z.infer<typeof projectSchema>;

export default function ProjectForm() {
  const { id } = useParams();
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<
    Project | { name: string; description: string }
  >({
    name: "",
    description: "",
  });
  const { register, handleSubmit } = useForm<ProjectFormSchema>({
    resolver: zodResolver(projectSchema),
    values: id !== "new" ? project : undefined,
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const { data: project, error } = await supabase
        .from("projects")
        .insert(data)
        .select();

      if (error) {
        throw error;
      } else {
        router.push(`/projects/detail/${project[0].id}`);
      }
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message ?? "Failed to create project",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id);

    if (error) {
      notifications.show({
        title: "Error",
        message: error.message ?? "Failed to fetch project",
        color: "red",
      });
    } else {
      setProject(data[0]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchProject();
    }
  }, [id]);

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

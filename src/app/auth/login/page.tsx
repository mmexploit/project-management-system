"use client";
import {
  Badge,
  Button,
  Checkbox,
  Flex,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import Image from "next/image";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/shared/contexts/auth.context";
import { useMutation } from "@tanstack/react-query";
import { login } from "../_api/auth.api";
import { createClient } from "@/utils/supabase/client";

const schema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .required();

type FormSchema = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });
  const router = useRouter();

  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  // const updatePasswordState = useLoginState(
  //   (state: any) => state.setPasswordState
  // );

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/projects");
    } catch {
      notifications.show({
        title: "Error",
        message: "Incorrect username or password.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex className="w-full min-h-screen">
        <Flex
          className="w-[40%] items-center justify-center flex-col "
          style={{
            backgroundImage: `url(https://dribbble.com/shots/19866022-Project-Timeline-Dashboard?utm_source=Clipboard_Shot&utm_campaign=Adalahreza&utm_content=Project%20Timeline%20Dashboard&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=Adalahreza&utm_content=Project%20Timeline%20Dashboard&utm_medium=Social_Share)`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        ></Flex>
        <Flex className="items-center justify-center w-[60%]">
          <Stack className="items-center h-auto">
            <Title>Welcome Back</Title>
            <Text>
              Please enter your registered username and password to access your
              account
            </Text>
            <Stack className="w-full">
              <TextInput
                label="Email"
                {...register("email")}
                error={errors?.email?.message}
              />
              <PasswordInput
                label="Password"
                {...register("password")}
                error={errors?.password?.message}
              />
            </Stack>
            <Flex className="justify-between w-full">
              <Checkbox label="Remember me" />
              {/* <Anchor href="/auth/forgot-password">Forgot password?</Anchor> */}
            </Flex>
            <Button type="submit" className="w-full" loading={isLoading}>
              Sign in
            </Button>

            <Text className="bottom-0" c="dimmed">
              Demena Solutions. All rights reserved.
            </Text>
          </Stack>
        </Flex>
      </Flex>
    </form>
  );
}

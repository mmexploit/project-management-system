"use client";
import { menu } from "@/config/menu";
import { useAuth } from "@/shared/contexts/auth.context";
import { Shell } from "@/shared/shell/shell";

export default function ShellComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell menu={menu}>{children}</Shell>;
}

import { menu } from "@/config/menu";
import { Shell } from "@/shared/shell/shell";
import React from "react";
import ProtectedPage from "./protected";
import ShellComponent from "./shell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage>
      <ShellComponent>{children}</ShellComponent>
    </ProtectedPage>
  );
}

"use client";
import { menu } from "@/config/menu";
import { Shell } from "@/shared/shell/shell";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell menu={menu}>{children}</Shell>;
}

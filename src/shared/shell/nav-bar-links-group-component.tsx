"use client";
import { useState } from "react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  rem,
  Flex,
} from "@mantine/core";
import { IconCalendarStats, IconChevronRight } from "@tabler/icons-react";
import classes from "./nav-bar-links-group.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/auth.context";

interface LinksGroupProps {
  icon?: React.FC<any>;
  label?: string;
  link?: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string; icon?: React.FC<any> }[];
  permissions?: string[] | string;
}

export function LinksGroup({
  icon: Icon,
  label,
  link,
  initiallyOpened,
  links,
  permissions,
}: LinksGroupProps) {
  const router = useRouter();
  const hasLinks = Array.isArray(links);
  const pathname = usePathname();
  const [opened, setOpened] = useState(initiallyOpened || false);
  const { user } = useAuth();
  const items = (hasLinks ? links : []).map((link) => {
    const Icon = link.icon;
    if (permissions?.includes(user?.user_metadata?.role)) {
      return (
        <Link
          className={`${classes.link} ${
            pathname.startsWith(link.link ?? "#") ? "bg-primary-50" : ""
          }`}
          href={link.link}
          key={link.label}
        >
          <Flex gap="sm">
            {Icon && (
              <Icon
                style={{ width: rem(24), height: rem(24), color: "#3333337a" }}
              />
            )}
            <Text>{link.label}</Text>
          </Flex>
        </Link>
      );
    }
  });

  if (permissions?.includes(user?.user_metadata?.role)) {
    return (
      <>
        <UnstyledButton
          onClick={() => {
            hasLinks ? setOpened((o) => !o) : link && router.push(link);
          }}
          className={`${classes.control} ${
            pathname.startsWith(link ?? "#") ? "bg-primary-50" : ""
          } hover:bg-primary-50`}
        >
          <Group justify="space-between" gap={0} className="">
            <Box style={{ display: "flex", alignItems: "center" }}>
              {Icon && (
                <Icon
                  style={{
                    width: rem(24),
                    height: rem(24),
                    color: "#3333337a",
                  }}
                />
              )}

              <Text ml="md" className="">
                {label}
              </Text>
            </Box>
            {hasLinks && (
              <IconChevronRight
                className={classes.chevron}
                stroke={1.5}
                style={{
                  width: rem(16),
                  height: rem(16),
                  transform: opened ? "rotate(-90deg)" : "none",
                }}
              />
            )}
          </Group>
        </UnstyledButton>
        {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
      </>
    );
  }
}

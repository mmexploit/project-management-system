"use client";
import {
  AppShell,
  Burger,
  Group,
  Flex,
  ScrollArea,
  Avatar,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
  Button,
  Stack,
  Menu,
  Indicator,
  Pagination,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import logo from "./aau-logo.png";
import { ReactNode, useEffect } from "react";
import classes from "./navbar.module.css";
import { useState } from "react";
import {
  IconSearch,
  IconBell,
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconCalendarStats,
  IconUser,
  IconFingerprint,
  IconSettings,
  IconMenu2,
} from "@tabler/icons-react";
import { LinksGroup } from "./nav-bar-links-group-component";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/auth.context";
import Link from "next/link";

const perPage = 5;

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

export function Shell({
  children,
  menu,
}: {
  children: ReactNode;
  menu: Record<string, Record<string, any>[]>;
}) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { user } = useAuth();
  const router = useRouter();
  const param = usePathname();


  const [page, setPage] = useState(1);
//   const totalPages =
//     notifications?.total && calculateTotalPages(notifications?.total, perPage);

//   useEffect(() => {
//     const from = (page - 1) * perPage;
//     getNotifications({
//       skip: from,
//       take: perPage,
//       sort: [{ field: "createdAt", direction: "DESC" }],
//     });
//   }, [page]);

  return (
    <AppShell
      header={{ height: "60px" }}
      layout="alt"
      navbar={{
        width: desktopOpened ? 270 : 70,
        breakpoint: "sm",
      }}
      padding="md"
    >
      <AppShell.Header className="backdrop-blur-3xl bg-white/100 border-b-0 w-full">
        {/* <Group
          h="100%"
          px="md"
          className="shadow-md border-l-2 border-gray-300 bg-white "
        >
        </Group> */}
        <Flex
          align="center"
          className="relative items-center h-full w-full"
          px="sm"
        >
          <TextInput
            leftSection={<IconSearch />}
            placeholder="Search here"
            className="w-3/12"
          />
          <Group className="absolute right-[20dvw]">
            {/* <Avatar color="black" variant="default">
              <IconBell stroke="md" />
            </Avatar> */}
            {/* <Group>
              <Menu shadow="md" width={250}>
                <Menu.Target>
                  <Indicator
                    label={<Text fz="xs">{notifications?.total}</Text>}
                    // inline
                    processing={notifications && notifications?.total > 0}
                  >
                    <Avatar
                      color="black"
                      variant="default"
                      className="cursor-pointer hover:bg-primary-400"
                    >
                      <IconBell stroke="md" />
                    </Avatar>
                  </Indicator>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Notifications</Menu.Label>
                  {notifications &&
                    notifications?.total > 0 &&
                    notifications?.items?.map((notis) => (
                      <Menu.Item key={notis?.id}>
                        {notis?.content?.includes("reject") ? (
                          <Flex className="w-full flex flex-col">
                            <p>{notis?.content}.</p>
                            <Link href="/sample-bio" className="text-sm underline text-blue-400">See example bio</Link>
                            <p>Contact: admin@aau.edu.et for futher inquries.</p>
                          </Flex>
                        ) : (
                          notis.content
                        )}
                      </Menu.Item>
                    ))}
                  {!notifications ||
                    (notifications?.total == 0 && (
                      <Menu.Item>No notifications</Menu.Item>
                    ))}
                  <Menu.Divider />
                  <Menu.Item>
                    <Pagination
                      onChange={setPage}
                      size="sm"
                      total={totalPages ?? 0}
                      value={page}
                      withEdges
                    />
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group> */}
            <Menu>
              <Menu.Target>
                <Avatar
                  color="black"
                  variant="default"
                  className="cursor-pointer"
                >
                  {user?.name?.charAt(0) ?? "U"}
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUser size={22} stroke="md" />}>
                  <Flex className="gap-2 flex-col">
                    <Text>{user?.name}</Text>
                    <Text>{user?.role}</Text>
                  </Flex>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar>
        {desktopOpened && (
          <AppShell.Section className="outline-red-400 h-[50px]">
            <div className="flex items-center justify-center h-full flex-wrap gap-4 my-2">
              <Flex className="w-3/4 h-full items-center gap-2">
                {/* <div
                  className="w-[100%] h-full"
                  style={{
                    backgroundImage: `url(${logo.src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                  }}
                /> */}
                <Flex direction={"column"} gap="0">
                  <Text fw="700">PMS </Text>
                </Flex>
              </Flex>
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                size="sm"
                hiddenFrom="sm"
              />
              <Burger
                opened={desktopOpened}
                onClick={toggleDesktop}
                size="sm"
                visibleFrom="sm"
              />
            </div>
          </AppShell.Section>
        )}

        {!desktopOpened && (
          <Flex className="items-center justify-center">
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              size="sm"
              visibleFrom="sm"
              className="my-4"
            />
          </Flex>
        )}

        <ScrollArea className={`${classes.links} `}>
          <NestedNavBar
            menu={menu}
            desktopOpened={desktopOpened}
            mobileOpened={mobileOpened}
          />
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main className="w-full bg-neutral-100">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export function NestedNavBar({
  menu,
  desktopOpened,
  mobileOpened,
}: {
  menu: Record<string, Record<string, any>[]>;
  desktopOpened: boolean;
  mobileOpened: boolean;
}) {
  const pathname = usePathname();
  // const paths = pathname.split("/");
  const router = useRouter();

  const navarLinks = Object.entries(menu).map(([key, value]) => (
    <div key={key}>
      <Text c="dimmed" className="py-4">
        {key == "mainMenu" ? "Main Menu" : "Support"}
      </Text>
      {value.map((item, index) => {
        return <LinksGroup key={index} {...item} />;
      })}
    </div>
  ));

  const mainLinks = Object.entries(menu).map(([key, value]) =>
    value.map((item, index) => {
      const Icon = item.icon;
      return (
        <Tooltip
          label={item.label}
          position="right"
          withArrow
          transitionProps={{ duration: 0 }}
          key={item.label}
        >
          <UnstyledButton<"a">
            onClick={() =>
              router.push(item.links ? item.links[0].link : item.link)
            }
            className={`${classes.mainLink} ${
              pathname.startsWith(item.link ?? "#") ||
              item.links?.some((linkObj: Record<string, any>) =>
                pathname.startsWith(linkObj.link)
              )
                ? "bg-primary-50"
                : ""
            }`}
          >
            <Icon style={{ width: "2rem", height: "2rem" }} stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      );
    })
  );

  return (
    <>
      {desktopOpened && (
        <nav className={`${classes.navbarShell}`}>
          <div className={`${classes.headerShell}`}>
            <Group justify="space-between">
              {/* <Image alt="Logo" src={"/logo.png"} width={80} height={80} /> */}
              {/* <Code fw={700}>v3.1.2</Code> */}
              {/* <span>{`${user?.firstName ?? ""} ${user?.middleName ?? ""} ${
            user?.lastName ?? ""
          }`}</span> */}
            </Group>
          </div>

          <ScrollArea className={classes.links}>
            <div className={classes.linksInner}>{navarLinks}</div>
          </ScrollArea>
        </nav>
      )}
      <nav className="p-3">
        {!desktopOpened && (
          <Stack justify="center" gap={10}>
            {mainLinks}
          </Stack>
        )}
      </nav>
    </>
  );
}

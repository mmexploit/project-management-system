import { Box, Card, Flex, Stack, Text } from "@mantine/core";
import { ReactNode } from "react";

export default function Section({
  title,
  children,
  additionalActions,
}: {
  title: string;
  children: ReactNode;
  additionalActions?: ReactNode;
}) {
  return (
    <Card shadow="sm" radius="sm">
      <Card.Section className="p-4 px-8 ">
        <Flex className="justify-between items-center ">
          <Flex className="gap-4 w-[20%]">
            <Box className="bg-primary-200 w-[1rem] rounded-md" />
            <Text fz="lg" fw="bold">
              {title}
            </Text>
          </Flex>
          {additionalActions && additionalActions}
        </Flex>
      </Card.Section>
      <Stack className="p-4">{children}</Stack>
    </Card>
  );
}

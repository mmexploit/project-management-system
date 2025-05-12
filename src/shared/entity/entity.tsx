"use client";
import {
  Button,
  Flex,
  Menu,
  Stack,
  TextInput,
  Text,
  ActionIcon,
  Popover,
  Pill,
  InputBase,
  Tooltip,
} from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconChevronUp,
  IconCirclePlus,
  IconDots,
  IconEdit,
  IconEye,
  IconFilter,
  IconPlus,
  IconSearch,
  IconSelector,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useEffect, useState } from "react";
import { EntityProps, FilterConfig } from "./model/entity.model";
import { useRouter } from "next/navigation";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import Section from "../section/section.component";
import { Where } from "../collection/model/query.model";
import { modals } from "@mantine/modals";
// import { useFormMode } from "@/store/state/employee.local";

const PAGE_SIZES = [10, 15, 20];

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

export function Entity<T extends object>({
  config,
  data,
  total = 0,
  onRequestChange,
  onDelete,
}: EntityProps<T>) {
  const {
    showNewButton = true,
    showActionColumn = true,
    showEdit = true,
    showDelete = true,
    primaryColumn,
  } = config;

  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const router = useRouter();

  // const setFormMode = useFormMode((state: any) => state.setFormMode);

  const [search, setSearch] = useDebouncedState("", 500);
  const [sortBy, setSortBy] = useState<{
    columnAccessor: string;
    direction: "asc" | "desc";
  }>({ columnAccessor: "created_at", direction: "desc" });

  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>[]>(
    []
  );

  const totalPages = calculateTotalPages(total, pageSize);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const where: Where[][] = [];

    if (typeof primaryColumn == "string" && search) {
      where.push([
        {
          field: `${primaryColumn}`,
          value: search,
          operator: "ilike",
        },
      ]);
    }

    if (Array.isArray(primaryColumn) && search) {
      where.push(
        primaryColumn.map((column) => ({
          field: column.value,
          value: search,
          operator: "ilike",
        }))
      );
    }

    if (selectedFilters.length > 0) {
      selectedFilters.forEach((filter) => {
        where.push([
          {
            field: filter.field,
            value: filter.value,
            operator: filter.operator,
          },
        ]);
      });
    }

    onRequestChange?.({
      skip: from,
      take: pageSize,
      where: where,
      sort: [
        {
          field: sortBy.columnAccessor,
          direction: sortBy.direction.toUpperCase() as "ASC" | "DESC",
        },
      ],
    });
  }, [page, search, sortBy, pageSize, selectedFilters]);

  const handleSort = (column: any) => {
    // column.toggleSorting();
    // let direction: "ASC" | "DESC" = "ASC";
    // if (column.getIsSorted() !== false) {
    //   direction =
    //     (column.getIsSorted() as string).toUpperCase() === "ASC"
    //       ? "DESC"
    //       : "ASC";
    setSortBy({
      columnAccessor: column.columnAccessor,
      direction: column.direction,
    });
  };

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  // useEffect(() => {
  //   const from = (page - 1) * pageSize;
  //   const to = from + pageSize;
  //   setRecords(data.slice(from, to));
  // }, [page, pageSize]);

  useEffect(() => {
    config?.onSelectedRecordsChange &&
      config?.onSelectedRecordsChange(selectedRecords);
  }, [selectedRecords]);

  return (
    <Section
      title={config?.title}
      additionalActions={
        <Flex className="w-full flex-col gap-2">
          <Flex className="w-full gap-4 justify-end">
            <TextInput
              placeholder={`Search from ${typeof primaryColumn == "string" ? primaryColumn : primaryColumn?.map((col) => col.label).join(", ")}`}
              leftSection={<IconSearch />}
              onChange={(e) => setSearch(e.currentTarget.value)}
              className="w-[50%]"
            />
            {showNewButton && (
              <Button
                onClick={() => {
                  // setFormMode("new");
                  router.push(`/${config?.baseUrl}/new`);
                }}
                leftSection={<IconPlus size={18} />}
                // className="w-[25%]"
              >
                New
              </Button>
            )}
            {config?.additionalActions && config?.additionalActions}

            {/* {config?.showExport == false ? null : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-primary-100 "
                    fw={400}
                    rightSection={<IconFilter stroke="sm" />}
                  >
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <DropdownMenuGroup>
                    {(!config?.filterConfig ||
                      config?.filterConfig?.length === 0) && (
                      <p className="mx-auto text-sm">No Filtering Found</p>
                    )}
                    {config?.filterConfig?.map((config, index) => (
                      <DropdownMenuSub key={index}>
                        <DropdownMenuSubTrigger className="cursor-pointer hover:bg-primary-100">
                          <span>{config?.label}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="bg-white w-44">
                            {config?.options?.map((opt, index) => (
                              <DropdownMenuItem
                                className="cursor-pointer hover:bg-primary-100"
                                key={index}
                                onClick={() =>
                                  setSelectedFilters([
                                    ...selectedFilters,
                                    {
                                      label: config?.label,
                                      field: config?.column,
                                      operator: config?.operator,
                                      value: opt?.value,
                                      filterLabel: opt?.label,
                                    },
                                  ])
                                }
                              >
                                <span>{opt?.label}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )} */}
          </Flex>
          {selectedFilters?.length > 0 && (
            <InputBase
              className="w-[76%] self-end"
              component="div"
              multiline
              rightSection={
                <Tooltip label="Clear All Filters">
                  <ActionIcon
                    variant="subtle"
                    size={20}
                    onClick={() => setSelectedFilters([])}
                  >
                    <IconX />
                  </ActionIcon>
                </Tooltip>
              }
            >
              {selectedFilters.map((filter, index) => (
                <Pill
                  key={index}
                  withRemoveButton
                  onRemove={() => {
                    const filters = selectedFilters.filter(
                      (f) =>
                        !(f.field === filter.field && f.value === filter.value)
                    );
                    setSelectedFilters(filters);
                  }}
                >
                  {filter?.label}: {filter?.filterLabel}
                </Pill>
              ))}
            </InputBase>
          )}
        </Flex>
      }
    >
      <Stack>
        <DataTable
          // borderRadius={"sm"}
          // withTableBorder
          // borderColor={"#1E1E1E1A"}
          mih={120}
          verticalSpacing="14px"
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          totalRecords={total}
          recordsPerPage={pageSize}
          page={page}
          fetching={config?.isFetching}
          onPageChange={(p) => setPage(p)}
          sortStatus={sortBy}
          onSortStatusChange={handleSort}
          sortIcons={{
            sorted: <IconChevronUp size={14} />,
            unsorted: <IconSelector size={14} />,
          }}
          paginationText={({ from, to, totalRecords }) => (
            <Flex>{`${selectedRecords.length > 0 ? `Selected ${selectedRecords.length} of ${total}` : `Records ${from} - ${to} of ${totalRecords}`}`}</Flex>
          )}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          onRowClick={({ record }: { record: T & { id: string } }) => {
            // setFormMode("view");
            config?.showActionColumn &&
              router.push(
                config?.detailUrl
                  ? `/${config?.detailUrl}/${record.id}`
                  : `/${config?.baseUrl}/detail/${record.id}`
              );
          }}
          columns={[
            ...config?.columns,
            {
              accessor: "actions",
              hidden: !showActionColumn,
              render: (record) => (
                <>
                  <Menu offset={-4}>
                    <Menu.Target>
                      <ActionIcon
                        variant="white"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        size="md"
                      >
                        <IconDots className="cursor-pointer" color="gray" />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye color="blue" size={18} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // setFormMode("view");
                          router.push(
                            config?.detailUrl
                              ? `/${config?.detailUrl}/${record.id}`
                              : `/${config?.baseUrl}/detail/${record.id}`
                          );
                        }}
                      >
                        View
                      </Menu.Item>
                      {showEdit && (
                        <Menu.Item
                          leftSection={<IconEdit color="green" size={18} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            // setFormMode("edit");
                            router.push(`/${config?.baseUrl}/${record.id}`);
                          }}
                        >
                          Edit
                        </Menu.Item>
                      )}
                      {showDelete && (
                        <Menu.Item
                          leftSection={<IconTrash color="red" size={18} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            modals.openConfirmModal({
                              title: "Delete entry?",
                              centered: true,
                              children: (
                                <Text size="sm">
                                  Are you sure you want to delete this entry?
                                  This cannot be undone.
                                </Text>
                              ),
                              labels: {
                                confirm: "Delete Entry",
                                cancel: "Cancel",
                              },
                              confirmProps: { color: "red" },
                              onCancel: () => console.log("Cancel"),
                              onConfirm: () => {
                                onDelete?.(record.id);
                              },
                            });
                          }}
                        >
                          Delete
                        </Menu.Item>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </>
              ),
            },
          ]}
          records={(data as (T & { id: string })[]) ?? []}
        />
      </Stack>
    </Section>
  );
}

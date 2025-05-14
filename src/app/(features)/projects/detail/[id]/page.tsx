"use client";

import { SetStateAction, Dispatch, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DroppableStateSnapshot,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { IconArrowLeft } from "@tabler/icons-react";
import { Avatar, Button, Stack, Tooltip, Modal } from "@mantine/core";
import { Flex, Text } from "@mantine/core";
import { useRouter, useParams } from "next/navigation";
import { InitialData, Task, Column as ColumnType } from "@/models/task.model";
import AddTask from "../../_components/add-task";
import { createClient } from "@/utils/supabase/client";
import { notifications } from "@mantine/notifications";
import { Project } from "@/models/project.model";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
} from "../../_api/tasks.api";
import { getProjectById } from "../../_api/project.api";
import { useDisclosure } from "@mantine/hooks";
// Initial data
const columnsDefinition: InitialData = {
  tasks: {},
  columns: {
    todo: {
      id: "todo",
      title: "To Do",
      taskIds: [],
    },
    "in-progress": {
      id: "in-progress",
      title: "In Progress",
      taskIds: [],
    },
    done: {
      id: "done",
      title: "Done",
      taskIds: [],
    },
  },
  columnOrder: ["todo", "in-progress", "done"],
};

// Components
const TaskComponent = ({
  task,
  index,
  setSelectedTask,
  open,
}: {
  task: Task;
  index: number;
  setSelectedTask: Dispatch<SetStateAction<string | null>>;
  open: () => void;
}) => (
  <Draggable draggableId={task?.id} index={index}>
    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-white p-3 rounded-md shadow flex flex-col ${
          snapshot.isDragging ? "shadow-lg" : ""
        }`}
        onClick={() => {
          open();
          setSelectedTask(task?.id);
        }}
      >
        <Text>{task?.name}</Text>
        <Tooltip label={task?.assignee?.name}>
          <Avatar color="red" variant="filled" className="ml-auto">
            {task?.assignee?.name?.charAt(0)}
          </Avatar>
        </Tooltip>
      </div>
    )}
  </Draggable>
);

const Column = ({
  column,
  tasks,
  setSelectedTask,
  open,
}: {
  column: ColumnType;
  tasks: Task[];
  setSelectedTask: Dispatch<SetStateAction<string | null>>;
  open: () => void;
}) => (
  <div className="bg-blue-100 p-4 rounded-lg">
    <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
    <Droppable droppableId={column.id}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`space-y-3 min-h-[200px] ${
            snapshot.isDraggingOver ? "bg-gray-200" : ""
          }`}
        >
          {tasks.map((task, index) => (
            <TaskComponent
              key={task?.id}
              task={task}
              index={index}
              setSelectedTask={setSelectedTask}
              open={open}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

const transformTasksToBoardFormat = (tasks: any[]) => {
  const tasksMap: { [key: string]: Task } = {};
  const columns = columnsDefinition.columns;

  tasks.forEach((task) => {
    // Add task to tasks map
    tasksMap[task.id] = {
      id: task.id,
      name: task.name,
      assignee: task.assignee,
      project_id: task.project_id,
      status: task.status,
    };

    // Add task ID to appropriate column
    if (
      columns[task.status as keyof typeof columns] &&
      !columns[task.status as keyof typeof columns]?.taskIds?.includes(task.id)
    ) {
      columns[task.status as keyof typeof columns].taskIds.push(task.id);
    }
  });

  return {
    tasks: tasksMap,
    columns,
    columnOrder: ["todo", "in-progress", "done"],
  };
};

export default function KanbanBoard() {
  const [state, setState] = useState<InitialData>(columnsDefinition);
  const router = useRouter();
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getTasks(id?.toString() ?? ""),
  });
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id?.toString() ?? ""),
  });
  const {
    mutateAsync: updateTaskStatusHandler,
    isPending: isUpdatingTaskStatus,
  } = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      updateTaskStatus(taskId, status),
  });
  const { mutateAsync: updateTaskHandler, isPending: isUpdatingTask } =
    useMutation({
      mutationFn: (task: Task) => updateTask(task),
      onSuccess: () => {
        notifications.show({
          title: "Task updated",
          message: "Task updated successfully",
          color: "green",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Error",
          message: error.message ?? "Failed to update task",
          color: "red",
        });
      },
    });
  const { mutateAsync: createTaskHandler, isPending: isCreatingTask } =
    useMutation({
      mutationFn: (task: Task) => createTask(task),
      onSuccess: () => {
        notifications.show({
          title: "Task created",
          message: "Task created successfully",
          color: "green",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Error",
          message: error.message ?? "Failed to add task",
          color: "red",
        });
      },
    });

  useEffect(() => {
    if (tasks) {
      const reformattedState =
        tasks?.data && tasks?.data?.length > 0
          ? transformTasksToBoardFormat(tasks?.data ?? [])
          : columnsDefinition;
      setState(reformattedState);
    }
  }, [tasks]);

  console.log(state, "state");
  const queryClient = useQueryClient();

  const addTask = async (taskToAdd: Task) => {
    if (taskToAdd) {
      const reformattedTask = {
        name: taskToAdd.name,
        assignee_id: taskToAdd?.assignee?.assignee_id,
        project_id: id?.toString(),
        status: "todo",
      };
      const { error } = await createTaskHandler(
        reformattedTask as unknown as Task
      );
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });

      if (!error) {
        setState((prevState) => ({
          ...prevState,
          tasks: {
            ...prevState.tasks,
            [taskToAdd.id]: taskToAdd,
          },
          columns: {
            ...prevState.columns,
            todo: {
              ...prevState.columns["todo"],
              taskIds: [...prevState.columns["todo"].taskIds, taskToAdd.id],
            },
          },
        }));
        close();
      }
    }
  };

  const updateTaskCallback = async (task: Task) => {
    const { error } = await updateTaskHandler(task);
    const reformattedTask = {
      name: task.name,
      assignee_id: task?.assignee?.assignee_id,
      project_id: id?.toString(),
      status: task.status,
    };
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const column = state.columns[source.droppableId];
      const newTaskIds = Array.from(column.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      setState((prevState) => ({
        ...prevState,
        columns: {
          ...prevState.columns,
          [column.id]: {
            ...column,
            taskIds: newTaskIds,
          },
        },
      }));
      return;
    }

    // Moving from one column to another
    const sourceColumn = state.columns[source.droppableId];
    const destColumn = state.columns[destination.droppableId];
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    const destTaskIds = Array.from(destColumn.taskIds);

    sourceTaskIds.splice(source.index, 1);
    destTaskIds.splice(destination.index, 0, draggableId);

    const prevState = state;
    setState((prevState) => ({
      ...prevState,
      columns: {
        ...prevState.columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          taskIds: sourceTaskIds,
        },
        [destColumn.id]: {
          ...destColumn,
          taskIds: destTaskIds,
        },
      },
    }));

    const { error: updateError } = await updateTaskStatusHandler({
      taskId: draggableId,
      status: destination.droppableId,
    });

    if (updateError) {
      setState(prevState);
    }
  };

  return (
    <Stack className="p-6">
      {
        <Flex className="items-center justify-between">
          <Flex className="flex-col gap-2">
            <Text fz={"h3"} className="font-semibold">
              {project?.data?.name}
            </Text>
            <Text c="dimmed" size="sm">
              Tasks
            </Text>
          </Flex>
          <Flex className="gap-2">
            <Button
              onClick={() => {
                open();
                setSelectedTask(null);
              }}
            >
              Add Task
            </Button>
            <Modal opened={opened} onClose={close} title="Add Task">
              <AddTask
                addTask={addTask}
                selectedTask={selectedTask}
                close={close}
              />
            </Modal>
            <Button
              variant="outline"
              leftSection={<IconArrowLeft />}
              onClick={() => router.push(`/projects`)}
            >
              Back
            </Button>
          </Flex>
        </Flex>
      }

      <Stack className="mt-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-3 gap-6 ">
            {state.columnOrder.map((columnId) => {
              const column = state.columns[columnId];
              const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  setSelectedTask={setSelectedTask}
                  open={open}
                />
              );
            })}
          </div>
        </DragDropContext>
      </Stack>
    </Stack>
  );
}

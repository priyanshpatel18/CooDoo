"use client";

import { Todo, Workspace } from "@/store/store";
import { ReactNode, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import DroppableBox from "./Droppable";

interface KanbanColumn {
  id: string;
  name: string;
  items: Todo[];
}

interface DragDropContentProps {
  workspace: Workspace | undefined;
}

export default function DragDropContent({
  workspace,
}: DragDropContentProps): ReactNode {
  const columnsList: KanbanColumn[] = [
    {
      id: "1",
      name: "Pending",
      items: (workspace?.todos || []).filter(
        (todo) => todo.status.toLowerCase() === "pending"
      ),
    },
    {
      id: "2",
      name: "In Progress",
      items: (workspace?.todos || []).filter(
        (todo) => todo.status.toLowerCase() === "in progress"
      ),
    },
    {
      id: "3",
      name: "Completed",
      items: (workspace?.todos || []).filter(
        (todo) => todo.status.toLowerCase() === "completed"
      ),
    },
  ];

  const [columns, setColumns] = useState<KanbanColumn[] | undefined>(
    columnsList
  );

  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    if (
      source.draggableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumnIndex: number = source.droppableId;
    const destinationColumnIndex: number = destination.droppableId;

    if (sourceColumnIndex === destinationColumnIndex) {
      const columnToUpdate = columns?.find(
        (col) => col.id == sourceColumnIndex.toString()
      );

      if (columnToUpdate) {
        const updatedItems = reorder(
          columnToUpdate.items,
          source.index,
          destination.index
        );

        const updatedColumns = columns?.map((col) =>
          col.id === columnToUpdate.id ? { ...col, items: updatedItems } : col
        );

        setColumns(updatedColumns);
      }
    } else {
      const sourceColumn = columns?.find(
        (col) => col.id == sourceColumnIndex.toString()
      );
      const destinationColumn = columns?.find(
        (col) => col.id == destinationColumnIndex.toString()
      );
      if (sourceColumn && destinationColumn) {
        move(
          sourceColumn!,
          destinationColumn!,
          source.index,
          destination.index
        );
      }
      return;
    }
  }

  function reorder(list: Todo[], from: number, to: number) {
    // Create new list
    const updatedList = Array.from(list);
    // Remove item
    const [removed] = updatedList.splice(from, 1);
    // Add item
    updatedList.splice(to, 0, removed);
    // Return new list
    return updatedList;
  }

  function move(
    source: KanbanColumn,
    destination: KanbanColumn,
    from: number,
    to: number
  ) {
    const sourceClone = Array.from(source.items);
    const destClone = Array.from(destination.items);

    const [removed] = sourceClone.splice(from, 1);
    destClone.splice(to, 0, removed);

    const updatedSource = {
      ...source,
      items: sourceClone,
    };
    const updatedDest = {
      ...destination,
      items: destClone,
    };

    setColumns((prevColumns) => {
      const updatedColumns = prevColumns?.map((col) => {
        if (col.id === source.id) {
          return updatedSource;
        } else if (col.id === destination.id) {
          return updatedDest;
        } else {
          return col;
        }
      });
      return updatedColumns;
    });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-[1rem]">
        {columns?.map((col, index) => (
          <div
            key={index}
            className="w-[20rem] flex flex-row p-4 m-[1rem] bg-background sm:rounded-sm rounded-lg border-border border-[2px]"
          >
            <DroppableBox droppableId={col.id} columnItems={col.items} />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

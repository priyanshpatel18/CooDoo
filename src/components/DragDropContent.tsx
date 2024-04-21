"use client";

import { ReactNode, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import DroppableBox from "./Droppable";

interface KanbanItem {
  itemName: string;
  bg: string;
}

interface KanbanColumn {
  id: string;
  name: string;
  items: KanbanItem[];
}

const columnsList: KanbanColumn[] = [
  {
    id: "1",
    name: "Pending",
    items: [
      {
        itemName: "item1",
        bg: "#42b6e3",
      },
      {
        itemName: "item5",
        bg: "#c377e0",
      },
      {
        itemName: "item9",
        bg: "#eb5a46",
      },
    ],
  },
  {
    id: "2",
    name: "iN progress",
    items: [
      {
        itemName: "item3",
        bg: "#61bd4f",
      },
      {
        itemName: "item7",
        bg: "#ff4538",
      },
      {
        itemName: "item8",
        bg: "#0055cc",
      },
    ],
  },
  {
    id: "3",
    name: "completed",
    items: [
      {
        itemName: "item4",
        bg: "#0055cc",
      },
      {
        itemName: "item6",
        bg: "#c377e0",
      },
      {
        itemName: "item2",
        bg: "#42b6e3",
      },
    ],
  },
];

export default function DragDropContent(): ReactNode {
  const [columns, setColumns] = useState(columnsList);

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
      const columnToUpdate = columns.find(
        (col) => col.id == sourceColumnIndex.toString()
      );

      if (columnToUpdate) {
        const updatedItems = reorder(
          columnToUpdate.items,
          source.index,
          destination.index
        );

        const updatedColumns = columns.map((col) =>
          col.id === columnToUpdate.id ? { ...col, items: updatedItems } : col
        );

        setColumns(updatedColumns);
      }
    } else {
      const sourceColumn = columns.find(
        (col) => col.id == sourceColumnIndex.toString()
      );
      const destinationColumn = columns.find(
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

  function reorder(list: KanbanItem[], from: number, to: number) {
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
      const updatedColumns = prevColumns.map((col) => {
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
        {columns.map((col, index) => (
          <div
            key={index}
            className="flex flex-row p-4 m-[1rem] bg-background sm:rounded-sm rounded-lg border-border border-[2px]"
          >
            <DroppableBox
              droppableId={col.id}
              columnName={col.name}
              columnItems={col.items}
            />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

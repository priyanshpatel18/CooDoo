import { ReactNode } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";

interface IDroppableProps {
  droppableId: string;
  columnName: string;
  columnItems: any[];
}

export default function DroppableBox({
  droppableId,
  columnName,
  columnItems,
}: IDroppableProps): ReactNode {
  return (
    <Droppable droppableId={droppableId} direction="vertical">
      {(provided: DroppableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col w-[18rem]"
        >
          <h2 className="text-primary uppercase text-center text-[2rem]">
            {columnName}
          </h2>
          {columnItems.map((item, index) => (
            <div key={index}>
              <Draggable
                index={index}
                draggableId={`item-${droppableId}-${index}`}
              >
                {(
                  provided: DraggableProvided,
                  snapshot: DraggableStateSnapshot
                ) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      backgroundColor: item.bg,
                      transition: "transform 0.2s ease",
                      ...provided.draggableProps.style,
                      ...(snapshot.isDragging && {
                        opacity: `0.7`,
                      }),
                    }}
                    className="w-[16rem] h-[15rem] rounded-sm lg:rounded-lg cursor-pointer select-none m-[1rem] flex flex-col justify-between"
                  >
                    <span className="flex flex-1 w-full items-center justify-center text-[1.5rem]">
                      {item.itemName}
                    </span>
                    <div className="bg-background-foreground text-primary basis-[60%] rounded-b-sm lg:rounded-b-lg p-[1rem]">
                      <span>title</span>
                      {/* <Image src={} alt="" /> */}
                    </div>
                  </div>
                )}
              </Draggable>
            </div>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

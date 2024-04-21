import { ReactNode } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import edit from "@/assets/edit.png";
import Image from "next/image";
import plus from "@/assets/plus.png";

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
          className="flex flex-col w-full max-h-[75vh] gap-[1rem] overflow-y-auto"
        >
          <h2 className="text-primary uppercase text-center text-[2rem]">
            {columnName}
          </h2>
          <div className="overflow-y-auto">
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
                      className="w-[16rem] h-[15rem] rounded-sm lg:rounded-lg cursor-pointer select-none m-[1rem] flex flex-col"
                    >
                      <span className="relative flex flex-1 w-full items-center justify-center text-[1.5rem]">
                        {item.itemName}
                        <Image
                          src={edit}
                          alt="edit"
                          className="absolute right-[10px] top-[10px] w-[2.5rem] h-[2.5rem] cursor-pointer hover:bg-[rgba(0,0,0,0.2)] p-[0.5rem] rounded-full"
                        />
                      </span>
                      <div className="bg-background-foreground text-primary basis-[60%] rounded-b-sm lg:rounded-b-lg p-[1rem]">
                        <span>title</span>
                      </div>
                    </div>
                  )}
                </Draggable>
              </div>
            ))}
          </div>
          {/* {provided.placeholder} */}
          <button className="w-full flex items-center text-primary gap-[1rem] justify-center bg-[rgb(35,35,50)] p-[10px] rounded-sm hover:bg-[rgb(65,65,80)]">
            <Image src={plus} alt="plus" className="w-[1rem] h-[1rem]" />
            <span>Add card</span>
          </button>
        </div>
      )}
    </Droppable>
  );
}

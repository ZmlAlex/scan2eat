import type {
  Active,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import React from "react";

import { DragHandle, SortableItem } from "./SortableItem";
import { SortableOverlay } from "./SortableOverlay";

type BaseItem = {
  id: UniqueIdentifier;
};

type Props<T extends BaseItem> = {
  items: T[];
  onDragEnd(items: T[]): void;
  onDragStart?(): void;
  renderItem(item: T): ReactNode;
};

export function SortableList<T extends BaseItem>({
  items,
  onDragEnd,
  onDragStart,
  renderItem,
}: Props<T>) {
  const [active, setActive] = React.useState<Active | null>(null);
  const activeItem = React.useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActive(active);
    onDragStart?.();
  };
  const handleDragCancel = () => setActive(null);
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over?.id) {
      const activeIndex = items.findIndex(({ id }) => id === active.id);
      const overIndex = items.findIndex(({ id }) => id === over.id);

      onDragEnd(arrayMove(items, activeIndex, overIndex));
    }
    setActive(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items}>
        {items.map((item) => (
          <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
        ))}
      </SortableContext>
      <SortableOverlay>
        {activeItem ? renderItem(activeItem) : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;

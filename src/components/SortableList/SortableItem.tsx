import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slot } from "@radix-ui/react-slot";
import type { CSSProperties, PropsWithChildren } from "react";
import React from "react";

import { Icons } from "~/components/Icons";

type Props = {
  id: UniqueIdentifier;
  asChild?: boolean;
};

type Context = {
  attributes: Partial<DraggableAttributes>;
  listeners: DraggableSyntheticListeners;
  ref: (node: HTMLElement | null) => void;
};

const SortableItemContext = React.createContext<Context>({
  attributes: {},
  listeners: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ref: () => {},
});

export function SortableItem({
  children,
  id,
  asChild,
}: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = React.useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const Wrapper = asChild ? Slot : "div";

  return (
    <SortableItemContext.Provider value={context}>
      <Wrapper ref={setNodeRef} style={style}>
        {children}
      </Wrapper>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref } = React.useContext(SortableItemContext);

  return (
    <div
      className="action flex h-8 w-8 touch-none items-center justify-center rounded-md hover:bg-muted"
      ref={ref}
      {...attributes}
      {...listeners}
    >
      <Icons.gripVertical className="h-4 w-4 " />
    </div>
  );
}

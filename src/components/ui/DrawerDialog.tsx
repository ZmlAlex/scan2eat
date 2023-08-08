import type * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "~/utils/cn";

const DrawerDialog = DrawerPrimitive.Root;

const DrawerDialogTitle = DrawerPrimitive.Title;
const DrawerDialogDescription = DrawerPrimitive.Description;

const DrawerDialogPortal = ({
  className,
  children,
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  <DrawerPrimitive.Portal className={cn(className)} {...props}>
    {children}
  </DrawerPrimitive.Portal>
);

DrawerDialogPortal.displayName = DrawerPrimitive.Portal.displayName;

const DrawerDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  // TODO: FIX OVERLAY
  <div
    ref={ref}
    className={cn("fixed inset-0 bg-background/80 backdrop-blur-sm", className)}
    {...props}
  />
  //   <DrawerPrimitive.Overlay
  //     ref={ref}
  //     className={cn(
  //       // TODO: FILL
  //       "",
  //       className
  //     )}
  //     {...props}
  //   />
));

DrawerDialogOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerDialogContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerDialogPortal>
    <DrawerDialogOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-2xl bg-background",
        className
      )}
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  </DrawerDialogPortal>
));

DrawerDialogContent.displayName = DrawerPrimitive.Content.displayName;

export {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogDescription,
  DrawerDialogTitle,
};

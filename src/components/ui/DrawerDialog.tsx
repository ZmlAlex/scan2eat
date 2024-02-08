import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  type ValueAnimationTransition,
} from "framer-motion";
import React from "react";

import { cn } from "~/helpers/cn";

const DrawerDialog = DialogPrimitive.Root;

const DrawerDialogTrigger = DialogPrimitive.Trigger;

const DrawerDialogPortal = ({
  className,
  children,
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal className={cn(className)} {...props}>
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:justify-end">
      {children}
    </div>
  </DialogPrimitive.Portal>
);
DrawerDialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DrawerDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn("fixed inset-0 z-50", className)}
    {...props}
    ref={ref}
  />
));
DrawerDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const inertiaTransition = {
  type: "inertia",
  bounceStiffness: 300,
  bounceDamping: 40,
  timeConstant: 300,
} as ValueAnimationTransition<number>;

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const SHEET_MARGIN = 34;

const DrawerDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    open: boolean;
    toggleModal: () => void;
  }
>(({ className, children, open, toggleModal, ...props }, ref) => {
  const h =
    typeof window === "undefined" ? 0 : window.innerHeight - SHEET_MARGIN;
  const y = useMotionValue(h);

  return (
    <AnimatePresence>
      {open ? (
        <DrawerDialogPortal forceMount>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DrawerDialogOverlay className="bg-black/50" />
          </motion.div>
          <DialogPrimitive.Content asChild ref={ref} {...props}>
            <motion.div
              className={cn(
                "fixed z-50 flex w-full flex-col gap-4 rounded-t-2xl bg-background",
                className
              )}
              initial={{ y: h }}
              animate={{ y: 0 }}
              exit={{ y: h }}
              transition={staticTransition}
              style={{
                y,
              }}
              drag="y"
              dragConstraints={{ top: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > window.innerHeight * 0.75 || velocity.y > 50) {
                  toggleModal();
                } else {
                  void animate(y, 0, { ...inertiaTransition, min: 0, max: 0 });
                }
              }}
            >
              {/* TODO: CHECK HOW BUTTON AFFECTS ON SMOOTH ANIMATION */}
              <button style={{ all: "unset" }}>{children}</button>
              {/* Extra element background at the bottom to account for rubber band scrolling. */}
              <div className="absolute left-0 right-0 top-[99%] h-96 bg-background" />
            </motion.div>
          </DialogPrimitive.Content>
        </DrawerDialogPortal>
      ) : null}
    </AnimatePresence>
  );
});

DrawerDialogContent.displayName = DialogPrimitive.Content.displayName;

const DrawerDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DrawerDialogHeader.displayName = "DialogHeader";

const DrawerDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse",
      "sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DrawerDialogFooter.displayName = "DialogFooter";

const DrawerDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DrawerDialogTitle.displayName = DialogPrimitive.Title.displayName;

const DrawerDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogTrigger,
};

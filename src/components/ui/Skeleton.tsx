import { cn } from "~/helpers/cn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

function SkeletonFactory({
  className,
  lines = 3,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: lines }, (_, index) => index).map((line) => (
        <Skeleton key={line} className={cn("h-6 w-full", className)} />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonFactory };

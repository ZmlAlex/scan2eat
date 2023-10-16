import { Icons } from "~/components/Icons";
import { cn } from "~/helpers/cn";

type Props = {
  className?: string;
};

const Placeholder = ({ className }: Props) => {
  return (
    <div
      className={cn("grid h-full place-items-center bg-secondary", className)}
    >
      <Icons.imageOff className="h-8 w-8" />
    </div>
  );
};

export { Placeholder };

import type { User } from "@prisma/client";
import type { AvatarProps } from "@radix-ui/react-avatar";

import { Icons } from "~/components/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage alt="Picture" src={user.image} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}

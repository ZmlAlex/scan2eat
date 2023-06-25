import Link from "next/link";

import type { RouterOutputs } from "~/utils/api";
import { formatDate } from "~/utils/formatDate";
// import { Post } from "@prisma/client";

// import { Skeleton } from "@/components/ui/skeleton";
// import { PostOperations } from "@/components/post-operations";

interface RestaurantItemProps {
  restaurant: Pick<
    RouterOutputs["restaurant"]["getAllRestaurants"][0],
    "id" | "createdAt" | "restaurantI18N"
  >;
}

export function RestaurantItem({ restaurant }: RestaurantItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/dashboard/restaurants/${restaurant.id}`}
          className="font-semibold hover:underline"
        >
          {restaurant.restaurantI18N.name}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(restaurant.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      {/* //TODO: ADD OPERATIONS FOR EDIT/DELETE */}
      {/* <PostOperations post={{ id: post.id, title: post.title }} /> */}
    </div>
  );
}

//TODO: ADD SKELETON?
// PostItem.Skeleton = function PostItemSkeleton() {
//   return (
//     <div className="p-4">
//       <div className="space-y-3">
//         <Skeleton className="h-5 w-2/5" />
//         <Skeleton className="h-4 w-4/5" />
//       </div>
//     </div>
//   );
// };

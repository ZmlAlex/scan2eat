import Link from "next/link";

import { formatDate } from "~/utils/formatDate";
import type { Restaurant } from "~/utils/formatTranslationToOneLanguage";

import { RestaurantOperations } from "./RestaurantOperations";
// import { Post } from "@prisma/client";

// import { Skeleton } from "@/components/ui/skeleton";
// import { PostOperations } from "@/components/post-operations";

interface RestaurantItemProps {
  restaurant: Pick<Restaurant[0], "id" | "createdAt" | "restaurantI18N">;
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
      <RestaurantOperations restaurantId={restaurant.id} />
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

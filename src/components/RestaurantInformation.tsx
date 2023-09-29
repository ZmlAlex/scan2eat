import Image from "next/image";
import React from "react";

import { Icons } from "~/components/Icons";
import { Placeholder } from "~/components/ui/Placeholder";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

type Props = {
  restaurant: RestaurantWithDetails;
};

const RestaurantInformation = ({ restaurant }: Props) => {
  const { workingHours, logoUrl } = restaurant;
  const { address, description } = restaurant.restaurantI18N;

  return (
    <>
      {/* general info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative h-80 overflow-hidden rounded-3xl">
          {logoUrl ? (
            <Image
              className="object-cover"
              src={logoUrl}
              alt="Restaurant"
              fill
              loading="lazy"
            />
          ) : (
            <Placeholder />
          )}
        </div>
        <div className="flex flex-col justify-center gap-5 rounded-3xl border p-5 ">
          {!!workingHours && (
            <div className="flex gap-3">
              <Icons.clock2 className="shrink-0" />
              {/* TODO: HANDLE TIME */}
              <span className="font-semibold">{workingHours}</span>
            </div>
          )}
          {!!address && (
            <div className="flex gap-3">
              <Icons.mapPin className="shrink-0" />
              <span className="font-semibold">{address}</span>
            </div>
          )}
          {!!description && (
            <div className="flex gap-3">
              <Icons.store className="shrink-0" />
              <span className="font-semibold">{description}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RestaurantInformation;

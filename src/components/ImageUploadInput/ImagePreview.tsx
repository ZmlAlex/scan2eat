import Image from "next/image";
import React from "react";

import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/Button";

type Props = {
  croppedImageUrl: string;
  onClick: () => void;
};
export const ImagePreview = ({ croppedImageUrl, onClick }: Props) => {
  return (
    <div className="h-64 w-full">
      <div className="relative h-full overflow-hidden rounded-md border">
        <Button
          className="absolute right-4 top-4 z-10"
          type="button"
          size="icon"
          variant="destructive"
          onClick={onClick}
        >
          <Icons.trash />
        </Button>
        <Image
          className="object-contain"
          src={croppedImageUrl}
          alt="cropped image"
          fill
        />
      </div>
    </div>
  );
};

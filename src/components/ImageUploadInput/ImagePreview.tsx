import Image from "next/image";
import React from "react";

import { Button } from "~/components/ui/Button";

import { Icons } from "../Icons";

type Props = {
  croppedImageUrl: string;
  onClick: () => void;
};
const ImagePreview = ({ croppedImageUrl, onClick }: Props) => {
  return (
    <div className="h-64 w-full">
      <div className="relative h-full overflow-hidden rounded-md border">
        <Button
          className="absolute right-4 top-4"
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

export default ImagePreview;

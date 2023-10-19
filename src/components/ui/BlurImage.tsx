import Image from "next/image";
import type { ComponentProps } from "react";
import React from "react";

import { cn } from "~/helpers/cn";

type Props = ComponentProps<typeof Image>;

const BlurImage = ({ src, alt, className, ...props }: Props) => {
  const [isLoading, setLoading] = React.useState(true);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        className={cn(
          "duration-500 ease-in-out",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0",
          className
        )}
        onLoadingComplete={() => setLoading(false)}
        {...props}
      />
    </>
  );
};

export { BlurImage };

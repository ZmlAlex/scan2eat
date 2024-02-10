import { useTranslations } from "next-intl";
import React from "react";
import { useDropzone } from "react-dropzone";

import { Icons } from "~/components/Icons";
import { cn } from "~/libs/cn";

export type DropzoneProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onDrop" | "onChange"
> & {
  onDrop: (acceptedFiles: File[]) => void;
};

export const Dropzone = ({ onDrop, ...props }: DropzoneProps) => {
  const t = useTranslations("Common.imageUploadInput");
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
    },
  });

  return (
    <div
      className="flex h-64 w-full items-center justify-center"
      {...getRootProps()}
    >
      <label
        htmlFor={props.id}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center self-stretch rounded-md border border-dashed",
          isDragActive && "bg-muted"
        )}
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <Icons.uploadCloud className="mb-4" />

          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">{t("firstRow.boldText")}</span>{" "}
            {t("firstRow.regularText")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("secondRow")}
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          {...props}
          {...getInputProps()}
          // workaround solution for custom input file with react-hook-form
          value={undefined}
        />
      </label>
    </div>
  );
};

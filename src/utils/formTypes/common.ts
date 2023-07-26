import { z } from "zod";

//TODO MOVE IT TO REUSABLE PLACE
const MAX_FILE_SIZE = 50;

export const imageInput = z
  .string()
  .optional()
  .refine((croppedImageBase64) => {
    if (croppedImageBase64) {
      const stringLength = croppedImageBase64.length;
      const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
      const sizeInKb = sizeInBytes / 1000;

      return sizeInKb <= MAX_FILE_SIZE;
    }

    return true;
  }, `Max file size is 5MB.`); // this should be greater than or equals (>=) not less that or equals (<=)

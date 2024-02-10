import React from "react";

import { useModal } from "~/hooks/utils/useModal";

import { CropperDialog } from "./CropperDialog";
import { Dropzone } from "./Dropzone";
import { ImagePreview } from "./ImagePreview";

export type ImageUploadInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  onChange: (file?: string | ArrayBuffer) => void;
  onImageDelete?: () => void;
  preselectedImageUrl?: string;
};

export const ImageUploadInput = React.forwardRef(
  (props: ImageUploadInputProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { isModalOpen, toggleModal } = useModal();

    const [newUploadedImageUrl, setNewUploadedImageUrl] = React.useState("");
    const [croppedImageUrl, setCroppedImageUrl] = React.useState(
      props.preselectedImageUrl
    );

    return (
      <div ref={ref}>
        {croppedImageUrl ? (
          <ImagePreview
            croppedImageUrl={croppedImageUrl}
            onClick={() => {
              setCroppedImageUrl("");
              props.onImageDelete?.();
              props.onChange?.();
            }}
          />
        ) : (
          <Dropzone
            {...props}
            onDrop={(files) => {
              const [imageFile] = files;
              if (imageFile) {
                const imageURLFromFile = URL.createObjectURL(imageFile);
                setNewUploadedImageUrl(imageURLFromFile);
                toggleModal();
              }
            }}
          />
        )}

        {/* Modal to allow the user to zoom & crop the uploading image into appropriate aspect ratio  */}
        {isModalOpen && (
          <CropperDialog
            uploadedImageUrl={newUploadedImageUrl}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            onCropFinish={(croppedImageBase64) => {
              setCroppedImageUrl(croppedImageBase64);

              props.onChange?.(croppedImageBase64);
              toggleModal();
            }}
          />
        )}
      </div>
    );
  }
);

ImageUploadInput.displayName = "ImageUploadInput";

import React from "react";

import useModal from "~/hooks/useModal";
import { toBase64 } from "~/utils/toBase64";

import CropDialog from "./CropDialog";
import Dropzone from "./Dropzone";
import ImagePreview from "./ImagePreview";

export type ImageUploadInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & { onChange: (file: string | ArrayBuffer) => void };

const ImageUploadInput = (props: ImageUploadInputProps) => {
  const { isModalOpen, toggleModal } = useModal();

  const [newUploadedImageUrl, setNewUploadedImageUrl] = React.useState("");
  const [croppedImageUrl, setCroppedImageUrl] = React.useState("");

  return (
    <>
      {croppedImageUrl ? (
        <ImagePreview
          croppedImageUrl={croppedImageUrl}
          onClick={() => setCroppedImageUrl("")}
        />
      ) : (
        <Dropzone
          {...props}
          onDrop={(files) => {
            // TODO: COVER VALIDATION FOR SIZE
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
      <CropDialog
        uploadedImageUrl={newUploadedImageUrl}
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        onCropFinish={async (croppedImageUrl, croppedImageBlob) => {
          const base64File = await toBase64(croppedImageBlob);
          setCroppedImageUrl(croppedImageUrl);
          //CHANGE ON WHAT WE WANT SEND TO BE URL OR BLOB

          if (base64File) {
            props.onChange?.(base64File);
            toggleModal();
          }
        }}
      />
    </>
  );
};

export default ImageUploadInput;

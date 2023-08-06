import React from "react";
import {
  FixedCropper,
  type FixedCropperRef,
  ImageRestriction,
} from "react-advanced-cropper";

import Button from "~/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
import useForceUpdate from "~/hooks/useForceUpdate";

const CROP_AREA_WIDTH = 225;
const CROP_AREA_HEIGHT = 225;

type Props = {
  uploadedImageUrl: string;
  isModalOpen: boolean;
  onCropFinish?: (croppedImageBase64: string) => void;
  toggleModal: () => void;
};

const CropperDialog = ({
  uploadedImageUrl,
  isModalOpen,
  onCropFinish,
  toggleModal,
}: Props) => {
  const cropperRef = React.useRef<FixedCropperRef>(null);

  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    // wait until cropper is loaded
    if (!cropperRef.current?.isLoaded()) {
      forceUpdate();
    }

    // trigger refresh to make crop area at the middle of image
    if (cropperRef.current?.isLoaded()) {
      cropperRef.current?.refresh();
    }
  }, [forceUpdate]);

  const finishCropImage = () => {
    if (cropperRef.current) {
      // You are able to do different manipulations at a canvas
      // but there we just get a cropped image, that can be used
      // as src for <img/> to preview result
      const croppedImageBase64 = cropperRef.current.getCanvas()?.toDataURL();

      if (croppedImageBase64) {
        onCropFinish?.(croppedImageBase64);
      }
    }
  };

  return (
    <>
      {/* Modal to allow the user to zoom & crop the uploading image into appropriate aspect ratio  */}
      <Dialog open={isModalOpen} onOpenChange={toggleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>

          <div className="w-ful flex h-72 items-center justify-center overflow-hidden rounded-md border bg-muted">
            <FixedCropper
              ref={cropperRef}
              src={uploadedImageUrl}
              stencilProps={{
                handlers: false,
                lines: true,
                movable: false,
                resizable: false,
                aspectRatio: 1 / 1,
              }}
              stencilSize={{
                width: CROP_AREA_WIDTH,
                height: CROP_AREA_HEIGHT,
              }}
              imageRestriction={ImageRestriction.stencil}
            />
          </div>

          <DialogFooter>
            <Button onClick={finishCropImage}>Crop image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CropperDialog;

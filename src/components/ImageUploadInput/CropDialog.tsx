import React from "react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
import { Label } from "~/components/ui/Label";
import { Slider } from "~/components/ui/Slider";
import { getCroppedImg } from "~/utils/getCroppedImage";

type Props = {
  uploadedImageUrl: string;
  isModalOpen: boolean;
  onCropFinish?: (croppedImageUrl: string, croppedImageBlob: Blob) => void;
  toggleModal: () => void;
};

const CropDialog = ({
  uploadedImageUrl,
  isModalOpen,
  onCropFinish,
  toggleModal,
}: Props) => {
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
    null
  );

  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  const onCropComplete = React.useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const finishCropImage = React.useCallback(async () => {
    if (croppedAreaPixels) {
      const croppedImageBlob = await getCroppedImg({
        imageSrc: uploadedImageUrl,
        pixelCrop: croppedAreaPixels,
        rotation,
      });

      if (croppedImageBlob) {
        const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
        onCropFinish?.(croppedImageUrl, croppedImageBlob);
      }
    }
  }, [croppedAreaPixels, uploadedImageUrl, rotation, onCropFinish]);

  return (
    <>
      {/* Modal to allow the user to zoom & crop the uploading image into appropriate aspect ratio  */}
      <Dialog open={isModalOpen} onOpenChange={toggleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>

          <div className="w-ful relative h-72 overflow-hidden rounded-md border bg-muted">
            <Cropper
              image={uploadedImageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
            />
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="zoom">Zoom</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {zoom.toFixed(1)}
              </span>
            </div>
            <Slider
              id="zoom"
              value={[zoom]}
              max={3}
              min={1}
              step={0.1}
              onValueChange={([value]) => {
                if (value) {
                  setZoom(value);
                }
              }}
            />
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="rotation">Rotation</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {rotation}
              </span>
            </div>
            <Slider
              id="rotation"
              value={[rotation]}
              max={360}
              min={0}
              step={1}
              onValueChange={([value]) => {
                if (typeof value === "number") {
                  setRotation(value);
                }
              }}
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

export default CropDialog;

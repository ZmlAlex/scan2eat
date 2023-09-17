import downloadjs from "downloadjs";
import html2canvas from "html2canvas";
import Link from "next/link";
import React from "react";
import QRCode from "react-qr-code";

import { Icons } from "~/components/Icons";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/Alert";
import { Button } from "~/components/ui/Button";
import { ClipboardCopy } from "~/components/ui/ClipboardCopy";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
import { Switch } from "~/components/ui/Switch";
import { toast } from "~/components/ui/useToast";
import { api } from "~/utils/api";

type Props = {
  isModalOpen: boolean;
  isPublished: boolean;
  toggleModal: () => void;
  restaurantId: string;
};

const RestaurantPublishForm = ({
  restaurantId,
  isPublished,
  isModalOpen,
  toggleModal,
}: Props) => {
  const [isRestaurantPublished, setIsRestaurantPublished] =
    React.useState(isPublished);

  const qrCode = React.useRef(null);

  const trpcContext = api.useContext();

  const { mutate: publishRestaurant, isLoading } =
    api.restaurant.setPublishedRestaurant.useMutation({
      onError: () =>
        toast({
          title: "Something went wrong.",
          description:
            "Your update restaurant's status request failed. Please try again.",
          variant: "destructive",
        }),
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurant.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        const action = updatedRestaurant.isPublished
          ? "published"
          : "unpublished";

        toast({
          title: `Restaurant has been ${action}.`,
        });
      },
    });

  const handleDownloadQRCode = async () => {
    const qrCodeElement = qrCode.current;
    if (!qrCodeElement) return;

    const canvas = await html2canvas(qrCodeElement);
    const dataURL = canvas.toDataURL("image/png");
    downloadjs(dataURL, "qr-code.png", "image/png");
  };

  const handleCheckedChange = (isPublished: boolean) => {
    setIsRestaurantPublished(isPublished);
    publishRestaurant({ isPublished, restaurantId });
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const menuUrl = `${origin}/restaurants/${restaurantId}`;
  const menuUrlPreview = `${menuUrl}/preview`;

  return (
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Publish and share your restaurant</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert variant={isRestaurantPublished ? "success" : "warning"}>
            {isRestaurantPublished ? (
              <Icons.checkCircle2 className="h-5 w-5" />
            ) : (
              <Icons.warning className="h-5 w-5" />
            )}

            <AlertTitle>
              {isRestaurantPublished
                ? "Restaurant is published"
                : "Restaurant is not published"}
            </AlertTitle>
            <AlertDescription>
              {isRestaurantPublished ? (
                <div className="flex  justify-between gap-2 text-sm [overflow-wrap:anywhere]">
                  <Link className="block" href={menuUrl} target="_blank">
                    {menuUrl}
                  </Link>
                  <ClipboardCopy className="flex-shrink-0" copyText={menuUrl} />
                </div>
              ) : (
                "Please publish the restaurant once you have finalized your changes. Once published, you will be able to either share the direct URL or the QR code for your menu, with your customers"
              )}
            </AlertDescription>
          </Alert>
        </div>
        <div className="flex justify-between rounded-lg bg-muted p-4">
          <p>Publish Restaurant</p>
          <Switch
            checked={isRestaurantPublished}
            onCheckedChange={handleCheckedChange}
          />
        </div>
        {isRestaurantPublished && (
          <div className="grid justify-center gap-4">
            <div ref={qrCode}>
              <QRCode
                style={{ maxWidth: "100%", width: "100%" }}
                value="blabla"
              />
            </div>
            <Button
              className="mx-auto"
              variant="outline"
              onClick={handleDownloadQRCode}
            >
              <Icons.download className="mr-2" />
              Download QR code
            </Button>
          </div>
        )}
        <div className="min-w-0 space-y-4 rounded-lg bg-muted p-4">
          <p>Preview URL</p>
          <p className="text-sm">
            The following URL can be used for testing purposes as it will mimic
            the interface of actual menu while also updating in real time
          </p>
          <div className="flex justify-between gap-2 text-sm [overflow-wrap:anywhere]">
            <Link className="block" href={menuUrlPreview} target="_blank">
              {menuUrlPreview}
            </Link>
            <ClipboardCopy
              className="flex-shrink-0"
              copyText={menuUrlPreview}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantPublishForm;

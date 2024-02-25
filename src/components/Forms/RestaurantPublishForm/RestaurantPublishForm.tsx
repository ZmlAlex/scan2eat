import downloadjs from "downloadjs";
import html2canvas from "html2canvas";
import Link from "next/link";
import { useTranslations } from "next-intl";
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
import { errorMapper } from "~/helpers/errorMapper";
import { clientApi } from "~/libs/trpc/client";
import { useGetRestaurantWithUserCheck } from "~/libs/trpc/hooks/useGetRestaurantWithUserCheck";

type Props = {
  isModalOpen: boolean;
  toggleModal: () => void;
};

export const RestaurantPublishForm = ({ isModalOpen, toggleModal }: Props) => {
  const {
    data: { id: restaurantId, ...restaurant },
  } = useGetRestaurantWithUserCheck();

  const [isRestaurantPublished, setIsRestaurantPublished] = React.useState(
    restaurant.isPublished
  );

  const qrCode = React.useRef(null);

  const trpcContext = clientApi.useContext();

  const t = useTranslations("Form.restaurantPublish");
  const tError = useTranslations("ResponseErrorMessage");

  // TODO: ADD LOADER DURING PROCESS
  const { mutate: setPublishRestaurant, isLoading } =
    clientApi.restaurant.setPublishedRestaurant.useMutation({
      onError: (error) => {
        const errorMessage = errorMapper(error.message);

        toast({
          title: tError(errorMessage),
          variant: "destructive",
        });
      },
      onSuccess: (updatedRestaurant) => {
        trpcContext.restaurant.getRestaurantWithUserCheck.setData(
          { restaurantId },
          () => updatedRestaurant
        );

        const action = updatedRestaurant.isPublished
          ? t("setPublishRestaurantMutation.success.published.title")
          : t("setPublishRestaurantMutation.success.unpublished.title");

        toast({
          title: action,
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
    setPublishRestaurant({ isPublished, restaurantId });
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const menuUrl = `${origin}/restaurants/${restaurantId}`;
  const menuUrlPreview = `${menuUrl}/preview`;

  return (
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
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
                ? t("statusCard.title.published")
                : t("statusCard.title.unpublished")}
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
                t("statusCard.description.unpublished")
              )}
            </AlertDescription>
          </Alert>
        </div>
        <div className="flex justify-between rounded-lg bg-muted p-4">
          <p>{t("switcherLabel")}</p>
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
                value={menuUrl}
              />
            </div>
            <Button
              className="mx-auto"
              variant="outline"
              onClick={handleDownloadQRCode}
            >
              <Icons.download className="mr-2" />
              {t("qrButtonLabel")}
            </Button>
          </div>
        )}
        <div className="min-w-0 space-y-4 rounded-lg bg-muted p-4">
          <p>{t("previewCard.title")}</p>
          <p className="text-sm">{t("previewCard.description")}</p>
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

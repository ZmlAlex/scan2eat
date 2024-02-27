import { useTranslations } from "next-intl";
import React from "react";
import { toast } from "sonner";

import { Icons } from "~/components/Icons";
import { cn } from "~/libs/cn";

type Props = {
  className?: string;
  copyText: string;
};

export function ClipboardCopy({ className, copyText }: Props) {
  const [isCopied, setIsCopied] = React.useState(false);

  const t = useTranslations("Common.clipboardCopy");

  React.useEffect(() => {
    if (isCopied) {
      toast.success(t("title"));
    }
  }, [isCopied, t]);

  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Icons.copy
      onClick={handleCopyClick}
      className={cn("h-5 w-5 cursor-pointer", className)}
    />
  );
}

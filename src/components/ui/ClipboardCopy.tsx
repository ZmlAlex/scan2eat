import React from "react";

import { Icons } from "~/components/Icons";
import { cn } from "~/libs/cn";

import { toast } from "./useToast";

type Props = {
  className?: string;
  copyText: string;
};

export function ClipboardCopy({ className, copyText }: Props) {
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    if (isCopied) {
      toast({
        title: "Copied! ✅",
        description: "A short permalink has been copied to your clipboard",
      });
    }
  }, [isCopied]);

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

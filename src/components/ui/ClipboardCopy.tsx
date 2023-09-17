import React from "react";

import { Icons } from "~/components/Icons";
import { cn } from "~/utils/cn";

type Props = {
  className?: string;
  copyText: string;
};

export function ClipboardCopy({ className, copyText }: Props) {
  const [isCopied, setIsCopied] = React.useState(false);

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

  //TODO: ADD HERE ANIMATION
  return (
    <Icons.copy
      onClick={handleCopyClick}
      className={cn("h-5 w-5 cursor-pointer", className)}
    />
  );
}

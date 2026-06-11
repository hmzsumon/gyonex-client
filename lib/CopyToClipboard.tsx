"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiFileCopyFill } from "react-icons/ri";

type CopyToClipboardProps = {
  text: string;
  size?: string;
  textColor?: string;
};

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  size,
  textColor = "text-gray-600",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isCopied) {
      timeout = setTimeout(() => setIsCopied(false), 3000);
      toast.success("Copied to clipboard");
    }

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={copyToClipboard}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          copyToClipboard();
        }
      }}
      className="flex items-center cursor-pointer"
    >
      <RiFileCopyFill
        className={`inline-block ml-1 ${size ? size : "text-sm"} ${
          isCopied ? "text-htx-blue" : textColor
        }`}
      />
    </span>
  );
};

export default CopyToClipboard;

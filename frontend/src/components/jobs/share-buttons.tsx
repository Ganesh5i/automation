"use client";

import { Share2, MessageCircle, Send, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SITE_NAME } from "@/lib/constants";

interface ShareButtonsProps {
  title: string;
  searchCode: string;
}

export function ShareButtons({ title, searchCode }: ShareButtonsProps) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/job/${searchCode}`
      : `/job/${searchCode}`;

  const text = `${title} at ${SITE_NAME} (${searchCode})`;

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
      "_blank"
    );
  };

  const shareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={nativeShare} className="gap-2">
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      <Button variant="outline" size="sm" onClick={shareWhatsApp} className="gap-2">
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </Button>
      <Button variant="outline" size="sm" onClick={shareTelegram} className="gap-2">
        <Send className="h-4 w-4" />
        Telegram
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink} className="gap-2">
        <Link2 className="h-4 w-4" />
        Copy Link
      </Button>
    </div>
  );
}

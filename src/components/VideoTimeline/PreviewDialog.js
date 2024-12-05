import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  DialogTitle,
} from "@headlessui/react";
import Hls from "hls.js";

export const PreviewDialog = ({
  source,
  videoStartTime,
  videoEndTime,
  open,
  setOpen,
}) => {
  const previewRef = useRef(null);

  useEffect(() => {
    if (!previewRef.current || !open) {
      return;
    }

    if (source?.type === "hls" && previewRef.current !== null) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(source?.url);
        hls.attachMedia(previewRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          previewRef.current.currentTime = videoStartTime;
          previewRef.current
            .play()
            .catch((error) => console.log("Play failed:", error));
        });
      }
    } else if (source?.url) {
      previewRef.current.src = source.url;
      previewRef.current.currentTime = videoStartTime;
      previewRef.current
        .play()
        .catch((error) => console.log("Play failed:", error));
    }

    const handleTimeUpdate = () => {
      if (previewRef.current?.currentTime >= videoEndTime) {
        previewRef.current.pause();
      }
    };

    previewRef.current?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (previewRef.current) {
        previewRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
        previewRef.current?.pause();
      }
    };
  }, [source, open, previewRef.current]);

  return (
    <Dialog
      open={open}
      as="div"
      className="w-[1000px] h-[760px] relative z-10 focus:outline-none"
      onClose={() => setOpen(false)}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/70" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-[1000px] gap-4 rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
              Clip Preview
            </DialogTitle>
            {open && (
              <video
                ref={previewRef}
                className="w-full aspect-video"
                controls
              />
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

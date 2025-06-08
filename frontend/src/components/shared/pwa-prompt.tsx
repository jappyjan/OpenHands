import React, { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAPromptProps {
  onClose?: () => void;
}

export function PWAPrompt({ onClose }: PWAPromptProps) {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line no-console
      console.log(`SW Registered: ${r}`);
    },
    onRegisterError(error) {
      // eslint-disable-next-line no-console
      console.log("SW registration error", error);
    },
  });

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        toast.success("OpenHands installed successfully!");
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleUpdateClick = () => {
    updateServiceWorker(true);
  };

  const handleCloseOfflineReady = () => {
    setOfflineReady(false);
    onClose?.();
  };

  const handleCloseNeedRefresh = () => {
    setNeedRefresh(false);
    onClose?.();
  };

  const handleCloseInstallPrompt = () => {
    setShowInstallPrompt(false);
    onClose?.();
  };

  if (offlineReady) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">App ready to work offline</h4>
              <p className="text-sm opacity-90">
                OpenHands is now available offline!
              </p>
            </div>
            <Button
              size="sm"
              variant="light"
              onPress={handleCloseOfflineReady}
              className="text-white hover:bg-green-700"
            >
              ✕
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (needRefresh) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">New content available</h4>
              <p className="text-sm opacity-90">
                Click reload to update to the latest version.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                color="primary"
                variant="solid"
                onPress={handleUpdateClick}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Reload
              </Button>
              <Button
                size="sm"
                variant="light"
                onPress={handleCloseNeedRefresh}
                className="text-white hover:bg-blue-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showInstallPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <div className="bg-purple-600 text-white p-4 rounded-lg shadow-lg">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">Install OpenHands</h4>
              <p className="text-sm opacity-90">
                Install OpenHands for a better experience with offline support.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                color="primary"
                variant="solid"
                onPress={handleInstallClick}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Install
              </Button>
              <Button
                size="sm"
                variant="light"
                onPress={handleCloseInstallPrompt}
                className="text-white hover:bg-purple-700"
              >
                Not now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
